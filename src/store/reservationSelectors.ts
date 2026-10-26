import type { store } from "./index";

export type RootState = ReturnType<typeof store.getState>;

export const selectReservationState = (state: RootState) =>
  state.reservationProcess;

export const selectReservationCarwashId = (state: RootState) =>
  selectReservationState(state).selectedCarwashId;

export const selectReservationBayId = (state: RootState) =>
  selectReservationState(state).selectedBayId;

export const selectReservationRange = (state: RootState) =>
  selectReservationState(state).reservations;

export const selectPaymentTid = (state: RootState) =>
  selectReservationState(state).tid;
