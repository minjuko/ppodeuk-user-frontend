import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DemoStartupError from "./DemoStartupError";

describe("DemoStartupError", () => {
  it("explains the startup failure and lets the user retry", () => {
    const onRetry = vi.fn();
    render(<DemoStartupError onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "데모 환경을 시작하지 못했습니다.",
    );
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
