import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { randomUUID } from "node:crypto";

async function followMail(
  page: Page,
  request: APIRequestContext,
  email: string,
  kind: string,
) {
  const mailbox = "http://127.0.0.1:55324/api/v1";
  let link = "";
  await expect
    .poll(
      async () => {
        const list = await (await request.get(mailbox + "/messages")).json();
        for (const msg of list.messages.filter(
          (m: { To: { Address: string }[] }) =>
            m.To.some((x) => x.Address === email),
        )) {
          const body = await (
            await request.get(mailbox + "/message/" + msg.ID)
          ).json();
          for (const m of String(body.HTML).matchAll(/href="([^"]+)"/g)) {
            const u = new URL(m[1].replaceAll("&amp;", "&"));
            if (
              u.origin === "http://127.0.0.1:55321" &&
              u.pathname === "/auth/v1/verify" &&
              u.searchParams.get("type") === kind
            ) {
              link = u.href;
              return true;
            }
          }
        }
        return false;
      },
      { timeout: 25000 },
    )
    .toBe(true);
  await page.goto(link);
}
test("ciclo local de confirmação, login, recuperação e troca", async ({
  page,
  request,
}) => {
  test.skip(
    process.env.TEST_LOCAL_AUTH !== "1",
    "Requer Supabase local com captura de mensagens.",
  );
  test.setTimeout(100000);
  const email = randomUUID() + "@example.test",
    pass = randomUUID(),
    next = randomUUID();
  await page.goto("/conta");
  await page.getByText("Criar conta", { exact: true }).click();
  const signup = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Cadastrar" }) });
  async function profile(form: typeof signup) {
    await form.locator("[name=nome]").fill("Pessoa Sintética");
    await form.locator("[name=nascimento]").fill("1990-01-02");
    for (const c of await form.getByRole("checkbox").all()) await c.check();
  }
  await profile(signup);
  await signup.locator("[name=email]").fill(email);
  await signup.locator("[name=senha]").fill(pass);
  await signup.locator("[name=confirmacao]").fill(pass);
  await signup.getByRole("button").click();
  await expect(page.getByRole("status")).toBeVisible();
  await followMail(page, request, email, "signup");
  const complete = page
    .locator("form")
    .filter({ has: page.getByText("Confirmar cadastro e aceites") });
  await profile(complete);
  await complete.getByRole("button").click();
  await expect(
    page.getByText("Cadastro confirmado: Pessoa Sintética"),
  ).toBeVisible();
  const exit = () =>
    page.getByRole("button", { name: "Sair de todas as sessões" }).click();
  async function login(password: string) {
    const f = page.locator("form").filter({
      has: page.getByRole("button", { name: "Entrar", exact: true }),
    });
    await f.locator("[name=email]").fill(email);
    await f.locator("[name=senha]").fill(password);
    await f.getByRole("button").click();
    await expect(
      page.getByText("Cadastro confirmado: Pessoa Sintética"),
    ).toBeVisible();
  }
  await exit();
  await login(pass);
  await exit();
  await page.getByText("Recuperar senha", { exact: true }).click();
  const reset = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Enviar instruções" }) });
  await reset.locator("[name=email]").fill(email);
  await reset.getByRole("button").click();
  await followMail(page, request, email, "recovery");
  const change = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Alterar senha" }) });
  await change.locator("[name=senha]").fill(next);
  await change.locator("[name=confirmacao]").fill(next);
  await change.getByRole("button").click();
  await login(next);
});
