import { useNavigate } from "react-router-dom";
import BackImg from "/GNB/Back.svg";

const StatusBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 z-50 w-full p-3 h-14 pointer-events-none">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md pointer-events-auto bg-opacity-95"
      >
        <img src={BackImg} alt="" className="w-6 h-6" />
      </button>
    </nav>
  );
};

export default StatusBar;
