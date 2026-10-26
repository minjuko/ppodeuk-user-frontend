/* eslint-disable prettier/prettier */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentTemplate from "./PaymentTemplate";
import { CLEAR_PAYMENT, SAVE_TID } from "../../store/action";

const dispatch = vi.fn();
const navigate = vi.fn();
const state = vi.hoisted(() => ({
  mobile: false,
  mutations: 0,
  mutationCalls: 0,
  mutates: [],
  ready: {},
  reservationProcess: {
    selectedCarwashId: 1,
    selectedBayId: 2,
    reservations: {
      startTime: "2026-08-11T10:00",
      endTime: "2026-08-11T11:00",
    },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector) => selector({ reservationProcess: state.reservationProcess }),
}));
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => navigate,
}));
vi.mock("react-device-detect", () => ({ get isMobile() { return state.mobile; } }));
vi.mock("../../apis/carwashes", () => ({ calculatePayment: vi.fn() }));
vi.mock("../../apis/payment", () => ({ pgpayment: vi.fn() }));
vi.mock("../atoms/CustomModal", () => ({
  default: ({ isOpen, content }) =>
    isOpen ? <div role="alert">{content}</div> : null,
}));
vi.mock("../atoms/Button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: (options) => {
    const index = state.mutations++ % 2;
    state.mutates[index] ||= () => {
      state.mutationCalls += 1;
      return index === 0
        ? options.onSuccess?.({ data: { response: { price: 1000 } } })
        : options.onSuccess?.({ data: { response: state.ready } });
    };
    return { mutate: state.mutates[index], isPending: false };
  },
}));

const renderPayment = () => render(<MemoryRouter><PaymentTemplate /></MemoryRouter>);

const validReservationProcess = () => ({
  selectedCarwashId: 1,
  selectedBayId: 2,
  reservations: {
    startTime: "2026-08-11T10:00",
    endTime: "2026-08-11T11:00",
  },
});

describe("PaymentTemplate payment preparation", () => {
  beforeEach(() => {
    dispatch.mockClear();
    navigate.mockClear();
    state.mutations = 0;
    state.mutationCalls = 0;
    state.mutates = [];
    state.reservationProcess = validReservationProcess();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "http://localhost:3000/" },
    });
    state.mobile = false;
    state.ready = {
      tid: "tid-1",
      next_redirect_pc_url: "https://pay.example/pc",
      next_redirect_mobile_url: "https://pay.example/mobile",
    };
  });

  it("clears payment state and shows an error when the response has no TID", async () => {
    state.ready = { next_redirect_pc_url: "https://pay.example/pc" };
    renderPayment();
    fireEvent.click((await screen.findAllByRole("button"))[0]);
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PAYMENT }),
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("redirects a PC user to the PC redirect URL", async () => {
    renderPayment();
    fireEvent.click((await screen.findAllByRole("button"))[0]);
    await waitFor(() =>
      expect(window.location.href).toBe("https://pay.example/pc"),
    );
    expect(dispatch).toHaveBeenCalledWith({ type: SAVE_TID, payload: "tid-1" });
  });

  it("redirects a mobile user to the mobile redirect URL", async () => {
    state.mobile = true;
    renderPayment();
    fireEvent.click((await screen.findAllByRole("button"))[0]);
    await waitFor(() =>
      expect(window.location.href).toBe("https://pay.example/mobile"),
    );
  });

  it("does not redirect when the response has no redirect URL", async () => {
    state.ready = { tid: "tid-1" };
    renderPayment();
    fireEvent.click((await screen.findAllByRole("button"))[0]);
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PAYMENT }),
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not start price calculation or payment without a reservation range", () => {
    state.reservationProcess = {
      selectedCarwashId: 1,
      selectedBayId: 2,
      reservations: [],
    };
    renderPayment();
    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(state.mutationCalls).toBe(0);
  });
});
