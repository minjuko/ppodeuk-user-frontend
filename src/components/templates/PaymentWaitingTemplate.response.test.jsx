import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentWaitingTemplate from "./PaymentWaitingTemplate";
import { CLEAR_PAYMENT, RESET_STORE } from "../../store/action";

const state = vi.hoisted(() => ({
  response: { reservation: {}, carwash: {} },
}));
const dispatch = vi.fn();
const navigate = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector) =>
    selector({
      reservationProcess: {
        selectedCarwashId: 1,
        selectedBayId: 2,
        reservations: {
          startTime: "2026-08-11T10:00",
          endTime: "2026-08-11T11:00",
        },
        tid: "tid-1",
      },
    }),
}));
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
}));
vi.mock("@tanstack/react-query", () => ({
  useMutation: (options) => ({
    mutate: () => options.onSuccess({ data: { response: state.response } }),
    isPending: false,
  }),
}));
vi.mock("../../apis/payment", () => ({ pgapprove: vi.fn() }));
vi.mock("../atoms/CustomModal", () => ({
  default: ({ isOpen, content }) =>
    isOpen ? <div role="alert">{content}</div> : null,
}));

describe("payment approval response validation", () => {
  beforeEach(() => {
    dispatch.mockClear();
    navigate.mockClear();
    state.response = { reservation: {}, carwash: {} };
  });

  it("does not clear reservation state as approved when required result fields are missing", () => {
    render(
      <MemoryRouter initialEntries={["/paymentwaiting?pg_token=token-1"]}>
        <PaymentWaitingTemplate />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PAYMENT });
    expect(dispatch).not.toHaveBeenCalledWith({ type: RESET_STORE });
    expect(navigate).not.toHaveBeenCalledWith(
      "/paymentresult",
      expect.anything(),
    );
  });
});
