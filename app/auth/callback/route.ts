import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for the email-confirmation link (and any other OAuth/PKCE
 * redirect). Exchanges the one-time code for a session cookie, then forwards
 * the user on to their portal.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portal";
  // Only allow relative redirects, never an absolute URL supplied by a caller.
  const redirectTo = next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/portal";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
