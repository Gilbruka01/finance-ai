// Local synthetic integration test. Pass the installed Supabase CLI path.
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const { createClient } = createRequire(
  new URL("../../apps/web/package.json", import.meta.url),
)("@supabase/supabase-js");
const settings = JSON.parse(
  execFileSync(process.argv[2] ?? "supabase", ["status", "-o", "json"], {
    stdio: ["ignore", "pipe", "ignore"],
  }),
);
const url = "http://127.0.0.1:55321";
const client = (key) =>
  createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
const admin = client(settings.SERVICE_ROLE_KEY),
  user = client(settings.ANON_KEY);
const email = randomUUID() + "@example.test",
  password = randomUUID();
function code(secret) {
  const bits = [...secret.toUpperCase().replace(/=+$/, "")]
    .map((c) =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
        .indexOf(c)
        .toString(2)
        .padStart(5, "0"),
    )
    .join("");
  const key = Buffer.from(bits.match(/.{8}/g).map((b) => parseInt(b, 2)));
  const count = Buffer.alloc(8);
  count.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const hash = createHmac("sha1", key).update(count).digest(),
    offset = hash[19] & 15;
  return String((hash.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(
    6,
    "0",
  );
}
function checked(result) {
  assert.ifError(result.error);
  return result.data;
}
const id = checked(
  await admin.auth.admin.createUser({ email, password, email_confirm: true }),
).user.id;
try {
  const login = async () =>
    checked(await user.auth.signInWithPassword({ email, password }));
  await login();
  checked(
    await user.rpc("complete_identity", {
      p_name: "Pessoa Teste",
      p_birth: "1990-01-01",
      p_terms: true,
      p_privacy: true,
    }),
  );
  async function enroll(name) {
    const f = checked(
      await user.auth.mfa.enroll({ factorType: "totp", friendlyName: name }),
    );
    checked(
      await user.auth.mfa.challengeAndVerify({
        factorId: f.id,
        code: code(f.totp.secret),
      }),
    );
    return f;
  }
  const primary = await enroll("Principal"),
    backup = await enroll("Reserva");
  checked(await user.auth.signOut());
  await login();
  assert.equal(checked(await user.rpc("identity_session_valid")), false);
  await new Promise((r) => setTimeout(r, 31000));
  checked(
    await user.auth.mfa.challengeAndVerify({
      factorId: backup.id,
      code: code(backup.totp.secret),
    }),
  );
  assert.equal(checked(await user.rpc("identity_session_valid")), true);
  checked(await user.auth.mfa.unenroll({ factorId: primary.id }));
  checked(await user.auth.mfa.unenroll({ factorId: backup.id }));
  checked(await user.auth.signOut());
  await login();
  assert.equal(checked(await user.rpc("identity_session_valid")), true);
  assert.ok(
    (
      await user.auth.linkIdentity({
        provider: "google",
        options: { skipBrowserRedirect: true },
      })
    ).error,
  );
  console.log(
    "PASS: dois fatores TOTP, bloqueio AAL1, recuperação por fator reserva, remoção e vinculação manual bloqueada.",
  );
} finally {
  checked(await admin.auth.admin.deleteUser(id));
}
