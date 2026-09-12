import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DurationPicker from "./DurationPicker";
import TimePicker from "./TimePicker";

const openingHours = {
  weekday: { start: "09:00", end: "18:00" },
  weekend: { start: "09:00", end: "18:00" },
};

describe("예약 picker 상태 reset", () => {
  it("날짜 변경 시 선택한 시작 시간을 reset한다", () => {
    const firstDate = new Date(2099, 7, 11);
    const { getByRole, rerender } = render(
      <TimePicker
        openingHours={openingHours}
        handleButtonClick={vi.fn()}
        bayBookedTimeList={[]}
        selectedDate={firstDate}
      />,
    );
    const startButton = getByRole("button", { name: "09:00" });
    fireEvent.click(startButton);
    expect(startButton).toHaveAttribute("aria-pressed", "true");

    rerender(
      <TimePicker
        openingHours={openingHours}
        handleButtonClick={vi.fn()}
        bayBookedTimeList={[]}
        selectedDate={new Date(2099, 7, 12)}
      />,
    );
    expect(getByRole("button", { name: "09:00" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("시작 시간 변경 시 선택한 duration을 reset한다", () => {
    const props = {
      handleButtonClick: vi.fn(),
      bayBookedTimeList: [],
      selectedDate: new Date(2099, 7, 11),
      openingHours,
    };
    const { getByRole, rerender } = render(
      <DurationPicker {...props} startTime="09:00" />,
    );
    const durationButton = getByRole("button", { name: "30분" });
    fireEvent.click(durationButton);
    expect(durationButton).toHaveAttribute("aria-pressed", "true");

    rerender(<DurationPicker {...props} startTime="09:30" />);
    expect(getByRole("button", { name: "30분" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
