"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setTokenFromStorage,
  setUserFromStorage,
  setUserFromStorageStart,
} from "@/store/features/auth/authSlice";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserFromStorageStart());

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      dispatch(setTokenFromStorage(token));
    } else {
      dispatch(setTokenFromStorage(null));
    }

    if (user) {
      dispatch(setUserFromStorage(JSON.parse(user)));
    } else {
      dispatch(setUserFromStorage(null));
    }
  }, [dispatch]);

  return null;
}
