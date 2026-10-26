export type ReservationId = number | string;

export interface ReservationRange {
  startTime: string;
  endTime: string;
}

// `[]` is the persisted and runtime initial value before a time is selected.
export type ReservationSelection = never[] | ReservationRange;

export interface ReservationState {
  selectedCarwashId: ReservationId | null;
  selectedBayId: ReservationId | null;
  selectedReservationId: ReservationId | null;
  reservations: ReservationSelection;
  tid: string | null;
}

export interface SetCarwashIdAction {
  type: "SET_CARWASH_ID";
  payload: ReservationId;
}

export interface SetBayIdAction {
  type: "SET_BAY_ID";
  payload: ReservationId;
}

export interface SetReservationIdAction {
  type: "SET_RESERVATION_ID";
  payload: ReservationId;
}

export interface SaveReservationAction {
  type: "SAVE_RESERVATION";
  payload: ReservationRange;
}

export interface SaveTidAction {
  type: "SAVE_TID";
  payload: string;
}

export interface ResetStoreAction {
  type: "RESET_STORE";
}

export interface ClearPaymentAction {
  type: "CLEAR_PAYMENT";
}

export type ReservationAction =
  | SetCarwashIdAction
  | SetBayIdAction
  | SetReservationIdAction
  | SaveReservationAction
  | SaveTidAction
  | ResetStoreAction
  | ClearPaymentAction;
