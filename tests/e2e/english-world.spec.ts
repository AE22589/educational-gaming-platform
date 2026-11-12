import { expect, test } from "@playwright/test";

test("English World has four desktop cards above five and links to the unit vocabulary", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/englishworld/");
  const cards = page.locator(".english-unit-grid article");
  await expect(cards).toHaveCount(9);
  await expect(page.getByText("Let's Learn the Basics!")).toHaveCount(0);
  const rowSizes = await cards.evaluateAll((items) => {
    const rows = new Map<number, number>();
    for (const item of items) {
      const top = item.getBoundingClientRect().top;
      rows.set(top, (rows.get(top) ?? 0) + 1);
    }
    return Array.from(rows.values());
  });
  expect(rowSizes).toEqual([4, 5]);
  const bounds = await cards.evaluateAll((items) => items.map((item) => {
    const { left, right, width, height } = item.getBoundingClientRect();
    return { left, right, width, height };
  }));
  const topInset = bounds[0]!.left - bounds[4]!.left;
  const rightInset = bounds[8]!.right - bounds[3]!.right;
  expect(topInset).toBeGreaterThan(0);
  expect(topInset).toBeCloseTo(rightInset, 1);
  for (const card of bounds) {
    expect(card.width).toBeCloseTo(bounds[0]!.width, 1);
    expect(card.height).toBeCloseTo(bounds[0]!.height, 1);
  }

  await page.screenshot({ path: "test-results/english-world-desktop.png", fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "test-results/english-world-mobile.png", fullPage: true });
  await cards.filter({ hasText: "Amazing Animal World!" }).getByRole("link").click();
  await expect(page.locator("dt")).toHaveCount(18);
  await expect(page.getByText("Águila", { exact: true })).toBeVisible();
});

test("Sports sorting covers exactly the workbook's 16 terms", async ({ page }) => {
  await page.goto("/englishworld/sports/");
  await page.getByRole("button", { name: /Play, Go, Do, Wear/ }).click();
  const play = page.locator("#unit-game");
  const expectedGroups = [
    ...Array<string>(7).fill("Play"), "Go", "Go", "Go", "Play", "Play",
    ...Array<string>(4).fill("Wear"),
  ];
  for (const [round, group] of expectedGroups.entries()) {
    await expect(play.getByText(`Ronda ${round + 1} de 16`)).toBeVisible();
    await play.getByRole("button", { name: group, exact: true }).click();
    await play.getByRole("button", { name: "Next →" }).click();
  }
  await expect(play.getByText("Juego completado")).toBeVisible();
  await expect(page.getByRole("img", { name: /Best score: 16 of 16/ })).toBeVisible();
});

test("Seasons opens all eight games and uses its own workbook vocabulary", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/englishworld/seasons/");
  const menu = page.getByRole("region", { name: "Juegos de inglés" });
  await expect(menu.getByRole("button")).toHaveCount(8);
  await page.screenshot({ path: "test-results/seasons-mobile.png", fullPage: true });

  const play = page.locator("#unit-game");
  for (const name of [
    "Picture Match", "Mystery Word", "Build a Phrase", "See It, Hear It, Spell It",
    "Letter Scramble", "Word Hunt", "Look & Find", "Weather, Season or Activity?",
  ]) {
    await menu.getByRole("button", { name: new RegExp(name.replace("?", "\\?")) }).click();
    await expect(play.getByRole("heading", { name })).toBeVisible();
    await expect(play.getByText(name === "Word Hunt" ? "Ronda 1 de 6" : "Ronda 1 de 22")).toBeVisible();
  }
  await expect(play.getByText("sunny", { exact: true })).toBeVisible();
  await play.getByRole("button", { name: "Weather" }).click();
  await expect(play.getByText("¡Muy bien!")).toBeVisible();

  await menu.getByRole("button", { name: /Look & Find/ }).click();
  await expect(play.getByText("Soleado", { exact: true })).toBeVisible();
  await play.getByRole("textbox", { name: "Letras que faltan" }).fill("u");
  await play.getByRole("button", { name: "Check" }).click();
  await play.getByRole("button", { name: "Soleado", exact: true }).click();
  await expect(play.getByText("¡Lo encontraste!")).toBeVisible();
});

test("Seasons Word Hunt finishes the final two-word board", async ({ page }) => {
  await page.goto("/englishworld/seasons/");
  await page.getByRole("button", { name: /Word Hunt/ }).click();
  const play = page.locator("#unit-game");
  const cells = play.getByRole("group", { name: "Cuadrícula de letras" }).getByRole("button");
  for (let round = 0; round < 6; round++) {
    const targets = await play.getByRole("listitem").allTextContents();
    expect(targets).toHaveLength(round === 5 ? 2 : 4);
    for (const target of targets) {
      const word = target.replaceAll(" ", "").toUpperCase();
      const endpoints = await cells.evaluateAll((buttons, value) => {
        const columns = buttons.length / 8;
        for (let start = 0; start < buttons.length; start++) {
          for (const step of [1, -1, columns, -columns]) {
            const end = start + step * (value.length - 1);
            if (end < 0 || end >= buttons.length) continue;
            if (Math.abs(step) === 1 && Math.floor(end / columns) !== Math.floor(start / columns)) continue;
            const letters = Array.from(value, (_, index) => buttons[start + index * step]?.textContent).join("");
            if (letters === value) return [start, end] as const;
          }
        }
        return null;
      }, word);
      expect(endpoints).not.toBeNull();
      await cells.nth(endpoints![0]).click();
      await cells.nth(endpoints![1]).click();
    }
    await play.getByRole("button", { name: "Continuar →" }).click();
  }
  await expect(play.getByText("Juego completado")).toBeVisible();
  await expect(page.getByRole("img", { name: /Best score: 22 of 22/ })).toBeVisible();
});
