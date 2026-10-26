import { describe, expect, it } from "vitest";
import {
  isValidReservationDate,
  parseReservationRouteDate,
  parseReservationRouteId,
} from "./reservationRoute";

describe("reservation route input validation", () => {
  it("accepts only positive safe integer route IDs", () => {
    expect(parseReservationRouteId("101")).toBe(101);
    expect(parseReservationRouteId(101)).toBe(101);
    expect(parseReservationRouteId("0")).toBeNull();
    expect(parseReservationRouteId("1e3")).toBeNull();
    expect(parseReservationRouteId("not-an-id")).toBeNull();
    expect(parseReservationRouteId(Number.NaN)).toBeNull();
    expect(parseReservationRouteId(Number.MAX_SAFE_INTEGER + 1)).toBeNull();
  });

  it("accepts valid date values and rejects invalid or normalized date strings", () => {
    expect(
      parseReservationRouteDate("2026-08-11T10:00:00.000Z")?.toISOString(),
    ).toBe("2026-08-11T10:00:00.000Z");
    expect(parseReservationRouteDate("2026-02-30T10:00:00.000Z")).toBeNull();
    expect(parseReservationRouteDate("not-a-date")).toBeNull();
    expect(isValidReservationDate(new Date("invalid"))).toBe(false);
  });
});
