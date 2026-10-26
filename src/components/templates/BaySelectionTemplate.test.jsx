import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BaySelectionTemplate from "./BaySelectionTemplate";
import { SET_BAY_ID, SET_CARWASH_ID } from "../../store/action";

const state = vi.hoisted(() => ({
  selectedCarwashId: 3,
  selectedBayId: 7,
  reservations: { startTime: "2099-08-11T10:00", endTime: "2099-08-11T11:00" },
  tid: "persisted-tid",
  bays: [
    { bayId: 7, bayNo: 1, bayBookedTimeList: [] },
    { bayId: "invalid", bayNo: 2, bayBookedTimeList: [] },
  ],
  includeUnknownBayButton: false,
}));
const dispatch = vi.fn();
const navigate = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector) => selector({ reservationProcess: state }),
}));
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
}));
vi.mock("@tanstack/react-query", () => ({
  useSuspenseQueries: () => [
    { data: { data: { response: { optime: {}, name: "Test wash" } } } },
    { data: { data: { response: { bayList: state.bays } } } },
  ],
}));
vi.mock("../atoms/OperatingHoursCard", () => ({ default: () => null }));
vi.mock("../molecules/DatePicker", () => ({
  default: ({ handleButtonClick }) => (
    <button
      onClick={() => handleButtonClick(new Date("2099-08-11T10:00:00.000Z"))}
    >
      choose date
    </button>
  ),
}));
vi.mock("../organisms/BayList", () => ({
  default: ({ bays, onClick }) => (
    <div>
      {bays.map((bay) => (
        <button key={String(bay.bayId)} onClick={() => onClick(bay.bayId)}>
          bay-{bay.bayNo}
        </button>
      ))}
      {state.includeUnknownBayButton && (
        <button onClick={() => onClick(999)}>unknown bay</button>
      )}
    </div>
  ),
}));

describe("BaySelectionTemplate reservation state", () => {
  beforeEach(() => {
    dispatch.mockClear();
    navigate.mockClear();
    state.bays = [{ bayId: 7, bayNo: 1, bayBookedTimeList: [] }];
    state.includeUnknownBayButton = false;
    state.selectedCarwashId = 3;
    state.selectedBayId = 7;
    state.reservations = {
      startTime: "2099-08-11T10:00",
      endTime: "2099-08-11T11:00",
    };
    state.tid = "persisted-tid";
  });

  it("preserves a matching persisted carwash and sends a listed bay with the selected date", () => {
    render(
      <MemoryRouter>
        <BaySelectionTemplate carwashId={3} />
      </MemoryRouter>,
    );
    expect(dispatch).not.toHaveBeenCalledWith({
      type: SET_CARWASH_ID,
      payload: 3,
    });
    fireEvent.click(screen.getByRole("button", { name: "choose date" }));
    fireEvent.click(screen.getByRole("button", { name: "bay-1" }));

    expect(dispatch).toHaveBeenCalledWith({ type: SET_BAY_ID, payload: 7 });
    expect(navigate).toHaveBeenCalledWith("/schedule/3/7", {
      state: { selectedDate: "2099-08-11T10:00:00.000Z" },
    });
  });

  it("synchronizes a changed carwash ID and clears the old child selection", async () => {
    state.selectedCarwashId = 2;
    render(
      <MemoryRouter>
        <BaySelectionTemplate carwashId={3} />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_CARWASH_ID,
        payload: 3,
      }),
    );
  });

  it("shows the empty-bay state and clears a persisted bay no longer in the list", async () => {
    state.bays = [];
    render(
      <MemoryRouter>
        <BaySelectionTemplate carwashId={3} />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole("button", { name: "bay-1" }),
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: SET_CARWASH_ID,
        payload: 3,
      }),
    );
  });

  it("does not dispatch or navigate for a bay ID absent from the API list", () => {
    state.includeUnknownBayButton = true;
    render(
      <MemoryRouter>
        <BaySelectionTemplate carwashId={3} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "unknown bay" }));

    expect(dispatch).not.toHaveBeenCalledWith({
      type: SET_BAY_ID,
      payload: 999,
    });
    expect(navigate).not.toHaveBeenCalled();
  });
});
