import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentWaitingTemplate from "./PaymentWaitingTemplate";
import { CLEAR_PAYMENT } from "../../store/action";

const dispatch = vi.fn();
const approve = vi.fn();
const mutationState = vi.hoisted(() => ({
  isPending: false,
  reservationProcess: {
    selectedCarwashId: 1,
    selectedBayId: 2,
    reservations: {
      startTime: "2026-08-11T10:00",
      endTime: "2026-08-11T11:00",
    },
    tid: "stale-tid",
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector) =>
    selector({ reservationProcess: mutationState.reservationProcess }),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: () => ({ mutate: approve, isPending: mutationState.isPending }),
}));

vi.mock("../../apis/payment", () => ({ pgapprove: vi.fn() }));
vi.mock("../atoms/CustomModal", () => ({ default: () => null }));

const validReservationProcess = () => ({
  selectedCarwashId: 1,
  selectedBayId: 2,
  reservations: {
    startTime: "2026-08-11T10:00",
    endTime: "2026-08-11T11:00",
  },
  tid: "stale-tid",
});

describe("PaymentWaitingTemplate callback guard", () => {
  beforeEach(() => {
    dispatch.mockClear();
    approve.mockClear();
    mutationState.isPending = false;
    mutationState.reservationProcess = validReservationProcess();
  });

  it("does not approve when the pg_token is missing", async () => {
    render(
      <MemoryRouter initialEntries={["/paymentwaiting"]}>
        <PaymentWaitingTemplate />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(approve).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PAYMENT }),
    );
  });

  it.each([
    ["TID is missing", { tid: null }],
    ["reservation range is missing", { reservations: [] }],
  ])("does not approve when $0", async (_label, missingData) => {
    mutationState.reservationProcess = {
      ...validReservationProcess(),
      ...missingData,
    };
    render(
      <MemoryRouter
        initialEntries={["/paymentwaiting?pg_token=callback-token"]}
      >
        <PaymentWaitingTemplate />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(approve).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PAYMENT }),
    );
  });

  it("disables the confirmation button while approval is pending", () => {
    mutationState.isPending = true;
    render(
      <MemoryRouter initialEntries={["/paymentwaiting?pg_token=token"]}>
        <PaymentWaitingTemplate />
      </MemoryRouter>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
