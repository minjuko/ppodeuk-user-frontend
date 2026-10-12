import { Button } from "../atoms/Button";

const InlineError = ({ message, onRetry }) => (
  <div
    className="grid gap-3 p-4 text-center border border-red-200 rounded-lg bg-red-50"
    role="alert"
  >
    <p className="text-red-700">{message}</p>
    {onRetry ? <Button onClick={onRetry}>다시 시도</Button> : null}
  </div>
);

export default InlineError;
