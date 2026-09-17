import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { handlers, isApplicationApiRequest, resetDemoState } from "./handlers";
import { DEMO_CREDENTIALS } from "./demoData";
import { login } from "../apis/user";
import {
  calculatePayment,
  carwashesBays,
  carwashesInfo,
  carwashesRecommended,
  postReviews,
} from "../apis/carwashes";
import { pgapprove, pgpayment } from "../apis/payment";
import {
  cancelReservation,
  reservationsCurrentstatus,
} from "../apis/reservations";
import { instance } from "../apis/instance";
import {
  buildReservationPayload,
  getAvailableDurations,
  normalizeOpeningHours,
} from "../utils/reservationTime";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  localStorage.clear();
  resetDemoState();
  server.resetHandlers();
});
afterAll(() => server.close());

const authenticate = async () => {
  const response = await login(DEMO_CREDENTIALS);
  localStorage.setItem("token", response.headers.authorization);
};

describe("Portfolio Demo 사용자 흐름", () => {
  it("logs in, selects an available reservation, and confirms it through demo payment", async () => {
    await authenticate();
    const detail = await carwashesInfo(101);
    const bays = await carwashesBays(101);
    const selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + 1);
    const openingHours = normalizeOpeningHours(detail.data.response.optime);
    const openingPeriod =
      selectedDate.getDay() === 0 || selectedDate.getDay() === 6
        ? openingHours.weekend
        : openingHours.weekday;
    const bay = bays.data.response.bayList[0];
    const durations = getAvailableDurations({
      selectedDate,
      startTime: "11:00",
      openingPeriod,
      bookedTimeList: bay.bayBookedTimeList,
    });
    expect(durations).toContain(60);

    const saveDTO = buildReservationPayload(
      bay.bayId,
      selectedDate,
      "11:00",
      60,
    );
    const price = await calculatePayment(bay.bayId, {
      startTime: saveDTO.startTime,
      endTime: saveDTO.endTime,
    });
    const ready = await pgpayment({
      requestDto: { total_amount: price.data.response.price },
      saveDTO,
    });
    const approved = await pgapprove({
      payApprovalRequestDTO: {
        tid: ready.data.response.tid,
        pg_token: "portfolio-demo-approved",
      },
      saveDTO,
    });
    const history = await reservationsCurrentstatus();

    expect(approved.data.response.reservation.price).toBe(12000);
    expect(history.data.response.upcomingReservationList[0].time).toEqual({
      start: saveDTO.startTime,
      end: saveDTO.endTime,
    });
  });
  it("데모 계정으로 로그인하고 명시적인 데모 토큰을 받는다", async () => {
    const response = await login(DEMO_CREDENTIALS);

    expect(response.headers.authorization).toBe("Bearer portfolio-demo-token");
  });

  it("세차장 목록, 09:30 상세 영업시간과 예약된 Bay 시간을 제공한다", async () => {
    const recommended = await carwashesRecommended(35.14, 126.9);
    const detail = await carwashesInfo(101);
    const bays = await carwashesBays(101);

    expect(recommended.data.response[0].id).toBe(101);
    expect(recommended.data.response[0].image).toEqual({
      url: "/carouselimage1.jpg",
    });
    expect(detail.data.response.imageFileList).toEqual([
      { url: "/carouselimage1.jpg" },
    ]);
    expect(detail.data.response.keywordIdList).toEqual([8, 10, 11]);
    expect(detail.data.response.optime.weekday).toEqual({
      start: "09:30",
      end: "18:30",
    });
    expect(bays.data.response.bayList[0].bayBookedTimeList).toHaveLength(2);
  });

  it("선택한 60분 예약의 가격을 기존 endpoint 계약으로 계산한다", async () => {
    await authenticate();
    const price = await calculatePayment(1011, {
      startTime: "2026-08-12T11:00",
      endTime: "2026-08-12T12:00",
    });

    expect(price.data.response.price).toBe(12000);
  });

  it("결제 ready와 approve 후 생성한 예약이 예약 내역에 반영된다", async () => {
    await authenticate();
    const saveDTO = {
      bayId: 1011,
      startTime: "2026-08-12T11:00",
      endTime: "2026-08-12T12:00",
    };
    const ready = await pgpayment({
      requestDto: { total_amount: 12000 },
      saveDTO,
    });
    const approved = await pgapprove({
      payApprovalRequestDTO: {
        tid: ready.data.response.tid,
        pg_token: "portfolio-demo-approved",
      },
      saveDTO,
    });
    const history = await reservationsCurrentstatus();

    expect(ready.data.response.next_redirect_pc_url).toContain(
      "/paymentwaiting?pg_token=portfolio-demo-approved",
    );
    expect(approved.data.response.reservation.price).toBe(12000);
    expect(history.data.response.upcomingReservationList[0].time).toEqual({
      start: saveDTO.startTime,
      end: saveDTO.endTime,
    });
  });

  it("예약 취소 후 같은 demo session의 예약 내역에서 제거한다", async () => {
    await authenticate();
    await cancelReservation(501);
    const history = await reservationsCurrentstatus();

    expect(history.data.response.upcomingReservationList).toEqual([]);
  });

  it("리뷰 등록 후 세차장 리뷰 조회에 즉시 반영한다", async () => {
    await authenticate();
    await postReviews({
      carwashId: 101,
      reservationId: 401,
      keywordIdList: [3],
      rate: 4,
      comment: "데모 리뷰입니다.",
    });
    const response = await instance.get("/api/open/carwashes/101/reviews");

    expect(response.data.response.reviewList[0].comment).toBe(
      "데모 리뷰입니다.",
    );
    expect(response.data.response.overview.totalCnt).toBe(2);
  });

  it("등록되지 않은 API는 실제 네트워크로 통과시키지 않고 mock error를 반환한다", async () => {
    await expect(
      instance.get("/api/user/not-registered"),
    ).rejects.toMatchObject({
      response: {
        status: 501,
        data: { error: { code: "DEMO_UNHANDLED_API" } },
      },
    });
  });

  it("정적 asset 요청은 fail-closed API handler의 영향을 받지 않는다", async () => {
    let reachedAssetHandler = false;
    server.use(
      rest.get("http://localhost/demo-image.png", (req, res, ctx) => {
        reachedAssetHandler = true;
        return res(ctx.status(200));
      }),
    );

    await fetch("http://localhost/demo-image.png");
    expect(reachedAssetHandler).toBe(true);
  });

  it("registered application API remains handled by its demo handler", async () => {
    const response = await instance.get("/api/open/carwashes/recommended");

    expect(response.status).toBe(200);
    expect(response.data.response[0].id).toBe(101);
  });

  it.each([
    [
      "Kakao map tile",
      "http://mts.daumcdn.net/api/v1/tile/PNG02/v22_yidbg/latest/7/60/55.png",
    ],
    ["external CDN asset", "https://cdn.example.com/images/carwash.png"],
  ])("does not classify a %s request as an application API", (_, url) => {
    expect(isApplicationApiRequest(url, "http://localhost")).toBe(false);
  });

  it("classifies same-origin /api/* requests as application APIs", () => {
    expect(
      isApplicationApiRequest(
        "http://localhost/api/not-registered",
        "http://localhost",
      ),
    ).toBe(true);
  });
});
