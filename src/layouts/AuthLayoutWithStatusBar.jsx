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
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login", {
          replace: true,
          state: { authRequired: true, from },
        });
      });
  }, [dispatch, location.hash, location.pathname, location.search, navigate]);

  if (isCheckingAuth) return <Loader />;

  return (
    <>
      <StatusBar />
      <main className="my-14">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayoutWithStatusBar;
