import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ScheduleTemplate from "./ScheduleTemplate";
import { SET_BAY_ID, SET_CARWASH_ID } from "../../store/action";

const dispatch = vi.fn();
const showToast = vi.hoisted(() => vi.fn());

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
}));

vi.mock("../feedback/ToastProvider", () => ({
  useToast: () => ({ showToast }),
}));

vi.mock("@tanstack/react-query", () => ({
  useSuspenseQueries: () => [
    {
      data: {
        data: {
          response: {
            name: "Test carwash",
            optime: {
              weekday: { start: "09:00", end: "18:00" },
              weekend: { start: "09:00", end: "18:00" },
            },
          },
        },
      },
    },
    {
      data: {
        data: {
          response: {
            bayList: [{ bayId: 7, bayNo: 1, bayBookedTimeList: [] }],
          },
        },
      },
    },
  ],
}));

describe("ScheduleTemplate route state", () => {
  it("선택값이 없으면 모달 대신 토스트로 안내한다", async () => {
    showToast.mockClear();
    render(
      <MemoryRouter>
        <ScheduleTemplate carwashId="3" bayId="7" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "예약하기" }));

    expect(showToast).toHaveBeenCalledWith({
      message: "시작 시간과 사용 시간을 선택해 주세요.",
    });
  });

  it("syncs direct schedule URL ids to the reservation store", async () => {
    dispatch.mockClear();

    render(
      <MemoryRouter>
        <ScheduleTemplate carwashId="3" bayId="7" />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_CARWASH_ID,
        payload: 3,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_BAY_ID,
        payload: 7,
      });
    });
  });
});
