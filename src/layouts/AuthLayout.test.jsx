import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import AuthLayout from "./AuthLayout";
import AuthLayoutWithStatusBar from "./AuthLayoutWithStatusBar";

vi.mock("../store/authSlice", () => ({
  getUserInfoThunk: () => ({ type: "auth/check" }),
}));

describe("보호 route 인증 확인", () => {
  afterEach(() => localStorage.clear());

  it("인증 확인 중에는 protected children을 노출하지 않는다", async () => {
    localStorage.setItem("token", "test-token");
    let resolveAuth;
    const store = {
      getState: () => ({}),
      subscribe: () => () => {},
      dispatch: vi.fn(
        () =>
          new Promise((resolve) => {
            resolveAuth = () => resolve({ payload: {} });
          }),
      ),
    };

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="protected" element={<div>protected content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
    resolveAuth();
    await waitFor(() =>
      expect(screen.getByText("protected content")).toBeInTheDocument(),
    );
  });

  it("토큰이 없으면 로그인 안내 상태와 함께 로그인 페이지로 이동한다", async () => {
    const store = {
      getState: () => ({}),
      subscribe: () => () => {},
      dispatch: vi.fn(),
    };

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/history"]}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="history" element={<div>history content</div>} />
            </Route>
            <Route
              path="login"
              element={<div role="alert">로그인이 필요한 페이지입니다.</div>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByRole("alert", { name: "" })).toHaveTextContent(
      "로그인이 필요한 페이지입니다.",
    );
    expect(screen.queryByText("history content")).not.toBeInTheDocument();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("상태바 보호 route도 token이 없으면 원래 경로를 전달하고 인증 요청을 생략한다", async () => {
    const store = {
      getState: () => ({}),
      subscribe: () => () => {},
      dispatch: vi.fn(),
    };

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/payment?step=confirm"]}>
          <Routes>
            <Route element={<AuthLayoutWithStatusBar />}>
              <Route path="payment" element={<div>payment content</div>} />
            </Route>
            <Route path="login" element={<LoginLocationState />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(
      await screen.findByText("/payment?step=confirm"),
    ).toBeInTheDocument();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("상태바 보호 route의 token 검증 실패 시 token을 제거한다", async () => {
    localStorage.setItem("token", "invalid-token");
    const store = {
      getState: () => ({}),
      subscribe: () => () => {},
      dispatch: vi.fn(() => Promise.resolve({ error: { message: "invalid" } })),
    };

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/payment"]}>
          <Routes>
            <Route element={<AuthLayoutWithStatusBar />}>
              <Route path="payment" element={<div>payment content</div>} />
            </Route>
            <Route path="login" element={<div>login page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText("login page")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });
});

const LoginLocationState = () => {
  const location = useLocation();
  return <div>{location.state?.from}</div>;
};
