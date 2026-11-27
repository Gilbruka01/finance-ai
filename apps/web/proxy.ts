import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!key) return NextResponse.next();
  let response = NextResponse.next({ request });
  const client = createServerClient(
    process.env.SUPABASE_URL ?? "http://127.0.0.1:55321",
    key,
    {
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.APP_ORIGIN?.startsWith("https://") ?? false,
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          for (const v of values) request.cookies.set(v.name, v.value);
          response = NextResponse.next({ request });
          for (const v of values)
            response.cookies.set(v.name, v.value, v.options);
        },
      },
    },
  );
  await client.auth.getUser();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/conta/:path*"] };
