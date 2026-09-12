import Home from "/GNB/home.svg";
import HomeActive from "/GNB/homeActive.svg";
import Reservation from "/GNB/reservation.svg";
import ReservationActive from "/GNB/reservationActive.svg";
import ReservationList from "/GNB/reservationList.svg";
import ReservationListActive from "/GNB/reservationListActive.svg";
import { Link, useLocation } from "react-router-dom";

export const GNB = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const mobileType = navigator.userAgent.toLowerCase();
  const paddingByType = mobileType.indexOf("iphone") > -1 ? "mb-8" : "mb-2";

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
    <nav className="fixed bottom-0 z-50 w-full px-8 bg-gray-100 border border-t-gray-200">
      <div className={`wrapper flex justify-between mt-2 ${paddingByType}`}>
        {menus.map((menu) => {
          return (
            <Link className="w-12" key={menu.path} to={menu.path}>
              <div className="text-center">
                <img
                  className="inline"
                  src={currentPage === menu.path ? menu.iconActive : menu.icon}
                  alt={menu.name}
                />
                <div
                  className={
                    currentPage === menu.path
                      ? "text-sky-500 text-xs"
                      : "text-xs"
                  }
                >
                  {menu.name}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
