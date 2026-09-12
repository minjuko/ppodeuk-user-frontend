import React from "react";
import { Button } from "./Button";
import { getErrorDetail } from "../../layouts/errorswitch";
import Warning from "/warning.svg";

export class GeneralErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch() {}

  render() {
    if (this.state.error) {
      const statusCode =
        this.state.error.status || this.state.error.response?.status;

      let errorPageURL = "/error";
      if (statusCode == 401) {
        errorPageURL = "/login";
      } else {
        errorPageURL = "/";
      }

      const errordetail = getErrorDetail(this.state.error);

      const contents =
        statusCode == 401
          ? "로그인이 필요한 페이지입니다. 로그인을 해 주세요."
          : "에러가 발생하였습니다. 잠시 후 다시 시도해주세요.";
      const buttontext =
        statusCode == 401 ? "로그인 페이지로 이동" : "홈으로 이동";

      return (
        <div className="flex items-center h-screen flex-cols">
          <div className="flex flex-col items-center gap-8">
            <img src={Warning} alt="에러 아이콘" className="block w-12" />
            <p className="px-8 text-center">{errordetail || contents}</p>
          </div>
          <Button
            variant="long"
            onClick={() => this.props.navigate(errorPageURL)}
            className="fixed bottom-0"
          >
            {buttontext}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
