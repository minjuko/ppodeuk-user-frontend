import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BayItem from "./BayItem";

vi.mock("../atoms/TimeSlot", () => ({
  default: ({ startHour, endHour, isReservedCallback }) => (
    <div>
      <span data-testid="hours">{`${startHour}-${endHour}`}</span>
      <span data-testid="nine">{String(isReservedCallback(9, false))}</span>
      <span data-testid="nine-thirty">
        {String(isReservedCallback(9, true))}
      </span>
    </div>
  ),
}));

describe("Bay 선택 시간 요약", () => {
  it("09:30 영업 시작 전 09:00은 불가, 09:30부터 가능으로 표시한다", () => {
    render(
      <BayItem
        bayId={1}
        bayNo={1}
        bayBookedTimeList={[]}
        openingHours={{
          weekday: { start: "09:30", end: "18:30" },
          weekend: { start: "09:30", end: "18:30" },
        }}
        selectedDate={new Date(2099, 7, 11)}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByTestId("hours")).toHaveTextContent("9-19");
    expect(screen.getByTestId("nine")).toHaveTextContent("true");
    expect(screen.getByTestId("nine-thirty")).toHaveTextContent("false");
  });
});
