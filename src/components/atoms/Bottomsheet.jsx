export const Bottomsheet = ({ className, children, dragHandle, id }) => {
  return (
    <div
      id={id}
      className={`relative w-full min-h-0 overflow-hidden rounded-t-xl bg-white shadow-xl ${className}`}
    >
      {dragHandle}
      {children}
    </div>
  );
};
