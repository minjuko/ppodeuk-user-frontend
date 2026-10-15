import { Outlet, useNavigate } from "react-router-dom";
import { GNB } from "../components/atoms/GNB";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUserInfoThunk } from "../store/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";

export const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      <main className="w-full max-w-md p-4 mx-auto mb-20">
        <Outlet />
      </main>
      <GNB />
    </>
  );
};
