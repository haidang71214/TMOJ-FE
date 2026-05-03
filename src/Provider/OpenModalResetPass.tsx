"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/react";
import { useDispatch } from "react-redux";

import { useModal } from "@/Provider/ModalProvider";
import ResetPassModal from "@/app/Modal/ResetPassModal";
import webStorageClient from "@/utils/webStorageClient";
import { loginFromToken } from "@/store/slices/auth";
import { BASE_URLS } from "@/constants";

export default function AutoOpenResetPassModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    const action = searchParams.get("action");
    const legacyToken = searchParams.get("setpass");

    if (legacyToken) {
      handledRef.current = true;
      openModal({ content: <ResetPassModal /> });
      return;
    }

    if (!action) return;
    handledRef.current = true;

    if (action === "reset-password") {
      const email = searchParams.get("email") ?? "";
      const token = searchParams.get("token") ?? "";
      openModal({
        content: <ResetPassModal initialEmail={email} initialToken={token} />,
      });
      router.replace("/");
      return;
    }

    if (action === "email-verified") {
      const status = searchParams.get("status");

      if (status !== "success") {
        const message = searchParams.get("message");
        addToast({
          title: message
            ? decodeURIComponent(message)
            : "Xác minh email thất bại",
          color: "danger",
        });
        router.replace("/");
        return;
      }

      (async () => {
        try {
          const res = await fetch(
            `${BASE_URLS}api/v1/Auth/refresh-token`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: "{}",
            }
          );

          if (!res.ok) throw new Error("refresh failed");

          const json = await res.json();
          const data = json?.data ?? json;
          const accessToken = data?.accessToken;
          const refreshToken = data?.refreshToken;
          const user = data?.user;

          if (accessToken) webStorageClient.setToken(accessToken);
          if (refreshToken) webStorageClient.setRefreshToken(refreshToken);
          if (user) {
            webStorageClient.setUser(user);
            dispatch(loginFromToken(user));
          }

          addToast({
            title: "Xác minh email & đăng nhập thành công",
            color: "success",
          });
        } catch {
          addToast({
            title:
              "Xác minh email thành công, vui lòng đăng nhập lại",
            color: "warning",
          });
        } finally {
          router.replace("/");
        }
      })();
    }
  }, [searchParams, openModal, router, dispatch]);

  return null;
}
