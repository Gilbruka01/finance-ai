import { expect, test } from "vitest";
import { metadata } from "../../apps/web/app/metadata";
test("identifica a aplicação", () => {
  expect(metadata.title).toBe("FINANCE AI");
});
