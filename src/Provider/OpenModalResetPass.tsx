"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/react";
import { useDispatch } from "react-redux";

import { useModal } from "@/Provider/ModalProvider";
import ResetPassModal from "@/app/Modal/ResetPassModal";
import {
  useConfirmEmailMutation,
  useConfirmPasswordChangeMutation,
} from "@/store/queries/auth";
import { clearLoginToken } from "@/store/slices/auth";
import LoginModal from "@/app/Modal/LoginModal";

export default function AutoOpenResetPassModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const handledRef = useRef(false);
  const [confirmEmail] = useConfirmEmailMutation();
  const [confirmPasswordChange] = useConfirmPasswordChangeMutation();

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
          await confirmEmail({ email, token }).unwrap();
          // authSlice.extraReducers (confirmEmail.matchFulfilled) đã tự
          // lưu token + user + set authenticated state.
          addToast({
            title: "Xác minh email & đăng nhập thành công",
            color: "success",
          });
        } catch (e: any) {
          addToast({
            title:
              e?.data?.message ||
              e?.message ||
              "Xác minh email thất bại. Liên kết có thể đã hết hạn.",
            color: "danger",
          });
        } finally {
          router.replace("/");
        }
      })();
    }

    if (action === "confirm-password-change") {
      const email = searchParams.get("email") ?? "";
      const token = searchParams.get("token") ?? "";

      if (!email || !token) {
        addToast({
          title: "Liên kết xác minh đổi mật khẩu không hợp lệ",
          color: "danger",
        });
        router.replace("/");
        return;
      }

      (async () => {
        try {
          await confirmPasswordChange({ email, token }).unwrap();
          // Logout phía client
          dispatch(clearLoginToken());
          addToast({
            title: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
            color: "success",
          });
          router.replace("/");
          openModal({ content: <LoginModal /> });
        } catch (e: any) {
          addToast({
            title:
              e?.data?.message ||
              e?.message ||
              "Xác minh đổi mật khẩu thất bại. Liên kết có thể đã hết hạn.",
            color: "danger",
          });
          router.replace("/");
        }
      })();
    }
  }, [searchParams, openModal, router, confirmEmail, confirmPasswordChange, dispatch]);

  return null;
}
