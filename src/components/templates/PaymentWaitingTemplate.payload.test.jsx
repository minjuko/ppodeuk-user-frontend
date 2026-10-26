/* eslint-disable prettier/prettier */
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import PaymentWaitingTemplate from "./PaymentWaitingTemplate";
import { RESET_STORE } from "../../store/action";

const mutate = vi.fn();
const dispatch = vi.fn();
const navigate = vi.fn();
vi.mock("react-redux", () => ({ useDispatch: () => dispatch, useSelector: (selector) => selector({ reservationProcess: { selectedCarwashId: 1, selectedBayId: 2, reservations: { startTime: "2026-08-11T10:00", endTime: "2026-08-11T11:00" }, tid: "tid-123" } }) }));
vi.mock("react-router-dom", async () => ({ ...(await vi.importActual("react-router-dom")), useNavigate: () => navigate }));
vi.mock("@tanstack/react-query", () => ({ useMutation: (options) => ({ mutate: (data) => { mutate(data); options.onSuccess({ data: { reservation: { time: { start: "2026-08-11T10:00", end: "2026-08-11T11:00" }, price: 10000 }, carwash: { name: "테스트 세차장", location: { latitude: 35.1, longitude: 126.9 } } } }); }, isPending: false }) }));
vi.mock("../../apis/payment", () => ({ pgapprove: vi.fn() }));
vi.mock("../atoms/CustomModal", () => ({ default: () => null }));

it("approve payload를 생성하고 성공 시 paymentresult로 이동한다", () => {
  dispatch.mockClear();
  render(<MemoryRouter initialEntries={["/paymentwaiting?pg_token=token-123"]}><PaymentWaitingTemplate /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "결제 완료를 위해 클릭하세요" }));
  expect(dispatch).toHaveBeenCalledWith({ type: RESET_STORE });
  expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ payApprovalRequestDTO: { cid: "TC0ONETIME", tid: "tid-123", partner_order_id: "partner_order_id", partner_user_id: "partner_user_id", pg_token: "token-123" } }));
  expect(navigate).toHaveBeenCalledWith("/paymentresult", {
    state: {
      reservationData: {
        reservation: {
          time: { start: "2026-08-11T10:00", end: "2026-08-11T11:00" },
          price: 10000,
        },
        carwash: {
          name: "테스트 세차장",
          location: { latitude: 35.1, longitude: 126.9 },
        },
      },
    },
  });
});
