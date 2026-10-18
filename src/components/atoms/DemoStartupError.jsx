import PropTypes from "prop-types";

const DemoStartupError = ({ onRetry }) => (
  <main
    role="alert"
    className="grid min-h-screen place-content-center gap-4 p-6 text-center"
  >
    <h1 className="text-xl font-bold">데모 환경을 시작하지 못했습니다.</h1>
    <p>
      페이지를 새로고침해 다시 시도해 주세요. 문제가 계속되면 개발자 도구의
      콘솔을 확인해 주세요.
    </p>
    <button
      className="mx-auto rounded-lg border px-4 py-2"
      onClick={onRetry}
      type="button"
    >
      다시 시도
    </button>
  </main>
);

DemoStartupError.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default DemoStartupError;
