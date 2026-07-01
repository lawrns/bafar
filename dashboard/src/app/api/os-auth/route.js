// Server-only API route — never runs on the client.
// POST /api/os-auth  → validate password, set session cookie, redirect to /os (or ?next=)
// DELETE /api/os-auth → clear session cookie, redirect to /os/login

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SESSION_COOKIE = "bafar_os_session";
// Cookie lives 7 days; the demo doesn't need rolling sessions.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request) {
  const formData = await request.formData();
  const password = formData.get("password")?.toString().trim() ?? "";
  const next = formData.get("next")?.toString() || "/os";

  // Sanitise the `next` redirect to stay on the same origin.
  const safeNext = next.startsWith("/") ? next : "/os";

  const expectedPassword = process.env.OS_ACCESS_PASSWORD;
  const sessionToken = process.env.OS_SESSION_TOKEN;

  if (!expectedPassword || !sessionToken) {
    // Env vars not configured — fail closed with a clear server error.
    return new NextResponse(
      "BAFAR OS — login unavailable: server not configured (OS_ACCESS_PASSWORD / OS_SESSION_TOKEN missing).",
      { status: 503 }
    );
  }

  if (password !== expectedPassword) {
    // Wrong password — redirect back to login with an error flag.
    const loginUrl = new URL("/os/login", request.url);
    loginUrl.searchParams.set("error", "1");
    if (safeNext !== "/os") {
      loginUrl.searchParams.set("next", safeNext);
    }
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // Correct password — set the session cookie and redirect into the console.
  const response = NextResponse.redirect(new URL(safeNext, request.url), {
    status: 303,
  });

  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}

export async function DELETE(request) {
  // Logout: clear the session cookie.
  const response = NextResponse.redirect(
    new URL("/os/login", request.url),
    { status: 303 }
  );
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
