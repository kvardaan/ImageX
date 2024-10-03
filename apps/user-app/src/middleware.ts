import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES, AUTH_ROUTES, API_AUTH_PREFIX } from "@/lib/routes";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const session = await getToken({ req, secret: process.env.AUTH_SECRET })
  const isLoggedIn = !!session?.email

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;

  if (isAuthRoute)
    return isLoggedIn
      ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      : null;

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return null;
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ],
};