import { NextRequest, NextResponse } from "next/server";

/**
 * Subdomain middleware for agent.drip.surf
 *
 * Detects requests to the agent subdomain and rewrites them
 * from /path to /agent/path so a single Next.js codebase serves
 * both the landing site (drip.surf) and the agent app (agent.drip.surf).
 *
 * Local dev: use agent.localhost:3000 (add to /etc/hosts or use HOST header).
 */

const AGENT_HOSTS = ["agent.drip.surf", "agent.localhost:3000"];

/** Extensions that should never be rewritten (static assets) */
const STATIC_EXT =
  /\.(ico|png|jpg|jpeg|gif|svg|webp|avif|css|js|woff|woff2|ttf|eot|map|webmanifest)$/;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // Only act on agent subdomain requests
  if (!AGENT_HOSTS.some((h) => host.startsWith(h))) {
    return NextResponse.next();
  }

  // Skip paths that should not be rewritten
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    STATIC_EXT.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Already on /agent/* — don't double-rewrite
  if (pathname.startsWith("/agent")) {
    return NextResponse.next();
  }

  // Rewrite /path → /agent/path
  const url = request.nextUrl.clone();
  url.pathname = `/agent${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
