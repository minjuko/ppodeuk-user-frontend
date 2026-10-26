import * as reservationTimeRuntime from "./reservationTime.js";

export interface ReservationTimeContract {
  timeToMinutes(time: string): number;
  minutesToTime(minutes: number): string;
  combineLocalDateAndTime(date: Date, time: string): Date;
  createReservationDateTimes(
    date: Date,
    startTime: string,
    durationMinutes: number,
  ): { startTime: string; endTime: string };
  buildReservationPayload(
    bayId: string | number,
    date: Date,
    startTime: string,
    durationMinutes: number,
  ): { bayId: number; startTime: string; endTime: string };
}

// Keep the legacy JavaScript module's public reservation-time API aligned with
// this contract while the implementation remains JavaScript.
const checkedReservationTime: ReservationTimeContract = reservationTimeRuntime;

export type { ReservationTimeContract as ReservationTimeApi };
export { checkedReservationTime };