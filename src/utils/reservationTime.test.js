import { describe, expect, it } from "vitest";
import {
  addMinutesToLocalDateTime,
  buildReservationPayload,
  createReservationDateTimes,
  doReservationPeriodsOverlap,
  filterPastSlots,
  generateTimeSlots,
  getAvailableDurations,
  isPastSlot,
  normalizeOpeningPeriod,
  timeToMinutes,
  minutesToTime,
} from "./reservationTime";

const localDate = (year = 2026, month = 7, day = 11, hour = 0, minute = 0) =>
  new Date(year, month, day, hour, minute);

describe("예약 시간 단위 변환", () => {
  it("HH:mm과 자정 경계 minute를 서로 변환한다", () => {
    expect(timeToMinutes("09:30")).toBe(570);
    expect(minutesToTime(570)).toBe("09:30");
    expect(timeToMinutes("24:00")).toBe(1440);
  });
});

describe("영업시간과 30분 슬롯", () => {
  it.each([
    ["09:00", "18:00", "09:00", "17:30", 18],
    ["09:30", "18:30", "09:30", "18:00", 18],
    ["14:00", "18:00", "14:00", "17:30", 8],
  ])(
    "%s~%s는 %s부터 %s까지 %i개 슬롯을 제공한다",
    (start, end, first, last, count) => {
      const slots = generateTimeSlots({ start, end });
      expect(slots).toHaveLength(count);
      expect(slots.at(0)).toBe(first);
      expect(slots.at(-1)).toBe(last);
    },
  );

  it("00:00~00:00 계약을 24시간 영업인 00:00~24:00으로 정규화한다", () => {
    const period = normalizeOpeningPeriod({ start: "00:00", end: "00:00" });
    expect(period).toMatchObject({
      start: "00:00",
      end: "24:00",
      startMinutes: 0,
      endMinutes: 1440,
      is24Hours: true,
    });
    expect(generateTimeSlots(period)).toHaveLength(48);
  });
});

describe("현재 시각에 따른 슬롯", () => {
  const date = localDate();

  it("오늘 14:10에는 과거 슬롯을 제외하고 다음 30분 슬롯인 14:30부터 허용한다", () => {
    const slots = ["13:30", "14:00", "14:30", "15:00"];
    expect(
      filterPastSlots(slots, date, localDate(2026, 7, 11, 14, 10)),
    ).toEqual(["14:30", "15:00"]);
  });

  it("현재 시각과 정확히 같은 오늘 슬롯은 허용하지 않는다", () => {
    expect(isPastSlot(date, "14:30", localDate(2026, 7, 11, 14, 30))).toBe(
      true,
    );
  });

  it("미래 날짜는 현재 시각과 무관하게 모든 영업 슬롯을 허용한다", () => {
    const slots = ["09:00", "09:30"];
    expect(
      filterPastSlots(
        slots,
        localDate(2026, 7, 12),
        localDate(2026, 7, 11, 23, 0),
      ),
    ).toEqual(slots);
  });
});

describe("예약 구간 겹침", () => {
  const existingStart = "2026-08-11T10:00";
  const existingEnd = "2026-08-11T11:00";

  it.each([
    ["앞부분 겹침", "2026-08-11T09:30", "2026-08-11T10:30"],
    ["뒷부분 겹침", "2026-08-11T10:30", "2026-08-11T11:30"],
    ["내부 포함", "2026-08-11T10:15", "2026-08-11T10:45"],
    ["동일 구간", "2026-08-11T10:00", "2026-08-11T11:00"],
  ])("%s은 겹침으로 판단한다", (_, start, end) => {
    expect(
      doReservationPeriodsOverlap(existingStart, existingEnd, start, end),
    ).toBe(true);
  });

  it.each([
    ["앞쪽 인접", "2026-08-11T09:00", "2026-08-11T10:00"],
    ["뒤쪽 인접", "2026-08-11T11:00", "2026-08-11T12:00"],
    ["다른 날짜", "2026-08-12T10:00", "2026-08-12T11:00"],
  ])("%s 구간은 허용한다", (_, start, end) => {
    expect(
      doReservationPeriodsOverlap(existingStart, existingEnd, start, end),
    ).toBe(false);
  });
});

