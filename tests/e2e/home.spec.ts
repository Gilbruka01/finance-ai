import { expect, test } from "@playwright/test";
test("exibe a página inicial em português", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "FINANCE AI" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
});
