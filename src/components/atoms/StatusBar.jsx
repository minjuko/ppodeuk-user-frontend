import { useNavigate } from "react-router-dom";
import BackImg from "/GNB/Back.svg";
import AppTopBar from "./AppTopBar";

const StatusBar = () => {
  const navigate = useNavigate();

  return (
    <AppTopBar
      fixed
      showLogo={false}
      desktopTopClass="md:top-8"
      desktopMaxWidthClass="md:max-w-[560px]"
      desktopPaddingClass="md:px-4"
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/75 shadow-sm backdrop-blur-sm transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <img src={BackImg} alt="" className="h-5 w-5" />
      </button>
    </AppTopBar>
  );
};

export default StatusBar;
