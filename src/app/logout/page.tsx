"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PAGE_URL } from "@/constants";
import { addToast } from "@heroui/toast";
import { useDispatch } from "react-redux";
import { baseApi } from "@/store/base";
import { useLogoutMutation } from "@/store/queries/auth";
import webStorageClient from "@/utils/webStorageClient";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
    const [logout] = useLogoutMutation();
  useEffect(() => {
    const auto_logout = async () => {
      const host = window.location.host;
      const is_admin = host.startsWith("admin.");
      try {
        await logout().unwrap();

        dispatch(baseApi.util.resetApiState());
        webStorageClient.logout();

        addToast({ title: "Logout successful!", color: "success" });

        if (is_admin) {
          window.location.href = PAGE_URL; // về domain chính
        } else {
          router.replace("/");
        }

      } catch {
        // Dù API lỗi vẫn phải clear local state và redirect
        dispatch(baseApi.util.resetApiState());
        webStorageClient.logout();
        addToast({ title: "Logout Success", color: "success" });

        if (is_admin) {
          window.location.href = PAGE_URL;
        } else {
          router.replace("/");
        }
      }
    };

    auto_logout();
  }, [router]);

  return null;
}