import { rest } from "msw";
import {
  createDemoState,
  DEMO_CREDENTIALS,
  demoBookedTimes,
  demoCarwashes,
} from "./demoData";
import { getDemoDate } from "../utils/demoDate";

const ok = (response) => ({ success: true, response, error: null });
const fail = (code, message) => ({
  success: false,
  response: null,
  error: { code, message },
});

let state = createDemoState();

const applicationApiOrigin = new URL(
  import.meta.env.VITE_API_BASE_URL,
  window.location.origin,
).origin;

export const resetDemoState = () => {
  state = createDemoState();
};

export const isApplicationApiRequest = (
  requestUrl,
  applicationOrigin = applicationApiOrigin,
) => {
  const url = new URL(requestUrl, applicationOrigin);
  return url.origin === applicationOrigin && url.pathname.startsWith("/api/");
};

const requireDemoAuth = (req, res, ctx) => {
  if (req.headers.get("Authorization") !== "Bearer portfolio-demo-token") {
    return res(
      ctx.status(401),
      ctx.json(fail("DEMO_AUTH", "데모 로그인이 필요합니다.")),
    );
  }
  return null;
};

const getCarwash = (id) => demoCarwashes.find((item) => item.id === Number(id));

const distanceInMeters = (
  fromLatitude,
  fromLongitude,
  toLatitude,
  toLongitude,
) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const earthRadius = 6371000;
  const latitudeDelta = toRadians(toLatitude - fromLatitude);
  const longitudeDelta = toRadians(toLongitude - fromLongitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(fromLatitude)) *
      Math.cos(toRadians(toLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return Math.round(
    earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
  );
};

const getCarwashesByDistance = (req) => {
  const latitude = Number(req.url.searchParams.get("latitude"));
  const longitude = Number(req.url.searchParams.get("longitude"));
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return [...demoCarwashes].sort((a, b) => a.distance - b.distance);
  }

  return demoCarwashes
    .map((carwash) => ({
      ...carwash,
      distance: distanceInMeters(
        latitude,
        longitude,
        carwash.location.latitude,
        carwash.location.longitude,
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};

const historyResponse = () => ({
  currentReservationList: state.reservations.filter(
    (item) => item.status === "current",
  ),
  upcomingReservationList: state.reservations.filter(
    (item) => item.status === "upcoming",
  ),
  completeReservationList: state.reservations
    .filter((item) => item.status === "complete")
    .map((item) => ({
      ...item,
      reviewed: state.reviews.some(
        (review) => Number(review.reservationId) === item.id,
      ),
    })),
});

export const handlers = [
  rest.post("*/api/open/login/user", async (req, res, ctx) => {
    const credentials = await req.json();
    if (
      credentials.email !== DEMO_CREDENTIALS.email ||
      credentials.password !== DEMO_CREDENTIALS.password
    ) {
      return res(
        ctx.status(401),
        ctx.json(fail("1201", "데모 계정 정보를 확인해 주세요.")),
      );
    }
    return res(
      ctx.set("Authorization", "Bearer portfolio-demo-token"),
      ctx.json(ok(null)),
    );
  }),

  rest.get("*/api/common/member/info", (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    return unauthorized || res(ctx.json(ok({ name: "test" })));
  }),

  rest.get("*/api/open/carwashes/recommended", (req, res, ctx) =>
    res(ctx.json(ok([demoCarwashes[0]]))),
  ),
  rest.get("*/api/open/carwashes/nearby", (req, res, ctx) =>
    res(ctx.json(ok(getCarwashesByDistance(req)))),
  ),
  rest.get("*/api/open/carwashes/search", (req, res, ctx) =>
    res(ctx.json(ok(getCarwashesByDistance(req)))),
  ),
  rest.get("*/api/open/carwashes/:carwashId/info", (req, res, ctx) => {
    const carwash = getCarwash(req.params.carwashId);
    return carwash
      ? res(ctx.json(ok(carwash)))
      : res(
          ctx.status(404),
          ctx.json(fail("DEMO_NOT_FOUND", "세차장을 찾을 수 없습니다.")),
        );
  }),
  rest.get("*/api/open/carwashes/:carwashId/bays", (req, res, ctx) => {
    const carwash = getCarwash(req.params.carwashId);
    if (!carwash)
      return res(
        ctx.status(404),
        ctx.json(fail("DEMO_NOT_FOUND", "세차장을 찾을 수 없습니다.")),
      );
    const baseId = carwash.id * 10;
    const bayList = Array.from({ length: carwash.bayCnt }, (_, index) => ({
      bayId: baseId + index + 1,
      bayNo: index + 1,
      bayBookedTimeList: demoBookedTimes(carwash.id, baseId + index + 1),
    }));
    return res(ctx.json(ok({ bayList })));
  }),
  rest.get("*/api/open/carwashes/:carwashId/reviews", (req, res, ctx) => {
    const reviews = state.reviews.filter(
      (review) => review.carwashId === Number(req.params.carwashId),
    );
    const keywordCounts = new Map();
    reviews.forEach((review) =>
      review.keywordIdList.forEach((id) =>
        keywordCounts.set(id, (keywordCounts.get(id) || 0) + 1),
      ),
    );
    return res(
      ctx.json(
        ok({
          overview: {
            rate: reviews.length
              ? reviews.reduce((sum, review) => sum + review.rate, 0) /
                reviews.length
              : 0,
            totalCnt: reviews.length,
            reviewKeywordList: [...keywordCounts].map(([id, count]) => ({
              id,
              count,
            })),
          },
          reviewList: reviews,
        }),
      ),
    );
  }),

  rest.get("*/api/user/reservations/recent", (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    if (unauthorized) return unauthorized;
    return res(
      ctx.json(
        ok({
          recentReservationList: state.reservations
            .filter((item) => item.status === "complete")
            .slice(0, 5)
            .map((item) => ({
              carwashId: item.carwashId,
              carwashName: item.carwashName,
              image: item.image,
              date: item.time.start.slice(0, 10),
            })),
        }),
      ),
    );
  }),
  rest.get("*/api/user/reservations/current-status", (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    return unauthorized || res(ctx.json(ok(historyResponse())));
  }),
  rest.delete("*/api/user/reservations/:reservationId", (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    if (unauthorized) return unauthorized;
    const id = Number(req.params.reservationId);
    state.reservations = state.reservations.filter((item) => item.id !== id);
    return res(ctx.json(ok(null)));
  }),
  rest.put("*/api/user/reservations/:reservationId", async (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    if (unauthorized) return unauthorized;
    const item = state.reservations.find(
      (entry) => entry.id === Number(req.params.reservationId),
    );
    if (!item)
      return res(
        ctx.status(404),
        ctx.json(fail("DEMO_NOT_FOUND", "예약을 찾을 수 없습니다.")),
      );
    item.time = await req.json();
    return res(ctx.json(ok(null)));
  }),

  rest.post("*/api/user/carwashes/:bayId/payment", async (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    if (unauthorized) return unauthorized;
    const body = await req.json();
    const duration =
      (new Date(body.endTime) - new Date(body.startTime)) / 60000;
    return res(ctx.json(ok({ price: Math.max(0, duration / 30) * 6000 })));
  }),
  rest.post("*/api/user/payment/ready", async (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    if (unauthorized) return unauthorized;
    state.pendingPayment = await req.json();
    const callback = `${window.location.origin}/paymentwaiting?pg_token=portfolio-demo-approved`;
    return res(
      ctx.json(
        ok({
          tid: "portfolio-demo-tid",
          next_redirect_mobile_url: callback,
          next_redirect_pc_url: callback,
        }),
      ),
    );
  }),
  rest.post("*/api/user/payment/approve", async (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    if (unauthorized) return unauthorized;
    const body = await req.json();
    if (
      body?.payApprovalRequestDTO?.tid !== "portfolio-demo-tid" ||
      body?.payApprovalRequestDTO?.pg_token !== "portfolio-demo-approved" ||
      !state.pendingPayment
    ) {
      return res(
        ctx.status(400),
        ctx.json(fail("DEMO_PAYMENT", "유효하지 않은 데모 결제입니다.")),
      );
    }
    const carwash = demoCarwashes.find(
      (item) =>
        body.saveDTO.bayId >= item.id * 10 &&
        body.saveDTO.bayId < item.id * 10 + 10,
    );
    const price = state.pendingPayment.requestDto.total_amount;
    const reservation = {
      id: state.nextReservationId++,
      time: { start: body.saveDTO.startTime, end: body.saveDTO.endTime },
      carwashId: carwash.id,
      carwashName: carwash.name,
      bayNum: body.saveDTO.bayId - carwash.id * 10,
      price,
      image: carwash.image,
      status: "upcoming",
    };
    state.reservations.unshift(reservation);
    state.pendingPayment = null;
    return res(
      ctx.json(
        ok({
          reservation: {
            reservationId: reservation.id,
            time: reservation.time,
            price: reservation.price,
            bayNo: reservation.bayNum,
          },
          carwash: {
            name: carwash.name,
            location: carwash.location,
            carwashImages: [],
          },
        }),
      ),
    );
  }),
  rest.post("*/api/user/reviews", async (req, res, ctx) => {
    const unauthorized = requireDemoAuth(req, res, ctx);
    if (unauthorized) return unauthorized;
    const review = await req.json();
    const isDuplicate = state.reviews.some(
      (item) => Number(item.reservationId) === Number(review.reservationId),
    );
    if (isDuplicate) {
      return res(
        ctx.status(409),
        ctx.json(
          fail("REVIEW_ALREADY_EXISTS", "이미 리뷰를 작성한 예약입니다."),
        ),
      );
    }
    state.reviews.unshift({
      ...review,
      username: "데모 사용자",
      created_at: getDemoDate().toISOString().slice(0, 16),
    });
    return res(ctx.json(ok(null)));
  }),

  rest.all("*", (req, res, ctx) => {
    if (!isApplicationApiRequest(req.url.href)) return req.passthrough();

    return res(
      ctx.status(501),
      ctx.json(
        fail(
          "DEMO_UNHANDLED_API",
          `Demo Mode에 등록되지 않은 API입니다: ${req.method} ${req.url.pathname}`,
        ),
      ),
    );
  }),
];
