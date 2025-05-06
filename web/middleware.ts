import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ["/login"];

  // Check if the path is public
  if (publicPaths.includes(path)) {
    // If user is already logged in, redirect to dashboard
    if (token) {
      // We don't know the role here, so redirect to a page that will check and redirect
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Otherwise, allow access to public path
    return NextResponse.next();
  }

  // For protected paths, check if user is authenticated
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  // Allow access to protected paths if authenticated
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/login", "/admin/:path*", "/employee/:path*"],
};
