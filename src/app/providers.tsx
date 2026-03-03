"use client";

import type { ThemeProviderProps } from "next-themes";

import { HeroUIProvider } from "@heroui/react"; // Sửa từ @heroui/system
import { ToastProvider } from "@heroui/toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";
import { Provider } from "react-redux";

import AuthProvider from "@/Provider/AuthProvider";
import AutoOpenResetPassModal from "@/Provider/OpenModalResetPass";
import { store } from "@/store";
import { ModalProvider } from "../Provider/ModalProvider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}
export function Providers({ children, themeProps }:  Readonly<ProvidersProps>) {
  return (
  <Provider store={store}>
  <NextThemesProvider {...themeProps}>
     
    <HeroUIProvider>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
        <ModalProvider>
                <Suspense fallback={null}>
                <AutoOpenResetPassModal />
              </Suspense>
          <AuthProvider>
          {children}
          </AuthProvider>
        </ModalProvider>
      </GoogleOAuthProvider>
      <ToastProvider placement="bottom-right" />
    </HeroUIProvider>
  </NextThemesProvider>
</Provider>

  );
}