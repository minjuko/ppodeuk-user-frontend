import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DualBottomsheet from "./DualBottomsheet";

const gesture = vi.hoisted(() => ({ handler: null }));
const setSpring = vi.fn();

vi.mock("@use-gesture/react", () => ({
  useDrag: (handler) => {
    gesture.handler = handler;
    return () => ({});
  },
}));
vi.mock("@react-spring/web", () => ({
  animated: { div: "div" },
  config: { stiff: {} },
  useSpring: () => [
    {
      y: {
        get: () => 350,
        to: (transform) => transform(350),
      },
    },
    setSpring,
  ],
}));

describe("예약 검색 bottom sheet", () => {
  it("drag 진행 중 정의되지 않은 state 함수를 호출하지 않는다", () => {
    render(<DualBottomsheet>content</DualBottomsheet>);
    expect(() =>
      gesture.handler({
        offset: [0, 200],
        down: true,
        tap: false,
        first: false,
        last: false,
      }),
    ).not.toThrow();
    expect(setSpring).toHaveBeenCalled();
  });
});
