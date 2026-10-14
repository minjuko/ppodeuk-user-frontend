import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm";
import { DEMO_CREDENTIALS } from "../../mocks/demoData";

vi.mock("../../store/authSlice", () => ({
  loginThunk: vi.fn(),
}));

const store = {
  getState: () => ({}),
  subscribe: () => () => {},
  dispatch: vi.fn(),
};

describe("production login", () => {
  it("does not show mock login credentials", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByText(DEMO_CREDENTIALS.email)).not.toBeInTheDocument();
  });
});

describe("로그인 화면 진입 동선", () => {
  it("회원가입 링크를 항상 제공한다", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByRole("link", { name: "회원가입" })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("보호 페이지에서 이동한 경우 로그인 필요 안내를 표시한다", () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/login",
              state: { authRequired: true, from: "/history" },
            },
          ]}
        >
          <Routes>
            <Route path="login" element={<LoginForm />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "로그인이 필요한 페이지입니다.",
    );
  });

  it("로그인 성공 후 원래 접근하려던 경로로 복귀한다", async () => {
    const authenticatedStore = {
      getState: () => ({}),
      subscribe: () => () => {},
      dispatch: vi.fn(() => Promise.resolve({ payload: {} })),
    };

    render(
      <Provider store={authenticatedStore}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/login",
              state: { authRequired: true, from: "/payment?step=confirm" },
            },
          ]}
        >
          <Routes>
            <Route path="login" element={<LoginForm />} />
            <Route path="payment" element={<div>원래 접근한 결제 경로</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText("이메일"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
      target: { value: "password!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() =>
      expect(screen.getByText("원래 접근한 결제 경로")).toBeInTheDocument(),
    );
  });
});

describe("로그인 오류 안내", () => {
  it.each([
    [{ error: { code: "1201" } }, "잘못된 비밀번호입니다."],
    [
      { error: { message: "인증 요청을 처리하지 못했습니다." } },
      "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    ],
  ])(
    "서버 오류 구조에 맞는 안전한 메시지를 표시한다",
    async (payload, message) => {
      const rejectedStore = {
        getState: () => ({}),
        subscribe: () => () => {},
        dispatch: vi.fn(() =>
          Promise.resolve({
            error: {},
            payload,
            meta: { rejectedWithValue: true },
          }),
        ),
      };

      render(
        <Provider store={rejectedStore}>
          <MemoryRouter>
            <LoginForm />
          </MemoryRouter>
        </Provider>,
      );

      fireEvent.change(screen.getByPlaceholderText("이메일"), {
        target: { value: "user@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
        target: { value: "password!" },
      });
      fireEvent.click(screen.getByRole("button", { name: "로그인" }));

      expect(await screen.findByText(message)).toBeInTheDocument();
    },
  );
});
