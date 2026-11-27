import { NextResponse } from "next/server";
import { authClient, callbackUrl } from "../../../lib/auth";
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code");
  if (code) {
    const c = await authClient();
    const { error } = await c.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(new URL("/conta/area", callbackUrl()));
  }
  return NextResponse.redirect(new URL("/conta?aviso=falha", callbackUrl()));
}
