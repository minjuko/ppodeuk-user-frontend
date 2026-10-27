export const Button = ({
  variant,
  className,
  children,
  type = "button",
  ...props
}) => {
  const styles = {
    long: "block w-full h-14 p-4 bg-primary text-white font-semibold active:brightness-75",
    small:
      "block w-28 h-14 bg-sky-50 border border-sky-200 text-sky-700 font-semibold rounded-lg",
    cancel:
      "h-11 px-3 bg-red-700 border border-red-700 text-white text-xs font-semibold rounded-lg whitespace-nowrap transition hover:bg-red-800",
    review:
      "h-11 px-3 bg-primary border border-primary text-white text-xs font-semibold rounded-lg whitespace-nowrap transition hover:brightness-90",
    checkemail: "bg-primary text-white rounded-lg w-28 font-semibold",
    demo: "shrink-0 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-lg whitespace-nowrap",
  };

  return (
    <button
      type={type}
      className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
