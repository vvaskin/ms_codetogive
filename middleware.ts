import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// middleware exists to refresh the auth cookie on every request — server components can't set cookies themselves
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every request except static assets and image files, so the auth
     * cookie is refreshed for all real page/route requests.
     */
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
