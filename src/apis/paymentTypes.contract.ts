import type {
  PaymentApproveRequestDto,
  PaymentReadyRequestDto,
  ReservationRangeDto,
  ReservationSaveDto,
} from "./paymentTypes";
import { pgapprove, pgpayment } from "./payment";
import { calculatePayment } from "./carwashes";
import { modifyReservation } from "./reservations";

const range: ReservationRangeDto = {
  startTime: "2026-08-11T10:00",
  endTime: "2026-08-11T11:00",
};
const save: ReservationSaveDto = { ...range, bayId: 2 };
const ready: PaymentReadyRequestDto = {
  requestDto: {
    cid: "TC0ONETIME",
    partner_order_id: "order",
    partner_user_id: "user",
    item_name: "예약 결제",
    quantity: 1,
    total_amount: 12000,
    tax_free_amount: 0,
  },
  saveDTO: save,
};
const approve: PaymentApproveRequestDto = {
  payApprovalRequestDTO: {
    cid: "TC0ONETIME",
    tid: "tid",
    partner_order_id: "order",
    partner_user_id: "user",
    pg_token: "token",
  },
  saveDTO: save,
};
if (false) {
  void calculatePayment(save.bayId, range);
  void pgpayment(ready);
  void pgapprove(approve);
  void modifyReservation(42, range.startTime, range.endTime);
}

// Compile-time rejection cases stay unevaluated at runtime.
if (false) {
  // @ts-expect-error bayId is numeric in the existing reservation payload builder.
  const badBay: ReservationSaveDto = { ...range, bayId: "2" };
  // @ts-expect-error payment amount is sent as a number.
  const badAmount: PaymentReadyRequestDto = { ...ready, requestDto: { ...ready.requestDto, total_amount: "12000" } };
  // @ts-expect-error both reservation timestamps are required.
  const missingEnd: ReservationRangeDto = { startTime: range.startTime };
  // @ts-expect-error ready and approve have distinct outer DTOs.
  const mixedReady: PaymentReadyRequestDto = approve;
  // @ts-expect-error TID is the transaction identifier string, not a PG callback token.
  const mixedToken: PaymentApproveRequestDto = { ...approve, payApprovalRequestDTO: { ...approve.payApprovalRequestDTO, tid: 123 } };
  // @ts-expect-error the endpoint requires a number for the bay path id.
  void calculatePayment("2", range);
  // @ts-expect-error calculation requires both start and end timestamps.
  void calculatePayment(2, { startTime: range.startTime });
  // @ts-expect-error approval DTO cannot be sent to the payment-ready API.
  void pgpayment(approve);
  // @ts-expect-error ready DTO cannot be sent to the approval API.
  void pgapprove(ready);
  // @ts-expect-error amount must be numeric in the payment-ready payload.
  void pgpayment({ ...ready, requestDto: { ...ready.requestDto, total_amount: "12000" } });
  void [badBay, badAmount, missingEnd, mixedReady, mixedToken];
}
