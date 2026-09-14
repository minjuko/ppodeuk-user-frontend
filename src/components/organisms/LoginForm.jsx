import TextInput from "../atoms/TextInput";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../atoms/Button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../store/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import PropTypes from "prop-types";
import Close from "/close.svg";
import { showDemoUi } from "../../demo/mode";
import { DEMO_CREDENTIALS } from "../../mocks/demoData";

const PORTFOLIO_CREDENTIALS = showDemoUi
  ? DEMO_CREDENTIALS
  : {
      email: "test-user@example.com",
      password: "test1234!",
    };

const ValidationMessage = ({ message }) => (
  <small
    className="block min-h-10 text-red-500"
    role={message ? "alert" : undefined}
    aria-live="polite"
  >
    {message || "\u00a0"}
  </small>
);

ValidationMessage.propTypes = {
  message: PropTypes.string,
};

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (data) => {
    return dispatch(loginThunk(data))
      .then(unwrapResult)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        if (error?.error?.code === "1001") {
          if (error.error.message?.email) {
            setErrorMessage("유효하지 않은 이메일입니다.");
          } else if (error.error.message?.password) {
            setErrorMessage(
              "비밀번호는 영소문자, 숫자, 특수문자를 포함해야합니다. 공백은 포함하지 않습니다",
            );
          }
        } else if (error?.error?.code === "1201") {
          setErrorMessage("잘못된 비밀번호입니다.");
        } else if (error?.error?.code === "1301") {
          setErrorMessage("존재하지 않는 이메일입니다.");
        } else {
          setErrorMessage("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
      });
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
    criteriaMode: "all",
  });

  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  return (
    <div className="relative flex flex-col justify-center h-screen p-4">
      <Button
        className="absolute left-4 top-4"
        onClick={() => {
          navigate("/");
        }}
      >
        <img src={Close} alt="닫기 버튼" />
      </Button>
      <div className="grid gap-16">
        <h1 className="text-2xl font-bold text-center">로그인</h1>
        <form
          noValidate
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {location.state?.authRequired && (
            <div
              className="p-3 text-sm text-center border border-yellow-300 rounded-lg bg-yellow-50"
              role="alert"
            >
              로그인이 필요한 페이지입니다. 로그인 후 이용해 주세요.
            </div>
          )}
          <TextInput
            type="email"
            placeholder="이메일"
            {...register("email", {
              required: "이메일은 필수 입력입니다.",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "이메일 형식에 맞지 않습니다.",
              },
            })}
          />
          <ValidationMessage message={errors.email?.message} />
          <TextInput
            type="password"
            placeholder="비밀번호"
            {...register("password", {
              required: "비밀번호는 필수 입력입니다.",
              minLength: {
                value: 8,
                message: "8자 이상 입력해주세요.",
              },
              maxLength: {
                value: 20,
                message: "20자 이하로 입력해주세요.",
              },
            })}
          />
          <ValidationMessage message={errors.password?.message} />
          <ValidationMessage message={errorMessage} />
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="long"
              className="rounded-lg"
            >
              로그인
            </Button>
            <div className="flex items-center justify-between gap-3 p-3 text-sm border border-sky-200 rounded-lg bg-sky-50">
              <div className="min-w-0">
                <p className="font-semibold text-sky-700">처음 방문하셨나요?</p>
                <p className="mt-1">테스트 계정으로 바로 체험해 보세요.</p>
                <p className="mt-1 text-xs text-gray-500 break-all">
                  {PORTFOLIO_CREDENTIALS.email} /{" "}
                  {PORTFOLIO_CREDENTIALS.password}
                </p>
              </div>
              <Button
                type="button"
                variant="demo"
                onClick={() => {
                  setValue("email", PORTFOLIO_CREDENTIALS.email, {
                    shouldValidate: true,
                  });
                  setValue("password", PORTFOLIO_CREDENTIALS.password, {
                    shouldValidate: true,
                  });
                }}
                aria-label="테스트 계정 정보 입력"
              >
                테스트 계정 사용
              </Button>
            </div>
            <Link
              to="/signup"
              className="w-full p-4 font-semibold text-center text-gray-700 border border-slate-200 bg-[aliceblue] h-14 rounded-xl active:filter active:brightness-75"
            >
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
