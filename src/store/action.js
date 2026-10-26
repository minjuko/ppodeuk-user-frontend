// @ts-check

/** @typedef {import("./reservationTypes").ReservationId} ReservationId */
/** @typedef {import("./reservationTypes").SetCarwashIdAction} SetCarwashIdAction */
/** @typedef {import("./reservationTypes").SetBayIdAction} SetBayIdAction */
/** @typedef {import("./reservationTypes").SetReservationIdAction} SetReservationIdAction */
/** @typedef {import("./reservationTypes").SaveReservationAction} SaveReservationAction */
/** @typedef {import("./reservationTypes").SaveTidAction} SaveTidAction */
/** @typedef {import("./reservationTypes").ResetStoreAction} ResetStoreAction */
/** @typedef {import("./reservationTypes").ClearPaymentAction} ClearPaymentAction */

/** @type {"SET_CARWASH_ID"} */
export const SET_CARWASH_ID = "SET_CARWASH_ID";
/** @type {"SET_BAY_ID"} */
export const SET_BAY_ID = "SET_BAY_ID";
/** @type {"SET_RESERVATION_ID"} */
export const SET_RESERVATION_ID = "SET_RESERVATION_ID";
/** @type {"SAVE_RESERVATION"} */
export const SAVE_RESERVATION = "SAVE_RESERVATION";
/** @type {"RESET_STORE"} */
export const RESET_STORE = "RESET_STORE";
/** @type {"SAVE_TID"} */
export const SAVE_TID = "SAVE_TID";
/** @type {"CLEAR_PAYMENT"} */
export const CLEAR_PAYMENT = "CLEAR_PAYMENT";

/** @param {ReservationId} carwashId @returns {SetCarwashIdAction} */
export const setCarwashId = (carwashId) => ({
  type: SET_CARWASH_ID,
  payload: carwashId,
});

/** @param {ReservationId} bayId @returns {SetBayIdAction} */
export const setBayId = (bayId) => ({
  type: SET_BAY_ID,
  payload: bayId,
});

/** @param {ReservationId} rsvId @returns {SetReservationIdAction} */
export const setReservationId = (rsvId) => ({
  type: SET_RESERVATION_ID,
  payload: rsvId,
});

/** @param {string} startTime @param {string} endTime @returns {SaveReservationAction} */
export const saveReservation = (startTime, endTime) => ({
  type: SAVE_RESERVATION,
  payload: { startTime, endTime },
});

/** @returns {ResetStoreAction} */
export const resetStore = () => ({
  type: RESET_STORE,
});

/** @param {string} Tid @returns {SaveTidAction} */
export const saveTid = (Tid) => ({
  type: SAVE_TID,
  payload: Tid,
});

/** @returns {ClearPaymentAction} */
export const clearPayment = () => ({
  type: CLEAR_PAYMENT,
});
