import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserInfo, login } from "../apis/user";
import authReducer, { getUserInfoThunk, loginThunk, logout } from "./authSlice";

vi.mock("../apis/user", () => ({
  login: vi.fn(),
  UserInfo: vi.fn(),
}));

const createStore = () => configureStore({ reducer: { auth: authReducer } });

describe("인증 상태와 오류 처리", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.clearAllMocks());

  it("정상 로그인 시 token을 저장하고 인증 상태를 갱신한다", async () => {
    login.mockResolvedValue({
      headers: { authorization: "Bearer valid-token" },
      data: { response: {} },
    });
    const store = createStore();

    const action = await store.dispatch(
      loginThunk({ email: "user@example.com", password: "password!" }),
    );

    expect(action.type).toBe("auth/login/fulfilled");
    expect(localStorage.getItem("token")).toBe("Bearer valid-token");
    expect(store.getState().auth).toMatchObject({
      isLoggedIn: true,
      isLoading: false,
      error: null,
    });
  });

  it.each([
    ["네트워크 오류", new Error("Network Error")],
    ["본문 없는 HTTP 오류", { response: { status: 500 } }],
  ])("%s를 안전한 rejected action으로 처리한다", async (_, error) => {
    localStorage.setItem("token", "Bearer existing-token");
    login.mockRejectedValue(error);
    const store = createStore();

    const action = await store.dispatch(loginThunk({}));

    expect(action.type).toBe("auth/login/rejected");
    expect(store.getState().auth).toMatchObject({
      isLoggedIn: false,
      isLoading: false,
    });
    expect(store.getState().auth.error).toBeTruthy();
    expect(localStorage.getItem("token")).toBe("Bearer existing-token");
  });

  it("payload 없는 rejected action도 reducer에서 안전하게 처리한다", () => {
    const state = authReducer(undefined, { type: "auth/login/rejected" });

    expect(state).toMatchObject({ isLoggedIn: false, isLoading: false });
    expect(state.error).toBeTruthy();
  });

  it("token 없는 성공 응답은 로그인 성공으로 처리하지 않는다", async () => {
    localStorage.setItem("token", "Bearer stale-token");
    login.mockResolvedValue({ headers: {}, data: { response: {} } });
    const store = createStore();
    store.dispatch({
      type: "auth/getUserInfo/fulfilled",
      payload: { response: { name: "기존 사용자" } },
    });

    const action = await store.dispatch(loginThunk({}));

    expect(action.type).toBe("auth/login/rejected");
    expect(localStorage.getItem("token")).toBeNull();
    expect(store.getState().auth).toMatchObject({
      isLoggedIn: false,
      userName: "",
    });
  });

  it("로그인 인증 실패는 기존 세션 토큰과 사용자 상태를 유지한다", async () => {
    localStorage.setItem("token", "Bearer stale-token");
    login.mockRejectedValue({ response: { status: 401, data: {} } });
    const store = createStore();
    store.dispatch({
      type: "auth/getUserInfo/fulfilled",
      payload: { response: { name: "기존 사용자" } },
    });

    await store.dispatch(
      loginThunk({ email: "user@example.com", password: "bad" }),
    );

    expect(localStorage.getItem("token")).toBe("Bearer stale-token");
    expect(store.getState().auth).toMatchObject({
      isLoggedIn: true,
      userName: "기존 사용자",
      isLoading: false,
    });
  });

  it("유효하지 않은 token이면 복원된 인증 상태와 사용자명을 초기화한다", async () => {
    UserInfo.mockRejectedValue({ response: { status: 401 } });
    localStorage.setItem("token", "Bearer expired-token");
    const store = createStore();
    await store.dispatch({
      type: "auth/getUserInfo/fulfilled",
      payload: { response: { name: "기존 사용자" } },
    });

    await store.dispatch(getUserInfoThunk());

    expect(store.getState().auth).toMatchObject({
      isLoggedIn: false,
      userName: "",
      isLoading: false,
    });
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("사용자 정보 조회가 503이면 저장된 세션과 인증 상태를 유지한다", async () => {
    UserInfo.mockRejectedValue({ response: { status: 503 } });
    localStorage.setItem("token", "Bearer temporarily-unavailable");
    const store = createStore();
    store.dispatch({
      type: "auth/getUserInfo/fulfilled",
      payload: { response: { name: "기존 사용자" } },
    });

    await store.dispatch(getUserInfoThunk());

    expect(localStorage.getItem("token")).toBe(
      "Bearer temporarily-unavailable",
    );
    expect(store.getState().auth).toMatchObject({
      isLoggedIn: true,
      userName: "기존 사용자",
      isLoading: false,
    });
  });

  it("새로고침 후 저장된 token 검증에 성공하면 인증 상태를 복원한다", async () => {
    localStorage.setItem("token", "Bearer valid-token");
    UserInfo.mockResolvedValue({ data: { response: { name: "사용자" } } });
    const store = createStore();

    await store.dispatch(getUserInfoThunk());

    expect(store.getState().auth).toMatchObject({
      isLoggedIn: true,
      userName: "사용자",
      error: null,
    });
  });

  it("로그아웃 시 token과 인증 상태를 제거한다", () => {
    localStorage.setItem("token", "Bearer valid-token");
    localStorage.setItem("persist:root", "persisted-state");
    const authenticated = authReducer(undefined, {
      type: "auth/getUserInfo/fulfilled",
      payload: { response: { name: "사용자" } },
    });

    const state = authReducer(authenticated, logout());

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("persist:root")).toBeNull();
    expect(state).toMatchObject({ isLoggedIn: false, userName: "" });
  });
});
