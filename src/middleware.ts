import { NextRequest, NextResponse } from "next/server";
import webStorageClient from "./utils/webStorageClient";
import { Users } from "./types";

export function middleware(req: NextRequest) {


  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};