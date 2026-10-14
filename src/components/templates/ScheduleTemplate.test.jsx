import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ScheduleTemplate from "./ScheduleTemplate";
import { SET_BAY_ID, SET_CARWASH_ID } from "../../store/action";

const dispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
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
