import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StatusBar from "../components/atoms/StatusBar";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUserInfoThunk } from "../store/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Loader from "../components/atoms/Loader";

const AuthLayoutWithStatusBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  return (
    <>
      <StatusBar />
      <main className="flow-page-shell app-page-shell mx-auto my-14 w-full max-w-md p-4 pb-24 md:my-0 md:min-h-screen md:max-w-[560px] md:border-x md:border-slate-200 md:bg-white md:px-4 md:pb-28 md:pt-20 md:shadow-sm">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayoutWithStatusBar;
