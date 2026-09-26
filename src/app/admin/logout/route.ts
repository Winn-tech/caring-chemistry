import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ data: { signedOut: true } });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/admin" });
  return response;
}
