import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getUserInfoThunk } from "../store/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Loader from "../components/atoms/Loader";

const AuthLayout = () => {
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

  return <Outlet />;
};

export default AuthLayout;
