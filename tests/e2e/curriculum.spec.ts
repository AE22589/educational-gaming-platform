import { expect, test } from "@playwright/test";

const base = process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";

test("English and Science catalogs use their own book and export unit links", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${base}/`);
  const choices = page.getByRole("region", { name: "¡Elige tu curso para empezar tu aventura!" });
  await expect(choices.getByRole("button")).toHaveCount(6);
  await expect(choices.locator("button:disabled")).toHaveCount(5);
  await expect(page.locator(".home-activities")).toBeHidden();
  await choices.getByRole("button", { name: /Primaria 2/ }).click();
  await expect(page.locator(".home-activities")).toBeVisible();
  await expect(choices).toBeHidden();
  const nav = page.getByRole("navigation", { name: "Navegación principal" });
  await expect(nav.getByText("Primaria 2")).toBeVisible();
  await page.reload();
  await expect(choices).toBeHidden();
  await expect(nav.getByText("Primaria 2")).toBeVisible();
  await page.getByRole("link", { name: "English World: Explorar" }).click();
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page).toHaveURL(`${base}/`);
  await page.getByRole("link", { name: "English World: Explorar" }).click();
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(nav.getByText("Primaria 2")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(10);
  await page.screenshot({ path: "test-results/curriculum-desktop.png" });
  await page.getByRole("article").filter({ hasText: "Let's Play Sports!" }).getByRole("link").click();
  await expect(page).toHaveURL(`${base}/unit/english-2-b1-s01/`);
  expect((await page.reload())?.ok()).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let's Play Sports!");

  await page.goto(`${base}/scienceworld/`);
  const rows = await page.getByRole("article").evaluateAll((cards) =>
    cards.map((card) => card.getBoundingClientRect().top));
  expect(rows).toEqual([rows[0], rows[0], rows[0], rows[3], rows[3], rows[3]]);
  expect(rows[3]).toBeGreaterThan(rows[0]!);
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page).toHaveURL(`${base}/`);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/scienceworld/`);
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(page.getByRole("article")).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "test-results/curriculum-mobile.png" });
  const upcoming = page.getByRole("article").filter({ hasText: "Healthy Habits, Happy Life!" });
  await expect(upcoming.getByText("Próximamente")).toBeVisible();
  await expect(upcoming.getByRole("link")).toHaveCount(0);
  await upcoming.click();
  await expect(page).toHaveURL(`${base}/scienceworld/`);
  await page.goto(`${base}/unit/science-2-b2-s01/`);
  await expect(page.getByText("Vocabulario", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Misión: partes del cuerpo" }).click();
  await expect(page).toHaveURL(`${base}/scienceworld/body/`);
});

for (const unit of [
  { slug: "sports", last: "Play, Go, Do, Wear?" },
  { slug: "seasons", last: "Weather, Season or Activity?" },
]) {
  test(`${unit.slug} legacy link opens all eight games`, async ({ page }) => {
    await page.goto(`${base}/englishworld/${unit.slug}/`);
    const menu = page.getByRole("region", { name: "Juegos de inglés" });
    await expect(menu.getByRole("button")).toHaveCount(8);
    for (const name of [
      "Picture Match", "Mystery Word", "Build a Phrase", "See It, Hear It, Spell It",
      "Letter Scramble", "Word Hunt", "Look & Find", unit.last,
    ]) {
      await menu.getByRole("button", { name: name, exact: false }).click();
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
  });
}
