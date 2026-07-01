import { NextResponse } from "next/server";

// Session cookie name written by /api/os-auth on successful login.
const SESSION_COOKIE = "bafar_os_session";

/**
 * Auth gate for /os routes.
 *
 * Rules:
 *  - /os/login  → always allowed (otherwise the login page itself is blocked)
 *  - /os/**     → require cookie matching OS_SESSION_TOKEN; redirect to /os/login if absent/wrong
 *  - everything else → passthrough
 *
 * OS_SESSION_TOKEN must be set as an env var (Netlify env + .env.local).
 * If it is missing we block all access to /os to prevent an open console.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only guard /os routes.
  if (!pathname.startsWith("/os")) {
    return NextResponse.next();
  }

  // /os/login is always public — it is the gate itself.
  if (pathname.startsWith("/os/login")) {
    return NextResponse.next();
  }

  const sessionToken = process.env.OS_SESSION_TOKEN;

  // If the env var is not configured, deny all access with a plain 403
  // so a misconfigured deploy fails closed rather than open.
  if (!sessionToken) {
    return new NextResponse(
      "BAFAR OS — console unavailable: OS_SESSION_TOKEN not configured.",
      { status: 403 }
    );
  }

  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;

  if (cookieValue && cookieValue === sessionToken) {
    // Valid session — allow through.
    return NextResponse.next();
  }

  // No valid session — redirect to the login page, preserving the intended
  // destination so we can redirect back after a successful login.
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/os/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Run the proxy on all /os routes. _next/static etc. are excluded
  // automatically by Next.js for paths that don't start with /os.
  matcher: ["/os/:path*"],
};
