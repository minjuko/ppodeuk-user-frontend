import BrandLogo from "./BrandLogo";

const AppTopBar = ({
  children,
  className = "",
  logoClassName = "",
  fixed = false,
  showLogo = true,
  desktopTopClass = "md:top-0",
  desktopMaxWidthClass = "md:max-w-[560px]",
  desktopPaddingClass = "md:px-4",
}) => {
  const positionClass = fixed
    ? `fixed inset-x-0 top-4 z-50 pointer-events-none ${desktopTopClass}`
    : "";
  const heightClass = fixed ? "h-10 md:h-[72px]" : "h-10";
  const innerClass = fixed
    ? `mx-auto w-full max-w-md px-4 ${desktopMaxWidthClass} ${desktopPaddingClass}`
    : "w-full";

  return (
    <header className={`${positionClass} ${heightClass} ${className}`}>
      <div
        className={`mx-auto flex h-full items-center justify-between ${innerClass}`}
      >
        {showLogo && <BrandLogo className={logoClassName} />}
        {children && (
          <div className={fixed ? "pointer-events-auto" : ""}>{children}</div>
        )}
      </div>
    </header>
  );
};

export default AppTopBar;
