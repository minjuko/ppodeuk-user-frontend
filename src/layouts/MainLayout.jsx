import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GNB } from "../components/atoms/GNB";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUserInfoThunk } from "../store/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isReservationPage = location.pathname === "/reservation";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getUserInfoThunk())
        .then(unwrapResult)
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [dispatch, navigate]);

  return (
    <>
      <main
        className={
          isReservationPage
            ? "reservation-page-root"
            : "app-page-shell mx-auto w-full max-w-md p-4 pb-24 md:min-h-screen md:max-w-[560px] md:border-x md:border-slate-200 md:bg-white md:px-4 md:pb-24 md:pt-4 md:shadow-sm"
        }
      >
        <Outlet />
      </main>
      <GNB />
    </>
  );
};
