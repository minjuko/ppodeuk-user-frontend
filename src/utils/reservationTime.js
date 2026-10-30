// @ts-check

/** @typedef {{ start: string, end: string }} OpeningPeriodInput */
/** @typedef {OpeningPeriodInput & { startMinutes: number, endMinutes: number, is24Hours: boolean }} NormalizedOpeningPeriod */
/** @typedef {OpeningPeriodInput | NormalizedOpeningPeriod} OpeningPeriod */
/** @typedef {{ weekday: OpeningPeriod, weekend: OpeningPeriod }} OpeningHours */
/** @typedef {{ startTime: string, endTime: string }} BookedTime */
/** @typedef {string | Date} LocalDateTime */

const SLOT_INTERVAL_MINUTES = 30;
/** @type {number[]} */
export const RESERVATION_DURATIONS = [30, 60, 90, 120, 150, 180, 240];

const DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/;

/**
 * Convert HH:mm or HH:mm:ss to minutes; 24:00 is the only valid hour-24 value.
 * @param {string} time
 * @returns {number}
 */
export const timeToMinutes = (time) => {
  const match = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(time || "");
  if (!match) throw new Error(`Invalid time: ${time}`);

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (minutes > 59 || hours > 24 || (hours === 24 && minutes !== 0)) {
    throw new Error(`Invalid time: ${time}`);
  }
  return hours * 60 + minutes;
};

