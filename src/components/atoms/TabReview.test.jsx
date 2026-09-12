import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TabReview from "./TabReview";

const queryState = vi.hoisted(() => ({ options: null }));

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options) => {
    queryState.options = options;
    return { isPending: true, isError: false };
  },
}));
vi.mock("../../apis/carwashes", () => ({ carwashesReviews: vi.fn() }));

describe("세차장 리뷰 loading 상태", () => {
  it("URL의 carwashId로 조회하고 loading feedback을 표시한다", () => {
    render(<TabReview carwashId="12" />);
    expect(queryState.options.queryKey).toEqual(["carwashesReviews", "12"]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "리뷰를 불러오는 중입니다.",
    );
  });
});
