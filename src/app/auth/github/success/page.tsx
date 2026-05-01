"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToast } from "@heroui/toast";
import webStorageClient from "@/utils/webStorageClient";
import { loginFromToken } from "@/store/slices/auth";
import { BASE_URLS } from "@/constants";
import { authEndpoint } from "@/constants/endpoints";

export default function GithubSuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("t");

    if (!token) {
      router.replace("/login?error=github_failed");
      return;
    }

    const exchange = async () => {
      try {
        const res = await fetch(
          `${BASE_URLS}${authEndpoint.GITHUB_SESSION}?t=${encodeURIComponent(token)}`
        );

        if (!res.ok) {
          router.replace("/login?error=github_session");
          return;
        }

        const json = await res.json();
        const data = json?.data;

        if (!data?.accessToken) {
          router.replace("/login?error=github_session");
          return;
        }

        webStorageClient.setToken(data.accessToken);
        webStorageClient.setRefreshToken(data.refreshToken);
        webStorageClient.setUser(data.user);
        dispatch(loginFromToken(data.user));

        addToast({
          title: "Chào mừng trở lại!",
          color: "success",
        });

        router.replace("/");
      } catch {
        router.replace("/login?error=github_failed");
      }
    };

    exchange();
  }, []);

  return null;
}
