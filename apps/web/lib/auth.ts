import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function authClient() {
  const jar = await cookies();
  const url = process.env.SUPABASE_URL ?? "http://127.0.0.1:55321";
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error("Configure a chave pública local do Supabase.");
  return createServerClient(url, key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.APP_ORIGIN?.startsWith("https://") ?? false,
    },
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        for (const { name, value, options } of values) {
          try {
            jar.set(name, value, options);
          } catch (error) {
            if (!(
              error instanceof Error &&
              error.message.includes("Cookies can only be modified")
            ))
              throw error;
          }
        }
      },
    },
  });
}
export function callbackUrl() {
  return new URL(
    "/conta/retorno",
    process.env.APP_ORIGIN ?? "http://127.0.0.1:3000",
  ).href;
}
