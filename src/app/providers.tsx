"use client";

import { HeroUIProvider } from "@heroui/react";
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
import RedirectProvider from "@/Provider/RedirectProvider";
import LanguageProvider from "@/Provider/LanguageProvider";
import GamificationProvider from "@/Provider/GamificationProvider";

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
        <GamificationProvider>
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
            >
              <LanguageProvider>
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
              </LanguageProvider>
              <ToastProvider placement="bottom-right" />
            </GoogleOAuthProvider>
          </NextThemesProvider>
        </GamificationProvider>
      </HeroUIProvider>
    </Provider>
  );
}