import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ReservationHistoryTemplate from "./ReservationHistoryTemplate";

vi.mock("@tanstack/react-query", () => ({
  useSuspenseQuery: () => ({ data: { data: { response: {} } } }),
}));
vi.mock("../molecules/ReservationItem", () => ({ default: () => null }));
vi.mock("../../apis/reservations", () => ({
  reservationsCurrentstatus: vi.fn(),
}));

describe("예약 내역 empty 상태", () => {
  it("누락되거나 빈 예약 목록을 crash 없이 안내한다", () => {
    render(
      <MemoryRouter>
        <ReservationHistoryTemplate />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("현재 진행 중인 세차가 없습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("완료된 세차 내역이 없습니다."),
    ).toBeInTheDocument();
  });
});
