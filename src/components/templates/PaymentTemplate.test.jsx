/* eslint-disable prettier/prettier */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentTemplate from "./PaymentTemplate";
import { CLEAR_PAYMENT } from "../../store/action";

const dispatch = vi.fn();
const navigate = vi.fn();
const state = vi.hoisted(() => ({ mobile: false, mutations: 0, ready: {}, mutates: [], reservationProcess: { selectedCarwashId: 1, selectedBayId: 2, reservations: { startTime: "2026-08-11T10:00", endTime: "2026-08-11T11:00" } } }));

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector) => selector({ reservationProcess: state.reservationProcess }),
}));
vi.mock("react-router-dom", async () => ({ ...(await vi.importActual("react-router-dom")), useNavigate: () => navigate }));
vi.mock("react-device-detect", () => ({ get isMobile() { return state.mobile; } }));
vi.mock("../../apis/carwashes", () => ({ calculatePayment: vi.fn() }));
vi.mock("../../apis/payment", () => ({ pgpayment: vi.fn() }));
vi.mock("../atoms/CustomModal", () => ({ default: ({ isOpen, content }) => isOpen ? <div role="alert">{content}</div> : null }));
vi.mock("../atoms/Button", () => ({ Button: ({ children, ...props }) => <button {...props}>{children}</button> }));

vi.mock("@tanstack/react-query", () => ({
  useMutation: (options) => {
    const index = state.mutations++ % 2;
    state.mutates[index] ||= () => index === 0
      ? options.onSuccess?.({ data: { response: { price: 1000 } } })
      : options.onSuccess?.({ data: { response: state.ready } });
    return {
      mutate: state.mutates[index],
      isPending: false,
    };
  },
}));

const renderPayment = () => render(<MemoryRouter><PaymentTemplate /></MemoryRouter>);

describe("PaymentTemplate Kakao ready redirect", () => {
  beforeEach(() => {
    dispatch.mockClear();
    navigate.mockClear();
    state.mutations = 0;
    state.mutates = [];
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "http://localhost:3000/" },
    });
    state.mobile = false;
    state.ready = { tid: "tid-1", next_redirect_pc_url: "https://pay.example/pc", next_redirect_mobile_url: "https://pay.example/mobile" };
  });

  it("tid가 없으면 결제 상태를 초기화하고 오류를 표시한다", async () => {
    state.ready = { next_redirect_pc_url: "https://pay.example/pc" };
    renderPayment();
    fireEvent.click((await screen.findAllByRole("button"))[0]);
    await waitFor(() => expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PAYMENT }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("PC에서는 next_redirect_pc_url로 이동한다", async () => {
    renderPayment();
    fireEvent.click((await screen.findAllByRole("button"))[0]);
    await waitFor(() => expect(window.location.href).toBe("https://pay.example/pc"));
  });

  it("모바일에서는 next_redirect_mobile_url을 사용한다", async () => {
    state.mobile = true;
    renderPayment();
    fireEvent.click((await screen.findAllByRole("button"))[0]);
    await waitFor(() => expect(window.location.href).toBe("https://pay.example/mobile"));
  });

  it("redirect URL이 없으면 외부 이동하지 않는다", async () => {
    state.ready = { tid: "tid-1" };
    renderPayment();
    fireEvent.click((await screen.findAllByRole("button"))[0]);
    await waitFor(() => expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PAYMENT }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
