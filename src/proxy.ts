import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth.js session cookie names (plain on http, __Secure- prefixed on https).
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

/**
 * Fast first gate: visitors with no session cookie are sent to /sign-in before
 * any page renders, and come back to where they were headed afterwards.
 * Cookie presence is not proof of a valid session — the (site) layout and
 * each server action still validate the session against the database.
 */
export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
  if (hasSession) return NextResponse.next();

  const url = request.nextUrl.clone();
  const target = request.nextUrl.pathname + request.nextUrl.search;
  url.pathname = "/sign-in";
  url.search = "";
  if (target !== "/") url.searchParams.set("callbackUrl", target);
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the sign-in page, Auth.js endpoints, Next internals and static files.
  matcher: ["/((?!sign-in|api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
