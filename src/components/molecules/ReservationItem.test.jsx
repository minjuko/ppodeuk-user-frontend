import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ReservationItem from "./ReservationItem";

const invalidateQueries = vi.fn();
const showToast = vi.hoisted(() => vi.fn());
const mutationState = vi.hoisted(() => ({ fail: false }));

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("../../apis/reservations", () => ({ cancelReservation: vi.fn() }));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries }),
  useMutation: (options) => ({
    mutate: () =>
      mutationState.fail ? options.onError({}) : options.onSuccess(),
  }),
}));
vi.mock("../feedback/ToastProvider", () => ({
  useToast: () => ({ showToast }),
}));
vi.mock("../atoms/CustomModal", () => ({
  default: ({ onConfirm }) => (
    <button onClick={onConfirm}>confirm cancellation</button>
  ),
}));

describe("예약 취소 후 내역 갱신", () => {
  it("취소 실패는 확인 모달을 띄우지 않고 재시도 가능한 토스트로 알린다", () => {
    mutationState.fail = true;
    showToast.mockClear();
    render(
      <MemoryRouter>
        <ReservationItem
          rsvid={1}
          carwashid={2}
          imgsrc="/test.png"
          reservedTime={{
            start: "2026-08-11T10:00",
            end: "2026-08-11T11:00",
          }}
          bayname="테스트 베이"
          priceinfo={10000}
          buttontype="cancel"
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "예약 취소" }));
    fireEvent.click(
      screen.getByRole("button", { name: "confirm cancellation" }),
    );

    expect(showToast).toHaveBeenCalledWith({
      message: "예약 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      tone: "error",
    });
    mutationState.fail = false;
  });

  it("페이지 reload 대신 현재 예약 내역 query를 invalidate한다", () => {
    render(
      <MemoryRouter>
        <ReservationItem
          rsvid={1}
          carwashid={2}
          imgsrc="/test.png"
          reservedTime={{
            start: "2026-08-11T10:00",
            end: "2026-08-11T11:00",
          }}
          bayname="테스트 베이"
          priceinfo={10000}
          buttontype="cancel"
        />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "confirm cancellation" }),
    );
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["getHistory"],
    });
  });

  it("리뷰를 작성한 예약은 작성 버튼 대신 완료 상태를 표시한다", () => {
    render(
      <MemoryRouter>
        <ReservationItem
          rsvid={1}
          carwashid={2}
          imgsrc="/test.png"
          reservedTime={{
            start: "2026-08-11T10:00",
            end: "2026-08-11T11:00",
          }}
          bayname="테스트 베이"
          priceinfo={10000}
          buttontype="review"
          reviewed
        />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("button", { name: "리뷰 작성" })).toBeNull();
    expect(screen.getByText("작성 완료")).toBeInTheDocument();
  });
});
