import { expect, test } from "@playwright/test";
import data from "../../src/features/curriculum/curriculum.generated.json" with { type: "json" };

const base = process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";
for (const width of [320, 390, 1280]) {
  test(`Spanish clues fit every shared game screen at ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/unit/science-2-b2-s02/subsection/food-groups-and-nutrition/",
      "/englishworld/sports/", "/englishworld/seasons/",
    ]) {
      await page.goto(`${base}${route}`);
      const menu = page.getByRole("region", { name: /Juegos de (ciencias|inglés)/ });
      const names = await menu.locator("button strong").allTextContents();
      for (const name of names) {
        await menu.getByRole("button", { name, exact: false }).click();
        const game = page.getByRole("region", { name, exact: true });
        await expect(game).toBeVisible();
        const problems = await game.evaluate((element) => {
          const issues: string[] = [];
          for (const clue of element.querySelectorAll('span[lang="es"]')) {
            const box = clue.getBoundingClientRect();
            if (!box.width || !clue.textContent?.trim()) continue;
            const range = document.createRange(); range.selectNodeContents(clue);
            for (const rect of range.getClientRects()) {
              if (rect.bottom > box.bottom + 1 || rect.right > box.right + 1 || rect.left < box.left - 1) issues.push(clue.textContent);
            }
          }
          return issues;
        });
        expect(problems, `${route}: ${name}`).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
    }
  });

  test(`long Spanish nutrition clues stay above answer controls at ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/unit/science-2-b2-s02/subsection/food-groups-and-nutrition/`);
    await page.getByRole("button", { name: "Mystery Word" }).click();
    const game = page.getByRole("region", { name: "Mystery Word", exact: true });
    const vocabulary = data.units.find(({ id }) => id === "science-2-b2-s02")!.vocabulary
      .filter(({ subsection }) => subsection === "Food groups and nutrition");
    for (let round = 0; round < vocabulary.length; round++) {
      const item = vocabulary[round]!;
      const clue = game.getByText(item.translation, { exact: true });
      await expect(clue).toBeVisible();
      const box = await clue.boundingBox();
      const answer = game.locator('p[aria-label*="blank"]');
      const answerBox = await answer.boundingBox();
      expect(box!.y + box!.height).toBeLessThanOrEqual(answerBox!.y);
      expect(await clue.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(20);
      if (item.translation.length > 45) await page.screenshot({ path: `test-results/spanish-long-clue-${width}.png`, fullPage: true });
      const letters = Array.from(item.word.toLowerCase());
      const missing = (await answer.getAttribute("aria-label"))!.split(" ").indexOf("blank");
      // Spaces in multiword terms appear as empty tokens in the accessible label.
      const positions = letters.flatMap((letter, index) => /\p{L}/u.test(letter) ? [index] : []);
      const expected = letters[positions[(round + 1) % positions.length]!]!;
      expect(missing).toBeGreaterThanOrEqual(0);
      await game.getByRole("button", { name: expected, exact: true }).click();
      await game.getByRole("button", { name: "Continuar →", exact: true }).click();
    }
    await expect(game.getByText("Juego completado", { exact: true })).toBeVisible();
  });
}
