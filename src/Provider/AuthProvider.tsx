"use client";

import { ReactNode, useEffect } from "react";
import { loginFromToken, setHydrated } from "@/store/slices/auth";
import { useAppDispatch } from "@/utils/redux";
import webStorageClient from "@/utils/webStorageClient";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = webStorageClient.getToken();
    const user = webStorageClient.getUser();

    if (token && user) {
      dispatch(loginFromToken(user));
    }
    dispatch(setHydrated(true)); 
  }, [dispatch]);

  return <>{children}</>;
}
