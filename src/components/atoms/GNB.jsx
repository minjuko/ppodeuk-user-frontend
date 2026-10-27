import Home from "/GNB/home.svg";
import HomeActive from "/GNB/homeActive.svg";
import Reservation from "/GNB/reservation.svg";
import ReservationActive from "/GNB/reservationActive.svg";
import ReservationList from "/GNB/reservationList.svg";
import ReservationListActive from "/GNB/reservationListActive.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../../store/authSlice";
import { resetStore } from "../../store/action";
import BrandLogo from "./BrandLogo";

export const GNB = () => {
  const location = useLocation();
  const currentPage = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const menus = [
    { name: "홈", path: "/", icon: Home, iconActive: HomeActive },
    {
      name: "예약하기",
      path: "/reservation",
      icon: Reservation,
      iconActive: ReservationActive,
    },
    {
      name: "예약내역",
      path: "/history",
      icon: ReservationList,
      iconActive: ReservationListActive,
    },
  ];

  return (
    <>
      <nav className="mobile-bottom-nav fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border border-t-gray-200 bg-gray-100 px-8 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:max-w-[560px]">
        <div className="flex justify-between">
          {menus.map((menu) => (
            <Link className="w-12" key={menu.path} to={menu.path}>
              <div className="text-center">
                <img
                  className="inline"
                  src={currentPage === menu.path ? menu.iconActive : menu.icon}
                  alt=""
                />
                <div
                  className={
                    currentPage === menu.path
                      ? "text-xs text-sky-700"
                      : "text-xs"
                  }
                >
                  {menu.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </nav>
      <nav className="desktop-top-nav fixed inset-x-0 top-0 z-50 hidden border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-8">
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="뽀득뽀득 홈"
          >
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-2">
            {menus.map((menu) => (
              <Link
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                  currentPage === menu.path
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                key={menu.path}
                to={menu.path}
              >
                <img
                  className="h-5 w-5"
                  src={currentPage === menu.path ? menu.iconActive : menu.icon}
                  alt=""
                />
                {menu.name}
              </Link>
            ))}
            <button
              type="button"
              className="ml-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              onClick={() => {
                if (isLoggedIn) {
                  dispatch(logout());
                  dispatch(resetStore());
                  queryClient.removeQueries({ queryKey: ["recent"] });
                } else {
                  navigate("/login");
                }
              }}
            >
              {isLoggedIn ? "로그아웃" : "로그인"}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
