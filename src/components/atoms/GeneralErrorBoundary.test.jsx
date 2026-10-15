import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GeneralErrorBoundary } from "./GeneralErrorBoundary";

const BrokenView = () => {
  throw new Error("failed");
};

describe("GeneralErrorBoundary", () => {
  it("offers retry and home navigation for a general query error", () => {
    const navigate = vi.fn();
    render(
      <GeneralErrorBoundary navigate={navigate}>
        <BrokenView />
      </GeneralErrorBoundary>,
    );

    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "홈으로 이동" }));
    expect(navigate).toHaveBeenCalledWith("/");
  });
});
