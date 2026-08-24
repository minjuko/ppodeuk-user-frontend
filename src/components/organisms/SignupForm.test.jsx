import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SignupForm from "./SignupForm";
import { signup } from "../../apis/user";

let mutationOptions;

vi.mock("@tanstack/react-query", () => ({
  useMutation: (options) => {
    mutationOptions = options;
    return { mutate: vi.fn(), isPending: false };
  },
}));

vi.mock("../../apis/user", () => ({
  signup: vi.fn(),
  checkEmail: vi.fn(),
}));

describe("회원가입 요청", () => {
  it("회원가입 API Promise가 완료될 때까지 mutation이 대기한다", () => {
    const pendingRequest = new Promise(() => {});
    signup.mockReturnValue(pendingRequest);
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
    );

    const formData = { username: "user", email: "user@example.com" };
    expect(mutationOptions.mutationFn(formData)).toBeInstanceOf(Promise);
    expect(signup).toHaveBeenCalledWith(formData);
  });

  it("전화번호를 하이픈 형식으로 표시하고 API에는 숫자만 전달한다", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
    );

    const telInput = screen.getByLabelText("전화번호");
    fireEvent.change(telInput, { target: { value: "01012345678" } });

    expect(telInput).toHaveValue("010-1234-5678");

    mutationOptions.mutationFn({ tel: telInput.value });
    expect(signup).toHaveBeenLastCalledWith({ tel: "01012345678" });
  });

  const renderPasswordInput = () => {
    const { container } = render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
    );
    return container.querySelector('input[type="password"]');
  };

  it.each([
    ["8자 비밀번호", "Aa1!aaaa"],
    ["20자 비밀번호", `Aa1!${"a".repeat(16)}`],
  ])("%s를 허용한다", async (_, password) => {
    const passwordInput = renderPasswordInput();

    fireEvent.change(passwordInput, { target: { value: password } });

    await waitFor(() =>
      expect(
        screen.queryByText(
          "영문, 숫자, 특수기호 조합 8자리 이상 20자리 이하로 입력해주세요.",
        ),
      ).not.toBeInTheDocument(),
    );
  });

  it.each([
    ["7자 비밀번호", "Aa1!aaa"],
    ["21자 비밀번호", `Aa1!${"a".repeat(17)}`],
  ])("%s를 거부한다", async (_, password) => {
    const passwordInput = renderPasswordInput();

    fireEvent.change(passwordInput, { target: { value: password } });

    expect(
      await screen.findByText(
        "영문, 숫자, 특수기호 조합 8자리 이상 20자리 이하로 입력해주세요.",
      ),
    ).toBeInTheDocument();
  });
});
