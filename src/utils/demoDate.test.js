import { afterEach, describe, expect, it } from "vitest";
import { getDemoDate } from "./demoDate";

afterEach(() => {
  window.history.replaceState({}, "", "/");
  window.localStorage.clear();
});

describe("데모 촬영 기준일", () => {
  it("demoDate query를 기준일로 사용하고 localStorage에 유지한다", () => {
    window.history.replaceState({}, "", "/?demoDate=2026-05-15");

    expect(getDemoDate().getFullYear()).toBe(2026);
    expect(getDemoDate().getMonth()).toBe(4);
    expect(getDemoDate().getDate()).toBe(15);
    expect(window.localStorage.getItem("ppodeuk:demo-date")).toBe("2026-05-15");
  });

  it("저장된 기준일을 query 없이도 다시 사용한다", () => {
    window.localStorage.setItem("ppodeuk:demo-date", "2026-05-15");

    expect(getDemoDate().getFullYear()).toBe(2026);
    expect(getDemoDate().getMonth()).toBe(4);
    expect(getDemoDate().getDate()).toBe(15);
  });
});
