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

    if (action === "confirm-email") {
      const email = searchParams.get("email") ?? "";
      const token = searchParams.get("token") ?? "";
      const url = `${BASE_URLS}api/v1/Auth/confirm-email`;
      console.log("[confirm-email] handler triggered", { email, tokenLen: token.length, url });

      if (!email || !token) {
        addToast({
          title: "Liên kết xác minh không hợp lệ",
          color: "danger",
        });
        router.replace("/");
        return;
      }

      (async () => {
        try {
          const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token }),
          });

          console.log("[confirm-email] response", res.status, res.statusText);

          if (!res.ok) {
            const errJson = await res.json().catch(() => null);
            console.error("[confirm-email] error body", errJson);
            throw new Error(errJson?.message ?? `Verify failed (${res.status})`);
          }

          const json = await res.json();
          console.log("[confirm-email] success body", json);
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
        } catch (e) {
          console.error("[confirm-email] exception", e);
          addToast({
            title:
              (e as Error)?.message ||
              "Xác minh email thất bại. Liên kết có thể đã hết hạn.",
            color: "danger",
          });
        } finally {
          router.replace("/");
        }
      })();
    }
  }, [searchParams, openModal, router, dispatch]);

  return null;
}
