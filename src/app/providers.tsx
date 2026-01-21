"use client";

import type { ThemeProviderProps } from "next-themes";

import { HeroUIProvider } from "@heroui/react"; // Sửa từ @heroui/system
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Provider } from "react-redux";
import { Suspense } from "react";

import { store } from "@/store";
import { ModalProvider } from "../Provider/ModalProvider";
import AuthProvider from "@/Provider/AuthProvider";
import AutoOpenResetPassModal from "@/Provider/OpenModalResetPass";

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
      <ModalProvider>
              <Suspense fallback={null}>
              <AutoOpenResetPassModal />
            </Suspense>
        <AuthProvider>
        {children}
        </AuthProvider>
      </ModalProvider>
      <ToastProvider placement="bottom-right" />
    </HeroUIProvider>
  </NextThemesProvider>
</Provider>

  );
}