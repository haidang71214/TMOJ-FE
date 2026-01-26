import "./globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";
import { siteConfig } from "../config/site";
import { fontSans } from "../config/fonts";
import NavbarProvider from "../Provider/NavbarProvider";
import { Footer } from "./components/Footer";
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "#",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html suppressHydrationWarning className="!pr-0" lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen  font-sans antialiased bg-gray-50 ",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <NavbarProvider />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
