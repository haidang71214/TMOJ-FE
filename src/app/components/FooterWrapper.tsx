"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  console.log("Current Pathname:", pathname);
  // Kiểm tra URL để quyết định ẩn/hiện Footer
  const isProblemPage =
    pathname?.includes("/Problems/") || pathname?.includes("/Problem/");

  if (isProblemPage) return null;

  return <Footer />;
}
