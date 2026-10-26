import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HomeTemplate from "./HomeTemplate";
import { FALLBACK_RECOMMENDED_CARWASH } from "../../demo/mode";

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

describe("home recommended carwash", () => {
  it("requests recommendations with demo coordinates and shows a loading state while pending", () => {
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
    expect(screen.queryByTestId("recommended-card")).not.toBeInTheDocument();
    expect(
      screen.getByText("추천 세차장을 불러오는 중입니다."),
    ).toBeInTheDocument();
  });

  it("shows fallback when the recommendation API fails", () => {
    queryState.mode = "error";
    render(
      <MemoryRouter>
        <HomeTemplate />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("recommended-card")).toHaveTextContent(
      FALLBACK_RECOMMENDED_CARWASH.name,
    );
    expect(
      screen.getByText(
        "추천 정보를 불러오지 못해 예시 세차장을 표시하고 있습니다.",
      ),
    ).toBeInTheDocument();
  });
});
