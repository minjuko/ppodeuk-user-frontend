import { Button } from "../atoms/Button";

const AsyncButton = ({
  isPending,
  pendingLabel = "처리 중...",
  children,
  disabled,
  ...props
}) => (
  <Button disabled={disabled || isPending} aria-busy={isPending} {...props}>
    {isPending ? <span role="status">{pendingLabel}</span> : children}
  </Button>
);

export default AsyncButton;
