// @ts-check

import {
  CLEAR_PAYMENT,
  RESET_STORE,
  SAVE_RESERVATION,
  SAVE_TID,
  SET_BAY_ID,
  SET_CARWASH_ID,
  SET_RESERVATION_ID,
} from "./action";
/** @typedef {import("./reservationTypes").ReservationId} ReservationId */
/** @typedef {import("./reservationTypes").ReservationRange} ReservationRange */
/** @typedef {import("./reservationTypes").ReservationState} ReservationState */
/** @typedef {import("./reservationTypes").SetCarwashIdAction} SetCarwashIdAction */
/** @typedef {import("./reservationTypes").SetBayIdAction} SetBayIdAction */
/** @typedef {import("./reservationTypes").SetReservationIdAction} SetReservationIdAction */
/** @typedef {import("./reservationTypes").SaveReservationAction} SaveReservationAction */
/** @typedef {import("./reservationTypes").SaveTidAction} SaveTidAction */

/** @type {ReservationState} */
export const initialReservationState = {
  selectedCarwashId: null,
  selectedBayId: null,
  selectedReservationId: null,
  reservations: [],
  tid: null,
};

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** @param {unknown} value @returns {ReservationId | null} */
const normalizeReservationId = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) return value;
  return null;
};

/** @param {unknown} value @returns {ReservationRange | null} */
const normalizeReservationRange = (value) => {
  if (!isRecord(value)) return null;
  if (
    typeof value.startTime !== "string" ||
    value.startTime.trim().length === 0 ||
    typeof value.endTime !== "string" ||
    value.endTime.trim().length === 0
  ) {
    return null;
  }
  return { startTime: value.startTime, endTime: value.endTime };
};

/**
 * Keep compatible persisted IDs and reservation objects, including the legacy
 * empty-array reservation value. Invalid or incomplete payment context is reset.
 * @param {unknown} persistedState
 * @returns {ReservationState}
 */
export const normalizePersistedReservationState = (persistedState) => {
  if (!isRecord(persistedState)) return initialReservationState;

  const selectedCarwashId = normalizeReservationId(
    persistedState.selectedCarwashId,
  );
  const selectedBayId = normalizeReservationId(persistedState.selectedBayId);
  const selectedReservationId = normalizeReservationId(
    persistedState.selectedReservationId,
  );
  const storedRange = normalizeReservationRange(persistedState.reservations);
  const reservations = storedRange || [];
  const hasCompleteReservation = Boolean(
    selectedCarwashId !== null && selectedBayId !== null && storedRange,
  );
  const tid =
    hasCompleteReservation &&
    typeof persistedState.tid === "string" &&
    persistedState.tid.trim().length > 0
      ? persistedState.tid
      : null;

  return {
    selectedCarwashId,
    selectedBayId: selectedCarwashId === null ? null : selectedBayId,
    selectedReservationId,
    reservations:
      selectedCarwashId !== null && selectedBayId !== null ? reservations : [],
    tid,
  };
};

/** @param {unknown} persistedState @param {number} currentVersion
 * @returns {Promise<import("redux-persist").PersistedState>}
 */
export const migrateReservationState = (persistedState, currentVersion) => {
  const normalized = normalizePersistedReservationState(persistedState);
  const persistedMetadata =
    isRecord(persistedState) && isRecord(persistedState._persist)
      ? persistedState._persist
      : {};
  const version =
    typeof persistedMetadata.version === "number"
      ? persistedMetadata.version
      : currentVersion;
  const rehydrated =
    typeof persistedMetadata.rehydrated === "boolean"
      ? persistedMetadata.rehydrated
      : false;

  return Promise.resolve({
    ...normalized,
    _persist: { version, rehydrated },
  });
};

/**
 * @param {ReservationState | undefined} state
 * @param {{ type: string, payload?: unknown }} action
 * @returns {ReservationState}
 */
export const reservationReducer = (state = initialReservationState, action) => {
  switch (action.type) {
    case SET_CARWASH_ID:
      return {
        ...state,
        selectedCarwashId: /** @type {SetCarwashIdAction} */ (action).payload,
        selectedBayId: null,
        reservations: [],
        tid: null,
      };
    case SET_BAY_ID:
      return {
        ...state,
        selectedBayId: /** @type {SetBayIdAction} */ (action).payload,
        reservations: [],
        tid: null,
      };
    case SET_RESERVATION_ID:
      return {
        ...state,
        selectedReservationId: /** @type {SetReservationIdAction} */ (action)
          .payload,
      };
    case SAVE_RESERVATION: {
      const payload = /** @type {SaveReservationAction} */ (action).payload;
      return {
        ...state,
        reservations: {
          startTime: payload.startTime,
          endTime: payload.endTime,
        },
        tid: null,
      };
    }
    case RESET_STORE:
      return initialReservationState;
    case SAVE_TID:
      return { ...state, tid: /** @type {SaveTidAction} */ (action).payload };
    case CLEAR_PAYMENT:
      return { ...state, tid: null };
    default:
      return state;
  }
};
