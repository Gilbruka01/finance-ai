import { FactorForm } from "../factor-form";
import { redirect } from "next/navigation";
import { authClient } from "../../../lib/auth";
import {
  logout,
  complete,
  verify,
  removeFactor,
  changePassword,
} from "../actions";
import { ProfileFields } from "../profile-fields";
export const dynamic = "force-dynamic";
export default async function Area() {
  const c = await authClient();
  const {
    data: { user },
  } = await c.auth.getUser();
  if (!user?.email_confirmed_at) redirect("/conta");
  const { data: factors, error } = await c.auth.mfa.listFactors();
  if (error) redirect("/conta?aviso=falha");
  const { data: level } = await c.auth.mfa.getAuthenticatorAssuranceLevel();
  const factor = factors.totp.find((f) => f.status === "verified");
  const { data: profile } = await c
    .from("profiles")
    .select("full_name")
    .maybeSingle();
  return (
    <main className="mx-auto grid max-w-lg gap-6 p-6">
      <h1>Minha conta</h1>
      {factor && level?.currentLevel !== "aal2" ? (
        <form action={verify}>
          <label>
            Autenticador
            <select name="fator">
              {factors.totp
                .filter((f) => f.status === "verified")
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.friendly_name ?? "Autenticador"}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Código do autenticador
            <input name="codigo" autoComplete="one-time-code" required />
          </label>
          <button>Verificar</button>
        </form>
      ) : profile ? (
        <p>Cadastro confirmado: {profile.full_name}</p>
      ) : (
        <form action={complete}>
          <h2>Concluir cadastro</h2>
          <ProfileFields />
          <button>Confirmar cadastro e aceites</button>
        </form>
      )}
      {profile && (
        <>
          <FactorForm />
          {factors.totp
            .filter((f) => f.status === "verified")
            .map((f) => (
              <form action={removeFactor} key={f.id}>
                <input type="hidden" name="fator" value={f.id} />
                <button>Desativar {f.friendly_name ?? "autenticador"}</button>
              </form>
            ))}
        </>
      )}
      <form action={changePassword}>
        <h2>Alterar senha</h2>
        <p>Confirme sua identidade com um acesso recente.</p>
        <label>
          Nova senha
          <input
            type="password"
            autoComplete="new-password"
            name="senha"
            required
          />
        </label>
        <label>
          Confirme a nova senha
          <input
            type="password"
            autoComplete="new-password"
            name="confirmacao"
            required
          />
        </label>
        <button>Alterar senha</button>
      </form>
      <form action={logout}>
        <button>Sair de todas as sessões</button>
      </form>
    </main>
  );
}
