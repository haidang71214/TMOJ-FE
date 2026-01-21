"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/Provider/ModalProvider";
import ResetPassModal from "@/app/Modal/ResetPassModal";

export default function AutoOpenResetPassModal() {
  const searchParams = useSearchParams();
  const { openModal } = useModal();
  const openedRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get("setpass");

    if (token && !openedRef.current) {
      openedRef.current = true;

      openModal({
        content: <ResetPassModal token={token} />,
      });
    }
  }, [searchParams, openModal]);

  return null;
}
