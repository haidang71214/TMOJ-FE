import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const isAdminSubdomain = host.startsWith("admin.");

  const { pathname } = req.nextUrl;

  const token = req.cookies.get("__access_token")?.value;

  // ======================
  // ADMIN SUBDOMAIN
  // ======================
  if (isAdminSubdomain) {

    // ❌ Không có token → về trang login (KHÔNG full URL)
    if (!token) {
      if (pathname !== "/") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    try {
      const base64 = token.split(".")[1];
      const payload = JSON.parse(atob(base64));

      // ⚠️ role là mảng
      const roles: string[] = payload.role || [];

      if (!roles.includes("admin")) {
        return NextResponse.redirect(new URL("/", req.url));
      }

    } catch {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // rewrite về /admin nếu chưa có prefix
    if (!pathname.startsWith("/admin")) {
      return NextResponse.rewrite(
        new URL(`/admin${pathname}`, req.url)
      );
    }
  }

  // ======================
  // USER DOMAIN cố vào /admin
  // ======================
  if (!isAdminSubdomain && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};