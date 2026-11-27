import { signup, login, recover, google } from "./actions";
import { ProfileFields } from "./profile-fields";
const notices: Record<string, string> = {
  email: "Se aplicável, enviaremos instruções por e-mail.",
  login: "Não foi possível entrar com esses dados.",
  dados: "Confira os dados, a idade mínima de 18 anos e os aceites.",
  falha: "Não foi possível concluir a operação.",
};
export default async function Account({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const { aviso } = await searchParams;
  return (
    <main className="mx-auto grid max-w-lg gap-6 p-6 [&_input:not([type=checkbox])]:block [&_input]:border [&_button]:underline">
      <h1>Conta FINANCE AI</h1>
      {aviso && <p role="status">{notices[aviso]}</p>}
      <form action={login}>
        <h2>Entrar</h2>
        <label>
          E-mail
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label>
          Senha
          <input
            type="password"
            name="senha"
            autoComplete="current-password"
            required
          />
        </label>
        <button>Entrar</button>
      </form>
      <form action={google}>
        <button>Continuar com Google</button>
      </form>
      <details>
        <summary>Criar conta</summary>
        <form action={signup}>
          <ProfileFields />
          <label>
            E-mail
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label>
            Senha (mínimo de 12 caracteres, máximo de 72 bytes)
            <input
              type="password"
              name="senha"
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            Confirmar senha
            <input
              type="password"
              name="confirmacao"
              autoComplete="new-password"
              required
            />
          </label>
          <button>Cadastrar</button>
        </form>
      </details>
      <details>
        <summary>Recuperar senha</summary>
        <form action={recover}>
          <label>
            E-mail
            <input type="email" name="email" required />
          </label>
          <button>Enviar instruções</button>
        </form>
      </details>
    </main>
  );
}
