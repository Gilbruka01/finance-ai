"use client";
import { useState } from "react";
import { enrollFactor, verify } from "./actions";
export function FactorForm() {
  const [factor, setFactor] = useState<{ id: string; secret: string } | null>(
    null,
  );
  const [error, setError] = useState(false);
  return (
    <section>
      <h2>Autenticador TOTP</h2>
      <p>
        Cadastre um segundo autenticador em outro dispositivo. Se perder o
        principal, selecione o reserva ao entrar. Guarde os dispositivos em
        locais separados.
      </p>
      <button
        onClick={async () => {
          const result = await enrollFactor();
          setFactor(result);
          setError(!result);
        }}
      >
        Adicionar autenticador
      </button>
      {error && <p role="alert">Entre novamente e tente outra vez.</p>}
      {factor && (
        <form action={verify}>
          <p>
            Adicione esta chave ao seu aplicativo autenticador:{" "}
            <code>{factor.secret}</code>
          </p>
          <input type="hidden" name="fator" value={factor.id} />
          <label>
            Código de verificação
            <input name="codigo" autoComplete="one-time-code" required />
          </label>
          <button>Confirmar autenticador</button>
        </form>
      )}
    </section>
  );
}
