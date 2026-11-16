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
  const upcoming = page.getByRole("article").filter({ hasText: "Discover the Animal Kingdom!" });
  await expect(upcoming.getByText("Próximamente")).toBeVisible();
  await expect(upcoming.getByRole("link")).toHaveCount(0);
  await upcoming.click();
  await expect(page).toHaveURL(`${base}/scienceworld/`);
  await page.goto(`${base}/unit/science-2-b2-s01/`);
  await expect(page.getByText("Vocabulario", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Misión: partes del cuerpo" }).click();
  await expect(page).toHaveURL(`${base}/scienceworld/body/`);
});

test("Healthy Habits opens from Science World and runs the shared practice games", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/scienceworld/`);
  await page.getByRole("article").filter({ hasText: "Healthy Habits, Happy Life!" }).getByRole("link").click();
  await expect(page).toHaveURL(`${base}/unit/science-2-b2-s02/`);
  const menu = page.getByRole("region", { name: "Juegos de ciencias" });
  await expect(menu).toHaveCount(0);
  await page.getByRole("link", { name: /La salud y el cuerpo/ }).click();
  await expect(page).toHaveURL(`${base}/unit/science-2-b2-s02/subsection/health-and-the-body/`);
  const games = [
    "Picture Match", "Mystery Word", "Build a Phrase", "See It, Hear It, Spell It", "Letter Scramble", "Word Hunt",
  ];
  await expect(menu.getByRole("button")).toHaveCount(games.length);
  await expect(menu.getByRole("button").locator("strong")).toHaveText(games);
  for (const name of games) {
    await menu.getByRole("button", { name }).click();
    await expect(page.getByRole("heading", { name, exact: true })).toBeFocused();
  }
  await expect(page.getByRole("button", { name: "Word Hunt" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("group", { name: "Cuadrícula de letras" })).toBeVisible();
  await menu.getByRole("button", { name: "Picture Match" }).click();
  const healthMatch = page.getByRole("region", { name: "Picture Match" });
  await expect(healthMatch.getByText("Ronda 1 de 3")).toBeVisible();
  await expect(healthMatch.locator("img")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "test-results/healthy-habits-mobile.png", fullPage: true });
  await page.getByRole("link", { name: "Volver a las subsecciones" }).click();
  await expect(page).toHaveURL(`${base}/unit/science-2-b2-s02/`);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${base}/scienceworld/healthy-habits/`);
  await page.getByRole("link", { name: /La salud y el cuerpo/ }).click();
  await expect(menu.getByRole("button")).toHaveCount(games.length);
  await menu.getByRole("button", { name: "Build a Phrase" }).click();
  await page.screenshot({ path: "test-results/healthy-habits-desktop.png", fullPage: true });
});

for (const unit of [
  { slug: "sports", last: "Play, Go, Do, Wear?", imageMatch: true },
  { slug: "seasons", last: "Weather, Season or Activity?", imageMatch: false },
]) {
  test(`${unit.slug} legacy link opens eligible games`, async ({ page }) => {
    await page.goto(`${base}/englishworld/${unit.slug}/`);
    const menu = page.getByRole("region", { name: "Juegos de inglés" });
    await expect(menu.getByRole("button")).toHaveCount(unit.imageMatch ? 8 : 7);
    for (const name of [
      ...(unit.imageMatch ? ["Picture Match"] : []), "Mystery Word", "Build a Phrase", "See It, Hear It, Spell It",
      "Letter Scramble", "Word Hunt", "Look & Find", unit.last,
    ]) {
      await menu.getByRole("button", { name: name, exact: false }).click();
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
  });
}

for (const section of [
  { world: "englishworld", id: "english-2-b1-s00", title: "Let's Learn the Basics!", topic: "Colors", spanish: "Colores", slug: "colors", count: 6 },
  { world: "scienceworld", id: "science-2-b2-s02", title: "Healthy Habits, Happy Life!", topic: "Food and drinks", spanish: "Alimentos y bebidas", slug: "food-and-drinks", count: 9 },
]) {
  test(`${section.world} opens subsections and their game pages`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/${section.world}/`);
    await page.getByRole("article").filter({ hasText: section.title }).getByRole("link").click();
    const unitUrl = `${base}/unit/${section.id}/`;
    await expect(page).toHaveURL(unitUrl);
    const topics = page.getByRole("region", { name: "Subsecciones" });
    await expect(topics.getByRole("link")).toHaveCount(section.count);
    await expect(topics.locator("img")).toHaveCount(0);
    await topics.getByRole("link", { name: `${section.topic} ${section.spanish}` }).click();
    await expect(page).toHaveURL(`${unitUrl}subsection/${section.slug}/`);
    expect((await page.reload())?.ok()).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(section.topic);
    await expect(page.getByText(section.spanish, { exact: true })).toBeVisible();
    await expect(topics).toHaveCount(0);
    const breadcrumb = page.getByRole("navigation", { name: "Ruta de navegación" });
    await expect(breadcrumb.getByRole("link", { name: section.title })).toBeVisible();
    await expect(breadcrumb.locator('[aria-current="page"]')).toContainText(section.topic);
    if (section.world === "scienceworld") {
      const menu = page.getByRole("region", { name: "Juegos de ciencias" });
      await expect(menu.getByRole("button")).toHaveCount(6);
      await menu.getByRole("button", { name: "Picture Match" }).click();
      const match = page.getByRole("region", { name: "Picture Match" });
      await expect(match.locator("img")).toBeVisible();
      await expect(match.getByText("Ronda 1 de 23")).toBeVisible();
    } else {
      await expect(page.getByText("¡Las actividades estarán disponibles pronto!")).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await breadcrumb.getByRole("link", { name: section.title }).click();
    await expect(page).toHaveURL(unitUrl);
  });
}
