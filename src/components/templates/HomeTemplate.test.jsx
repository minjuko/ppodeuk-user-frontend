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
vi.mock("../molecules/CarwashCard", () => ({ CarwashCard: () => null }));
vi.mock("../organisms/RecentCarwashSlider", () => ({ default: () => null }));
vi.mock("../../apis/carwashes", () => ({ carwashesRecommended: vi.fn() }));
vi.mock("../../apis/reservations", () => ({ reservationsRecent: vi.fn() }));
vi.mock("../../store/authSlice", () => ({
  logout: () => ({ type: "logout" }),
}));

describe("홈 API 상태", () => {
  it("추천 query를 위치별로 구분하고 비로그인 시 최근 예약을 호출하지 않는다", () => {
    queryState.mode = "pending";
    render(
      <MemoryRouter>
        <HomeTemplate />
      </MemoryRouter>,
    );

    expect(queryState.options.queries[0].queryKey).toEqual([
      "recommended",
      35.14,
      126.9,
    ]);
    expect(queryState.options.queries[1].enabled).toBe(false);
    expect(screen.getByRole("status")).toHaveTextContent(
      "추천 세차장을 불러오는 중입니다.",
    );
  });

  it("추천 API 실패를 빈 화면 대신 사용자에게 알린다", () => {
    queryState.mode = "error";
    render(
      <MemoryRouter>
        <HomeTemplate />
      </MemoryRouter>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "추천 세차장을 불러오지 못했습니다.",
    );
  });
});
