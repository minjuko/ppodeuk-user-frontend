import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loader from "./Loader";

describe("Loader", () => {
  it("fullscreen loading 상태를 status로 표시한다", () => {
    render(<Loader />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("status")).toHaveTextContent("로딩 중");
  });

  it("inline loading 상태와 사용자 문구를 표시한다", () => {
    render(<Loader variant="inline" label="리뷰를 불러오는 중입니다." />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "리뷰를 불러오는 중입니다.",
    );
  });
});
