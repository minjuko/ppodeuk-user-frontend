// @ts-check

/** @param {unknown} value @returns {number | null} */
export const parseReservationRouteId = (value) => {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
};

/** @param {unknown} value @returns {value is Date} */
export const isValidReservationDate = (value) =>
  value instanceof Date && Number.isFinite(value.getTime());

/** @param {unknown} value @returns {Date | null} */
export const parseReservationRouteDate = (value) => {
  if (isValidReservationDate(value)) return new Date(value.getTime());
  if (typeof value !== "string") return null;

  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.exec(
      value,
    );
  if (!match) return null;

  const [, year, month, day, hour, minute, second] = match.map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return null;
  }

  const parsed = new Date(value);
  return isValidReservationDate(parsed) ? parsed : null;
};
