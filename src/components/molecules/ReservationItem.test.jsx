import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ReservationItem from "./ReservationItem";

const invalidateQueries = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("../../apis/reservations", () => ({ cancelReservation: vi.fn() }));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries }),
  useMutation: (options) => ({ mutate: () => options.onSuccess() }),
}));
vi.mock("../atoms/CustomModal", () => ({
  default: ({ onConfirm }) => (
    <button onClick={onConfirm}>confirm cancellation</button>
  ),
}));

describe("예약 취소 후 내역 갱신", () => {
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
});
