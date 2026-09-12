import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("공통 Button type", () => {
  it("명시하지 않은 버튼은 form submit을 유발하지 않는다", () => {
    render(<Button>일반 동작</Button>);
    expect(screen.getByRole("button", { name: "일반 동작" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("submit type을 명시하면 유지한다", () => {
    render(<Button type="submit">제출</Button>);
    expect(screen.getByRole("button", { name: "제출" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});