/** @param {number} minutes @returns {string} */
export const minutesToTime = (minutes) => {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 1440) {
    throw new Error(`Invalid minutes: ${minutes}`);
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(
    2,
    "0",
  )}`;
};

/** @param {Date} date @returns {string} */
const formatLocalDate = (date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((value, index) => String(value).padStart(index === 0 ? 4 : 2, "0"))
    .join("-");

/**
 * Parse YYYY-MM-DDTHH:mm with optional seconds/fractional seconds.
 * @param {string} value
 * @returns {Date}
 */
export const parseLocalDateTime = (value) => {
  const match = DATE_TIME_PATTERN.exec(value || "");
  if (!match) throw new Error(`Invalid local datetime: ${value}`);
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] || 0),
  );
};

/** @param {Date} date @returns {string} */
const formatLocalDateTime = (date) => {
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
  return `${formatLocalDate(date)}T${time}`;
};

/** @param {Date} date @param {string} time @returns {Date} */
export const combineLocalDateAndTime = (date, time) => {
  const totalMinutes = timeToMinutes(time);
  const result = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    totalMinutes,
  );
  return result;
};

/** @param {OpeningPeriodInput} period @returns {NormalizedOpeningPeriod} */
export const normalizeOpeningPeriod = ({ start, end }) => {
  const startMinutes = timeToMinutes(start);
  const rawEndMinutes = timeToMinutes(end);
  const closesAtMidnight = rawEndMinutes === 0;

  return {
    start: minutesToTime(startMinutes),
    end: minutesToTime(closesAtMidnight ? 1440 : rawEndMinutes),
    startMinutes,
    endMinutes: closesAtMidnight ? 1440 : rawEndMinutes,
    is24Hours: startMinutes === 0 && rawEndMinutes === 0,
  };
};

/** @param {Record<string, OpeningPeriodInput> | null | undefined} openingHours
 * @returns {Record<string, NormalizedOpeningPeriod>}
 */
export const normalizeOpeningHours = (openingHours) => {
  /** @type {Array<[string, NormalizedOpeningPeriod]>} */
  const normalizedEntries = Object.entries(openingHours || {}).map(
    ([dayType, period]) => [dayType, normalizeOpeningPeriod(period)],
  );
  return Object.fromEntries(normalizedEntries);
};

/** @param {OpeningHours} openingHours @param {Date} date @returns {OpeningPeriod} */
export const getOpeningPeriodForDate = (openingHours, date) =>
  date.getDay() === 0 || date.getDay() === 6
    ? openingHours.weekend
    : openingHours.weekday;

/** @param {OpeningPeriod} openingPeriod @param {number} [interval] @returns {string[]} */
export const generateTimeSlots = (
  openingPeriod,
  interval = SLOT_INTERVAL_MINUTES,
) => {
  const period =
    "startMinutes" in openingPeriod
      ? openingPeriod
      : normalizeOpeningPeriod(openingPeriod);
  /** @type {string[]} */
  const slots = [];
  for (
    let minute = period.startMinutes;
    minute < period.endMinutes;
    minute += interval
  ) {
    slots.push(minutesToTime(minute));
  }
  return slots;
};

/** @param {Date} left @param {Date} right @returns {boolean} */
const isSameLocalDate = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

/** @param {Date} date @param {string} time @param {Date} [now] @returns {boolean} */
export const isPastSlot = (date, time, now = new Date()) =>
  isSameLocalDate(date, now) && combineLocalDateAndTime(date, time) <= now;

/** @param {string[]} slots @param {Date} date @param {Date} [now] @returns {string[]} */
export const filterPastSlots = (slots, date, now = new Date()) =>
  slots.filter((time) => !isPastSlot(date, time, now));

/** @param {Date} date @param {string} time @param {number} duration @returns {Date} */
export const addMinutesToLocalDateTime = (date, time, duration) => {
  const start = combineLocalDateAndTime(date, time);
  return new Date(start.getTime() + duration * 60 * 1000);
};

/** @param {LocalDateTime} value @returns {Date} */
const asLocalDateTime = (value) =>
  value instanceof Date ? value : parseLocalDateTime(value);

/**
 * Compare half-open intervals; touching endpoints are not overlaps.
 * @param {LocalDateTime} firstStart
 * @param {LocalDateTime} firstEnd
 * @param {LocalDateTime} secondStart
 * @param {LocalDateTime} secondEnd
 * @returns {boolean}
 */
export const doReservationPeriodsOverlap = (
  firstStart,
  firstEnd,
  secondStart,
  secondEnd,
) => {
  const aStart = asLocalDateTime(firstStart);
  const aEnd = asLocalDateTime(firstEnd);
  const bStart = asLocalDateTime(secondStart);
  const bEnd = asLocalDateTime(secondEnd);
  return aStart < bEnd && aEnd > bStart;
};

/**
 * @param {Date} selectedDate
 * @param {string} startTime
 * @param {number} duration
 * @param {BookedTime[]} [bookedTimeList]
 * @returns {boolean}
 */
export const isReservationOverlapping = (
  selectedDate,
  startTime,
  duration,
  bookedTimeList = [],
) => {
  const start = combineLocalDateAndTime(selectedDate, startTime);
  const end = addMinutesToLocalDateTime(selectedDate, startTime, duration);
  return bookedTimeList.some((booking) =>
    doReservationPeriodsOverlap(start, end, booking.startTime, booking.endTime),
  );
};

/**
 * @param {{ selectedDate: Date, startTime: string | null | undefined, openingPeriod: OpeningPeriod, bookedTimeList?: BookedTime[], durations?: number[] }} options
 * @returns {number[]}
 */
export const getAvailableDurations = ({
  selectedDate,
  startTime,
  openingPeriod,
  bookedTimeList = [],
  durations = RESERVATION_DURATIONS,
}) => {
  if (!startTime) return [];
  const period =
    "startMinutes" in openingPeriod
      ? openingPeriod
      : normalizeOpeningPeriod(openingPeriod);
  const startMinutes = timeToMinutes(startTime);

  return durations.filter(
    (duration) =>
      startMinutes >= period.startMinutes &&
      (period.is24Hours || startMinutes + duration <= period.endMinutes) &&
      !isReservationOverlapping(
        selectedDate,
        startTime,
        duration,
        bookedTimeList,
      ),
  );
};

/** @param {Date} date @param {string} startTime @param {number} duration
 * @returns {{ startTime: string, endTime: string }}
 */
export const createReservationDateTimes = (date, startTime, duration) => {
  const start = combineLocalDateAndTime(date, startTime);
  const end = addMinutesToLocalDateTime(date, startTime, duration);
  return {
    startTime: formatLocalDateTime(start),
    endTime: formatLocalDateTime(end),
  };
};

/** @param {string | number} bayId @param {Date} date @param {string} startTime @param {number} duration
 * @returns {{ bayId: number, startTime: string, endTime: string }}
 */
export const buildReservationPayload = (bayId, date, startTime, duration) => ({
  bayId: Number(bayId),
  ...createReservationDateTimes(date, startTime, duration),
});
