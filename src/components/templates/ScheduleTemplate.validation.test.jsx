import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScheduleTemplate from "./ScheduleTemplate";
import {
  SAVE_RESERVATION,
  SET_BAY_ID,
  SET_CARWASH_ID,
} from "../../store/action";

const state = vi.hoisted(() => ({
  selectedCarwashId: 3,
  selectedBayId: 7,
  reservations: { startTime: "2099-08-11T10:00", endTime: "2099-08-11T11:00" },
  tid: "persisted-tid",
  bayList: [{ bayId: 7, bayNo: 1, bayBookedTimeList: [] }],
}));
const dispatch = vi.fn();
const navigate = vi.fn();
const showToast = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector) => selector({ reservationProcess: state }),
}));
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
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
            name: "Test wash",
            optime: {
              weekday: { start: "09:00", end: "18:00" },
              weekend: { start: "09:00", end: "18:00" },
            },
          },
        },
      },
    },
    { data: { data: { response: { bayList: state.bayList } } } },
  ],
}));
vi.mock("../atoms/OperatingHoursCard", () => ({ default: () => null }));
vi.mock("../molecules/DatePicker", () => ({ default: () => null }));
vi.mock("../molecules/TimePicker", () => ({
  default: ({ handleButtonClick }) => (
    <button onClick={() => handleButtonClick("10:00")}>select start</button>
  ),
}));
vi.mock("../molecules/DurationPicker", () => ({
  default: ({ handleButtonClick }) => (
    <button onClick={() => handleButtonClick(60)}>select duration</button>
  ),
}));

const renderSchedule = (stateValue) =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/schedule/3/7",
          state: stateValue,
        },
      ]}
    >
      <ScheduleTemplate carwashId={3} bayId={7} />
    </MemoryRouter>,
  );

describe("ScheduleTemplate input boundaries", () => {
  beforeEach(() => {
    dispatch.mockClear();
    navigate.mockClear();
    showToast.mockClear();
    state.bayList = [{ bayId: 7, bayNo: 1, bayBookedTimeList: [] }];
    state.selectedCarwashId = 3;
    state.selectedBayId = 7;
  });

  it("does not save until both start time and duration are selected", () => {
    renderSchedule({ selectedDate: new Date(2099, 7, 11, 9).toISOString() });
    fireEvent.click(screen.getAllByRole("button").at(-1));

    expect(showToast).toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SAVE_RESERVATION }),
    );
  });

  it("saves the selected bay and a valid time range before opening payment", () => {
    renderSchedule({ selectedDate: new Date(2099, 7, 11, 9).toISOString() });
    fireEvent.click(screen.getByRole("button", { name: "select start" }));
    fireEvent.click(screen.getByRole("button", { name: "select duration" }));
    fireEvent.click(screen.getAllByRole("button").at(-1));

    const savedAction = dispatch.mock.calls.find(
      ([action]) => action.type === SAVE_RESERVATION,
    )?.[0];
    expect(savedAction?.payload.startTime).toMatch(/T10:00$/);
    expect(
      new Date(savedAction?.payload.endTime) -
        new Date(savedAction?.payload.startTime),
    ).toBe(60 * 60 * 1000);
    expect(navigate).toHaveBeenCalledWith("/payment");
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_CARWASH_ID }),
    );
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_BAY_ID }),
    );
  });

  it("preserves persisted reservation state when route IDs are unchanged", () => {
    renderSchedule({ selectedDate: new Date(2099, 7, 11, 9).toISOString() });
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_CARWASH_ID }),
    );
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_BAY_ID }),
    );
  });

  it("clears the prior bay reservation when the route bay changes", () => {
    state.selectedBayId = 8;
    renderSchedule({ selectedDate: new Date(2099, 7, 11, 9).toISOString() });

    expect(dispatch).toHaveBeenCalledWith({ type: SET_BAY_ID, payload: 7 });
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SAVE_RESERVATION }),
    );
  });

  it("blocks a start and duration that conflict with a booked reservation", () => {
    state.bayList = [
      {
        bayId: 7,
        bayNo: 1,
        bayBookedTimeList: [
          {
            startTime: "2099-08-11T10:30",
            endTime: "2099-08-11T11:00",
          },
        ],
      },
    ];
    renderSchedule({ selectedDate: new Date(2099, 7, 11, 9).toISOString() });
    fireEvent.click(screen.getByRole("button", { name: "select start" }));
    fireEvent.click(screen.getByRole("button", { name: "select duration" }));
    fireEvent.click(screen.getAllByRole("button").at(-1));

    expect(showToast).toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SAVE_RESERVATION }),
    );
  });

  it("rejects malformed router dates and unavailable bay IDs", () => {
    renderSchedule({ selectedDate: "not-a-date" });
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SAVE_RESERVATION }),
    );
  });

  it("does not render or save a bay that is not in the API response", () => {
    state.bayList = [];
    renderSchedule({ selectedDate: new Date(2099, 7, 11, 9).toISOString() });
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "select start" })).toBeNull();
  });
});
