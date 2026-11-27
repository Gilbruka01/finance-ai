export function ProfileFields() {
  return (
    <fieldset className="grid gap-3">
      <label>
        Nome completo{" "}
        <input name="nome" autoComplete="name" maxLength={200} required />
      </label>
      <label>
        Data de nascimento{" "}
        <input type="date" name="nascimento" autoComplete="bday" required />
      </label>
      <label>
        <input type="checkbox" name="termos" required /> Aceito os termos de uso
        de teste.
      </label>
      <label>
        <input type="checkbox" name="privacidade" required /> Estou ciente da
        política de privacidade de teste.
      </label>
    </fieldset>
  );
}
