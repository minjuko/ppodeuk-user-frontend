export const Bottomsheet = ({ className, children }) => {
  return (
    <div
      className={`relative w-screen min-h-0 overflow-hidden rounded-t-xl bg-white shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};
