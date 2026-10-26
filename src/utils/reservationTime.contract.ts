import * as reservationTimeRuntime from "./reservationTime.js";

export interface OpeningPeriodInput {
  start: string;
  end: string;
}

export interface NormalizedOpeningPeriod extends OpeningPeriodInput {
  startMinutes: number;
  endMinutes: number;
  is24Hours: boolean;
}

export type OpeningPeriod = OpeningPeriodInput | NormalizedOpeningPeriod;

export interface OpeningHours {
  weekday: OpeningPeriod;
  weekend: OpeningPeriod;
}

export interface BookedTime {
  startTime: string;
  endTime: string;
}

export type LocalDateTime = string | Date;

export interface ReservationDateTimes {
  startTime: string;
  endTime: string;
}

export interface ReservationPayload extends ReservationDateTimes {
  bayId: number;
}

export interface AvailableDurationOptions {
  selectedDate: Date;
  startTime: string | null | undefined;
  openingPeriod: OpeningPeriod;
  bookedTimeList?: BookedTime[];
  durations?: number[];
}

export interface ReservationTimeApi {
  RESERVATION_DURATIONS: number[];
  timeToMinutes(time: string): number;
  minutesToTime(minutes: number): string;
  parseLocalDateTime(value: string): Date;
  combineLocalDateAndTime(date: Date, time: string): Date;
  normalizeOpeningPeriod(period: OpeningPeriodInput): NormalizedOpeningPeriod;
  normalizeOpeningHours(
    openingHours: Record<string, OpeningPeriodInput> | null | undefined,
  ): Record<string, NormalizedOpeningPeriod>;
  getOpeningPeriodForDate(
    openingHours: OpeningHours,
    date: Date,
  ): OpeningPeriod;
  generateTimeSlots(openingPeriod: OpeningPeriod, interval?: number): string[];
  isPastSlot(date: Date, time: string, now?: Date): boolean;
  filterPastSlots(slots: string[], date: Date, now?: Date): string[];
  addMinutesToLocalDateTime(
    date: Date,
    time: string,
    duration: number,
  ): Date;
  doReservationPeriodsOverlap(
    firstStart: LocalDateTime,
    firstEnd: LocalDateTime,
    secondStart: LocalDateTime,
    secondEnd: LocalDateTime,
  ): boolean;
  isReservationOverlapping(
    selectedDate: Date,
    startTime: string,
    duration: number,
    bookedTimeList?: BookedTime[],
  ): boolean;
  getAvailableDurations(options: AvailableDurationOptions): number[];
  createReservationDateTimes(
    date: Date,
    startTime: string,
    duration: number,
  ): ReservationDateTimes;
  buildReservationPayload(
    bayId: string | number,
    date: Date,
    startTime: string,
    duration: number,
  ): ReservationPayload;
}

// Structural assignment binds the public type contract to the checked JS exports.
const checkedReservationTime: ReservationTimeApi = reservationTimeRuntime;

function verifyReservationTimeInputs(
  date: Date,
  openingHours: OpeningHours,
  openingPeriod: OpeningPeriod,
  bookedTimeList: BookedTime[],
): void {
  const minutes: number = reservationTimeRuntime.timeToMinutes("09:30");
  const time: string = reservationTimeRuntime.minutesToTime(minutes);
  const parsed: Date = reservationTimeRuntime.parseLocalDateTime(
    "2026-08-11T09:30",
  );
  const combined: Date = reservationTimeRuntime.combineLocalDateAndTime(
    date,
    time,
  );
  const normalized: NormalizedOpeningPeriod =
    reservationTimeRuntime.normalizeOpeningPeriod({
      start: "00:00",
      end: "00:00",
    });
  const normalizedHours =
    reservationTimeRuntime.normalizeOpeningHours(undefined);
  const selectedPeriod: OpeningPeriod =
    reservationTimeRuntime.getOpeningPeriodForDate(openingHours, date);
  const slots: string[] =
    reservationTimeRuntime.generateTimeSlots(selectedPeriod);
  const isPast: boolean = reservationTimeRuntime.isPastSlot(date, "09:30");
  const futureSlots: string[] =
    reservationTimeRuntime.filterPastSlots(slots, date);
  const endDate: Date =
    reservationTimeRuntime.addMinutesToLocalDateTime(date, "23:30", 60);
  const overlaps: boolean =
    reservationTimeRuntime.doReservationPeriodsOverlap(
      parsed,
      endDate,
      "2026-08-11T10:00",
      "2026-08-11T11:00",
    );
  const reserved: boolean =
    reservationTimeRuntime.isReservationOverlapping(
      date,
      "09:30",
      60,
      bookedTimeList,
    );
  const durations: number[] =
    reservationTimeRuntime.getAvailableDurations({
      selectedDate: date,
      startTime: null,
      openingPeriod,
      bookedTimeList,
      durations: [30, 60],
    });
  const dateTimes: ReservationDateTimes =
    reservationTimeRuntime.createReservationDateTimes(date, "23:30", 60);
  const payload: ReservationPayload =
    reservationTimeRuntime.buildReservationPayload(
      "7",
      date,
      "09:30",
      60,
    );

  void normalizedHours;
  void isPast;
  void futureSlots;
  void overlaps;
  void reserved;
  void durations;
  void dateTimes;
  void payload;

  // @ts-expect-error time strings are not numbers
  reservationTimeRuntime.timeToMinutes(570);
  // @ts-expect-error minute counts are numbers, not strings
  reservationTimeRuntime.minutesToTime("30");
  // @ts-expect-error date parsing accepts strings, not Date instances
  reservationTimeRuntime.parseLocalDateTime(date);
  // @ts-expect-error a local date argument must be a Date
  reservationTimeRuntime.combineLocalDateAndTime("2026-08-11", "09:30");
  // @ts-expect-error opening period boundaries are strings
  reservationTimeRuntime.normalizeOpeningPeriod({ start: 9, end: "18:00" });
  // @ts-expect-error date selection must use a Date
  reservationTimeRuntime.getOpeningPeriodForDate(openingHours, "2026-08-11");
  // @ts-expect-error slot intervals are numeric minutes
  reservationTimeRuntime.generateTimeSlots(openingPeriod, "30");
  // @ts-expect-error a past-slot date must be a Date
  reservationTimeRuntime.isPastSlot("2026-08-11", "09:30");
  // @ts-expect-error slots are time strings
  reservationTimeRuntime.filterPastSlots([930], date);
  // @ts-expect-error duration is numeric minutes
  reservationTimeRuntime.addMinutesToLocalDateTime(date, "09:30", "60");
  // @ts-expect-error reservation datetime arguments must be date/time values
  reservationTimeRuntime.doReservationPeriodsOverlap(0, endDate, "10:00", "11:00");
  reservationTimeRuntime.isReservationOverlapping(date, "09:30", 30, [
    // @ts-expect-error booked datetime fields are strings
    { startTime: date, endTime: "2026-08-11T10:00" },
  ]);
  reservationTimeRuntime.getAvailableDurations({
    // @ts-expect-error selectedDate must be a Date
    selectedDate: "2026-08-11",
    startTime: "09:30",
    openingPeriod,
  });
  // @ts-expect-error duration is numeric minutes
  reservationTimeRuntime.createReservationDateTimes(date, "09:30", "60");
  // @ts-expect-error bayId accepts only string or number
  reservationTimeRuntime.buildReservationPayload({ id: 7 }, date, "09:30", 60);
}

void checkedReservationTime;
void verifyReservationTimeInputs;
