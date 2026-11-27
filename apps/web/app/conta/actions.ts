"use server";
import { recentAuth } from "../../lib/recent-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authClient, callbackUrl } from "../../lib/auth";

const value = (f: FormData, k: string) => String(f.get(k) ?? "");
const email = (f: FormData) => z.email().safeParse(value(f, "email").trim());
const pw = (s: string) =>
  Array.from(s).length >= 12 &&
  Array.from(s).length <= 128 &&
  Buffer.byteLength(s, "utf8") <= 72;
function msg(code: string): never {
  redirect("/conta?aviso=" + code);
}
export async function signup(f: FormData) {
  const e = email(f),
    p = value(f, "senha"),
    dob = value(f, "nascimento"),
    name = value(f, "nome").trim();
  const date = new Date(dob + "T00:00:00Z"),
    now = new Date();
  if (
    !e.success ||
    !pw(p) ||
    p !== value(f, "confirmacao") ||
    !name ||
    !Number.isFinite(+date) ||
    date.toISOString().slice(0, 10) !== dob ||
    !f.has("termos") ||
    !f.has("privacidade")
  )
    msg("dados");
  const years =
    now.getUTCFullYear() -
    date.getUTCFullYear() -
    (now.toISOString().slice(5, 10) < dob.slice(5) ? 1 : 0);
  if (years < 18) msg("dados");
  const client = await authClient();
  await client.auth.signUp({
    email: e.data,
    password: p,
    options: { emailRedirectTo: callbackUrl() },
  });
  // Profile and legal events are collected after proof of account ownership.
  msg("email");
}
export async function login(f: FormData) {
  const e = email(f);
  if (!e.success) msg("login");
  const c = await authClient();
  const { error } = await c.auth.signInWithPassword({
    email: e.data,
    password: value(f, "senha"),
  });
  if (error) msg("login");
  redirect("/conta/area");
}
export async function logout() {
  const c = await authClient();
  const { error } = await c.auth.signOut({ scope: "global" });
  if (error) msg("falha");
  redirect("/conta");
}
export async function recover(f: FormData) {
  const e = email(f);
  if (e.success) {
    const c = await authClient();
    await c.auth.resetPasswordForEmail(e.data, { redirectTo: callbackUrl() });
  }
  msg("email");
}
export async function google() {
  const c = await authClient();
  const { data, error } = await c.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl(),
      queryParams: { prompt: "select_account" },
    },
  });
  if (error || !data.url) msg("falha");
  redirect(data.url);
}
export async function complete(f: FormData) {
  const c = await authClient();
  const { error } = await c.rpc("complete_identity", {
    p_name: value(f, "nome"),
    p_birth: value(f, "nascimento"),
    p_terms: f.has("termos"),
    p_privacy: f.has("privacidade"),
  });
  if (error) msg("dados");
  redirect("/conta/area");
}
export async function verify(f: FormData) {
  const c = await authClient();
  const { error } = await c.auth.mfa.challengeAndVerify({
    factorId: value(f, "fator"),
    code: value(f, "codigo"),
  });
  if (error) msg("falha");
  redirect("/conta/area");
}

export async function changePassword(f: FormData) {
  const c = await authClient();
  const {
    data: { user },
  } = await c.auth.getUser();
  if (!user) msg("login");
  const { data: valid } = await c.rpc("identity_session_valid");
  if (!valid) msg("falha");
  const { data: claims } = await c.auth.getClaims();
  const factors = await c.auth.mfa.listFactors();
  if (factors.error) msg("falha");
  const methods = factors.data.totp.some((f) => f.status === "verified")
    ? ["totp", "mfa/totp"]
    : ["password", "recovery", "otp"];
  const recent = recentAuth(claims?.claims.amr, methods);
  const p = value(f, "senha");
  if (!recent || !pw(p) || p !== value(f, "confirmacao")) msg("dados");
  const { error } = await c.auth.updateUser({ password: p });
  if (error) msg("falha");
  await logout();
}

export async function enrollFactor(): Promise<{
  id: string;
  secret: string;
} | null> {
  const c = await authClient();
  const { data: profile } = await c.from("profiles").select("id").maybeSingle();
  const { data } = await c.auth.getClaims();
  const factors = await c.auth.mfa.listFactors();
  if (
    !profile ||
    factors.error ||
    !recentAuth(
      data?.claims.amr,
      factors.data.totp.some((f) => f.status === "verified")
        ? ["totp", "mfa/totp"]
        : ["password"],
    )
  )
    return null;
  const result = await c.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Autenticador " + Date.now(),
  });
  if (result.error) return null;
  return { id: result.data.id, secret: result.data.totp.secret };
}

export async function removeFactor(form: FormData) {
  const c = await authClient();
  const { data: valid } = await c.rpc("identity_session_valid");
  const { data } = await c.auth.getClaims();
  if (
    !valid ||
    data?.claims.aal !== "aal2" ||
    !recentAuth(data.claims.amr, ["totp", "mfa/totp"])
  )
    msg("falha");
  const result = await c.auth.mfa.unenroll({ factorId: value(form, "fator") });
  if (result.error) msg("falha");
  await logout();
}
