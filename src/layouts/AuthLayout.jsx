import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getUserInfoThunk } from "../store/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Loader from "../components/atoms/Loader";
import AppTopBar from "../components/atoms/AppTopBar";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isHistoryPage = location.pathname === "/history";
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const from = `${location.pathname}${location.search}${location.hash}`;

    if (!localStorage.getItem("token")) {
      navigate("/login", {
        replace: true,
        state: { authRequired: true, from },
      });
      return;
    }

    dispatch(getUserInfoThunk())
      .then(unwrapResult)
      .then(() => setIsCheckingAuth(false))
      .catch((error) => {
        const isUnauthorized =
          error?.status === 401 || error?.response?.status === 401;
        if (isUnauthorized) localStorage.removeItem("token");
        navigate("/login", {
          replace: true,
          state: {
            authRequired: true,
            authExpired: isUnauthorized,
            authCheckFailed: !isUnauthorized,
            from,
          },
        });
      });
  }, [dispatch, location.hash, location.pathname, location.search, navigate]);

  if (isCheckingAuth) return <Loader />;

  if (isHistoryPage) return <Outlet />;

  return (
    <>
      <AppTopBar fixed />
      <main className="app-page-shell mx-auto w-full max-w-md p-4 pb-24 md:min-h-screen md:max-w-[560px] md:border-x md:border-slate-200 md:bg-white md:px-4 md:pb-28 md:pt-24 md:shadow-sm">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
