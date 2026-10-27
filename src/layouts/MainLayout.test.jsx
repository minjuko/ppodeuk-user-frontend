import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { UserInfo } from "../apis/user";
import authReducer from "../store/authSlice";
import { MainLayout } from "./MainLayout";

vi.mock("../apis/user", () => ({
  UserInfo: vi.fn(),
  login: vi.fn(),
}));

vi.mock("../components/atoms/GNB", () => ({
  GNB: () => <nav aria-label="주 메뉴" />,
}));

const createStore = (authState) =>
  configureStore({
    reducer: { auth: authReducer },
    ...(authState ? { preloadedState: { auth: authState } } : {}),
  });

const LoginState = () => {
  const location = useLocation();
  const state = location.state;
  const reason = state?.authExpired
    ? "expired"
    : state?.authCheckFailed
    ? "check-failed"
    : "required";

  return <div role="alert">{`${reason}:${state?.from ?? ""}`}</div>;
};

const renderMainLayout = (store, initialEntry = "/") =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<div>public home</div>} />
          </Route>
          <Route path="/login" element={<LoginState />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

const authenticatedState = {
  isLoggedIn: true,
  isLoading: false,
  userName: "기존 사용자",
  error: null,
};

describe("MainLayout optional session check", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("토큰이 없으면 사용자 조회 없이 공개 화면을 렌더한다", () => {
    const store = createStore();

    renderMainLayout(store);

    expect(screen.getByText("public home")).toBeInTheDocument();
    expect(UserInfo).not.toHaveBeenCalled();
  });

  it("사용자 조회 성공 시 공개 화면과 기존 인증 상태를 유지한다", async () => {
    localStorage.setItem("token", "Bearer valid-token");
    UserInfo.mockResolvedValue({ data: { response: { name: "새 사용자" } } });
    const store = createStore(authenticatedState);

    renderMainLayout(store);

    await waitFor(() =>
      expect(store.getState().auth).toMatchObject({
        isLoggedIn: true,
        userName: "새 사용자",
      }),
    );
    expect(screen.getByText("public home")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBe("Bearer valid-token");
  });

  it("401이면 thunk가 token과 인증 상태를 정리하고 만료 안내로 이동한다", async () => {
    localStorage.setItem("token", "Bearer expired-token");
    UserInfo.mockRejectedValue({ response: { status: 401, data: {} } });
    const store = createStore(authenticatedState);

    renderMainLayout(store, "/?source=home");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "expired:/?source=home",
    );
    expect(localStorage.getItem("token")).toBeNull();
    expect(store.getState().auth).toMatchObject({
      isLoggedIn: false,
      userName: "",
      isLoading: false,
    });
  });

  it.each([
    ["503", { response: { status: 503 } }],
    ["다른 5xx", { response: { status: 500 } }],
    ["네트워크 오류", new Error("Network Error")],
  ])(
    "%s이면 token과 기존 인증 상태를 보존하고 재시도 안내로 이동한다",
    async (_, error) => {
      localStorage.setItem("token", "Bearer temporarily-unavailable");
      UserInfo.mockRejectedValue(error);
      const store = createStore(authenticatedState);

      renderMainLayout(store, "/?source=home");

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "check-failed:/?source=home",
      );
      expect(localStorage.getItem("token")).toBe(
        "Bearer temporarily-unavailable",
      );
      expect(store.getState().auth).toMatchObject({
        isLoggedIn: true,
        userName: "기존 사용자",
        isLoading: false,
      });
    },
  );
});
