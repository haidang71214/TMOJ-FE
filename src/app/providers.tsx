"use client";

import { HeroUIProvider } from "@heroui/react"; // Sửa từ @heroui/system
import { ToastProvider } from "@heroui/toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";
import { Provider } from "react-redux";

import AuthProvider from "@/Provider/AuthProvider";
import AutoOpenResetPassModal from "@/Provider/OpenModalResetPass";
import { store } from "@/store";
import { ModalProvider } from "../Provider/ModalProvider";
import RedirectProvider from "@/Provider/RedirectProvider";

export interface ProvidersProps {
  children: React.ReactNode;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}
export function Providers({ children }: Readonly<ProvidersProps>) {
  const router = useRouter();
  return (
    <Provider store={store}>
        <HeroUIProvider navigate={router.push}>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
          >
            <ModalProvider>
              <Suspense fallback={null}>
                <AutoOpenResetPassModal />

                <RedirectProvider>
                  <AuthProvider>
                    {children}
                  </AuthProvider>
                </RedirectProvider>
              </Suspense>
            </ModalProvider>

            <ToastProvider placement="bottom-right" />
          </GoogleOAuthProvider>
        </HeroUIProvider>
    </Provider>
  );
}