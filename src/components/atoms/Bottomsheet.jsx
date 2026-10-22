export const Bottomsheet = ({ className, children }) => {
  return (
    <div
      className={`relative w-full min-h-0 overflow-hidden rounded-t-xl bg-white shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};
