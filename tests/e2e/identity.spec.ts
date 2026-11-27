import { expect, test } from "@playwright/test";

test("cadastro distingue os dois aceites e oferece recuperação", async ({
  page,
}) => {
  await page.goto("/conta");
  await page.getByText("Criar conta", { exact: true }).click();
  await expect(page.getByLabel("Data de nascimento")).toBeVisible();
  await expect(page.getByRole("checkbox")).toHaveCount(2);
  await page.getByText("Recuperar senha", { exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Enviar instruções" }),
  ).toBeVisible();
});