describe("선택 가능한 duration", () => {
  const date = localDate();

  it("24시간 영업에서 23:30 + 30분은 다음 날 00:00 종료로 허용한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "23:30",
        openingPeriod: { start: "00:00", end: "00:00" },
        durations: [30],
      }),
    ).toEqual([30]);
  });

  it("24시간 영업에서 23:30 + 60분은 다음 날 00:30 종료로 허용한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "23:30",
        openingPeriod: { start: "00:00", end: "00:00" },
        durations: [60],
      }),
    ).toEqual([60]);
  });

  it("24시간 영업에서 23:00 + 90분을 다음 날 00:30 종료로 허용한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "23:00",
        openingPeriod: { start: "00:00", end: "00:00" },
        durations: [90],
      }),
    ).toEqual([90]);
  });

  it("24시간 영업에서도 익일 예약과 겹치면 거부한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "23:30",
        openingPeriod: { start: "00:00", end: "00:00" },
        durations: [60],
        bookedTimeList: [
          { startTime: "2026-08-12T00:00", endTime: "2026-08-12T01:00" },
        ],
      }),
    ).toEqual([]);
  });

  it("전날에서 이어진 예약이 익일 00:00 시작을 막는다", () => {
    expect(
      getAvailableDurations({
        selectedDate: localDate(2026, 7, 12),
        startTime: "00:00",
        openingPeriod: { start: "00:00", end: "00:00" },
        durations: [30],
        bookedTimeList: [
          { startTime: "2026-08-11T23:30", endTime: "2026-08-12T00:30" },
        ],
      }),
    ).toEqual([]);
  });

  it("24시간 영업이 아니면 영업 종료를 넘는 예약을 거부한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "17:30",
        openingPeriod: { start: "09:00", end: "18:00" },
        durations: [60],
      }),
    ).toEqual([]);
  });

  it("17:00 + 60분은 18:00 종료 영업에서 허용한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "17:00",
        openingPeriod: { start: "09:00", end: "18:00" },
        durations: [60],
      }),
    ).toEqual([60]);
  });

  it("17:30 + 60분은 18:00 종료 영업에서 거부한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "17:30",
        openingPeriod: { start: "09:00", end: "18:00" },
        durations: [60],
      }),
    ).toEqual([]);
  });

  it("18:00 + 30분은 09:30~18:30 영업에서 허용한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "18:00",
        openingPeriod: { start: "09:30", end: "18:30" },
        durations: [30],
      }),
    ).toEqual([30]);
  });

  it("영업 시작 전 선택은 거부한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "08:30",
        openingPeriod: { start: "09:00", end: "18:00" },
        durations: [30],
      }),
    ).toEqual([]);
  });

  it("30분, 60분, 240분 정책 duration을 영업 종료와 예약 겹침으로 필터링한다", () => {
    expect(
      getAvailableDurations({
        selectedDate: date,
        startTime: "09:00",
        openingPeriod: { start: "09:00", end: "18:00" },
        durations: [30, 60, 240],
        bookedTimeList: [
          { startTime: "2026-08-11T10:00", endTime: "2026-08-11T11:00" },
        ],
      }),
    ).toEqual([30, 60]);
  });
});

describe("로컬 datetime과 API payload", () => {
  it("23:30 + 60분 종료를 문자열 표식 없이 다음 날 00:30 datetime으로 계산한다", () => {
    const end = addMinutesToLocalDateTime(localDate(), "23:30", 60);
    expect(end.getDate()).toBe(12);
    expect(end.getHours()).toBe(0);
    expect(end.getMinutes()).toBe(30);
    expect(createReservationDateTimes(localDate(), "23:30", 60)).toEqual({
      startTime: "2026-08-11T23:30",
      endTime: "2026-08-12T00:30",
    });
  });

  it("가격 계산과 예약 확정에 재사용할 bayId/startTime/endTime payload를 만든다", () => {
    expect(buildReservationPayload("7", localDate(), "17:00", 60)).toEqual({
      bayId: 7,
      startTime: "2026-08-11T17:00",
      endTime: "2026-08-11T18:00",
    });
  });
});
