import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HomeTemplate from "./HomeTemplate";

const queryState = vi.hoisted(() => ({ options: null, mode: "pending" }));

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: () => ({ isLoggedIn: false, userName: "" }),
}));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ removeQueries: vi.fn() }),
  useQueries: (options) => {
    queryState.options = options;
    if (queryState.mode === "error") {
      return [{ isPending: false, isError: true }, { isPending: false }];
    }
    return [{ isPending: true, isError: false }, { isPending: false }];
  },
}));
vi.mock("../molecules/CarwashCard", () => ({
  CarwashCard: ({ name }) => <div data-testid="recommended-card">{name}</div>,
}));
vi.mock("../organisms/RecentCarwashSlider", () => ({ default: () => null }));
vi.mock("../../apis/carwashes", () => ({ carwashesRecommended: vi.fn() }));
vi.mock("../../apis/reservations", () => ({ reservationsRecent: vi.fn() }));
vi.mock("../../store/authSlice", () => ({
  logout: () => ({ type: "logout" }),
}));

describe("홈 추천 세차장", () => {
  it("비로그인 상태에서도 기본 좌표로 추천 query를 활성화한다", () => {
    queryState.mode = "pending";
    render(
      <MemoryRouter>
        <HomeTemplate />
      </MemoryRouter>,
    );

    expect(queryState.options.queries[0]).toMatchObject({
      queryKey: ["recommended", 35.143066, 126.922375],
      enabled: true,
    });
    expect(queryState.options.queries[1].enabled).toBe(false);
    expect(screen.getByRole("status")).toHaveTextContent(
      "추천 세차장을 불러오는 중입니다.",
    );
  });

  it("추천 API가 실패해도 기본 추천 카드를 표시한다", () => {
    queryState.mode = "error";
    render(
      <MemoryRouter>
        <HomeTemplate />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("recommended-card")).toHaveTextContent(
      "버블샤인 세차장",
    );
  });
});
