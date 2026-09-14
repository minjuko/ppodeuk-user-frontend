const Loader = ({ variant = "fullscreen", label = "로딩 중" }) => {
  const isFullscreen = variant === "fullscreen";

  return (
    <div
      className={
        isFullscreen
          ? "flex flex-col items-center justify-center min-h-screen"
          : "flex items-center justify-center gap-2 py-6"
      }
      role="status"
      aria-live="polite"
    >
      <img
        src="/Loader/bdbdLoader.gif"
        alt=""
        className={isFullscreen ? "w-20 h-20" : "w-8 h-8"}
      />
      <div
        className={
          isFullscreen
            ? "m-4 font-bold text-primary"
            : "font-medium text-primary"
        }
      >
        {label}
      </div>
    </div>
  );
};

export default Loader;
