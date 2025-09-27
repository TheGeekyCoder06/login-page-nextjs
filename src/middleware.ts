import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Publicly accessible routes
  const isPublicPath =
    path === "/login" || path === "/signup" || path === "/verifyemail";

  // Get JWT token from cookies
  const token = request.cookies.get("token")?.value;

  // If user is logged in and tries to visit login/signup → send them to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // If user is not logged in and tries to visit a protected route → send them to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Otherwise continue as normal
  return NextResponse.next();
}

// ✅ Only protect frontend routes that need auth
export const config = {
  matcher: [
    "/profile/:path*", // protect profile pages
    "/logout",         // protect logout page
    "/",               // protect home page
    // ❌ DO NOT put /login or /signup here, they are public
  ],
};
