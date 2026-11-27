import { expect, test } from "vitest";
import { recentAuth } from "../../apps/web/lib/recent-auth";
test("reautenticação expira em cinco minutos sem renovar pela emissão do JWT", () => {
  const now = 1000000;
  const valid = (method: string, timestamp: number) =>
    recentAuth([{ method, timestamp }], ["totp"], now);
  expect(valid("totp", 701)).toBe(true);
  expect(valid("totp", 700)).toBe(false);
  expect(valid("totp", 1001)).toBe(false);
  expect(valid("token_refresh", 999)).toBe(false);
});
