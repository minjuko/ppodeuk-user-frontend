import {
  selectPaymentTid,
  selectReservationBayId,
  selectReservationCarwashId,
  selectReservationRange,
} from "./reservationSelectors";
import type { RootState } from "./reservationSelectors";
import type {
  ReservationId,
  ReservationSelection,
} from "./reservationTypes";

declare const rootState: RootState;
const carwashId: ReservationId | null =
  selectReservationCarwashId(rootState);
const bayId: ReservationId | null = selectReservationBayId(rootState);
const reservations: ReservationSelection = selectReservationRange(rootState);
const tid: string | null = selectPaymentTid(rootState);
void [carwashId, bayId, reservations, tid];

if (false) {
  // @ts-expect-error a selected bay ID can also be a string or null.
  const numericOnlyBayId: number = selectReservationBayId(rootState);
  // @ts-expect-error RootState reservation selectors reject unknown fields.
  const missingSelectorField = rootState.reservationProcess.notAReservationField;
  void numericOnlyBayId;
  void missingSelectorField;
}
