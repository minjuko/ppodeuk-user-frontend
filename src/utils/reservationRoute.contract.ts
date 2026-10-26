import {
  isValidReservationDate,
  parseReservationRouteDate,
  parseReservationRouteId,
} from "./reservationRoute";

const parsedId: number | null = parseReservationRouteId("101");
const parsedDate: Date | null = parseReservationRouteDate(
  "2026-08-11T10:00:00.000Z",
);
const validDate: boolean = isValidReservationDate(parsedDate);
void [parsedId, validDate];
