import { store } from "./index.js";
import {
  clearPayment,
  resetStore,
  saveReservation,
  saveTid,
  setBayId,
  setCarwashId,
  setReservationId,
} from "./action.js";
import { reservationReducer } from "./reservationReducer.js";
import type {
  ReservationRange,
  ReservationState,
} from "./reservationTypes.js";

type RootState = ReturnType<typeof store.getState>;

function verifyReservationStateTypes(rootState: RootState): void {
  const reservationState: ReservationState = rootState.reservationProcess;
  const reservationRange: ReservationRange = {
    startTime: "2026-08-11T10:00",
    endTime: "2026-08-11T11:00",
  };
  const changed = reservationReducer(undefined, setCarwashId("101"));
  const selectedBay = reservationReducer(changed, setBayId(1011));
  const selectedReservation = reservationReducer(
    selectedBay,
    setReservationId(501),
  );
  const saved = reservationReducer(
    selectedReservation,
    saveReservation(reservationRange.startTime, reservationRange.endTime),
  );
  const withTid = reservationReducer(saved, saveTid("payment-tid"));
  const cleared = reservationReducer(withTid, clearPayment());
  const reset = reservationReducer(cleared, resetStore());

  const restoredRange: ReservationRange | undefined =
    "startTime" in reservationState.reservations
      ? reservationState.reservations
      : undefined;
  void restoredRange;
  void reset;

  // @ts-expect-error IDs accept strings or numbers, not objects
  setCarwashId({ id: 101 });
  // @ts-expect-error reservation times must be strings
  saveReservation(570, "2026-08-11T11:00");
  // @ts-expect-error payment TID is a string
  saveTid(12345);
  // @ts-expect-error a bay ID cannot be null before dispatch
  setBayId(null);
}

void verifyReservationStateTypes;
