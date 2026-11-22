import { expect, test } from "@playwright/test";
import data from "../../src/features/curriculum/curriculum.generated.json" with { type: "json" };

const base = process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";
const unit = data.units.find(({ id }) => id === "science-2-b2-s02")!;
for (const section of data.units) {
  const pages = section.subsections.length
    ? section.subsections.map(({ id, title }) => ({
      path: `subsection/${id}/`,
      vocabulary: section.vocabulary.filter(({ subsection }) => subsection === title || subsection === id),
    }))
    : [{ path: "", vocabulary: section.vocabulary }];
  for (const { path, vocabulary } of pages) {
    const illustrated = new Map(vocabulary.filter(({ image }) => image).map((entry) =>
      [JSON.stringify([entry.word.toLowerCase(), entry.image]), entry]));
    if (!illustrated.size) continue;

    test(`Picture Match loads every illustration in ${section.id}/${path}`, async ({ page }) => {
      test.setTimeout(90000);
      await page.goto(`${base}/unit/${section.id}/${path}`);
      await page.getByRole("button", { name: "Picture Match" }).click();
      const game = page.getByRole("region", { name: "Picture Match" });
      for (const [round, { image, word }] of [...illustrated.values()].entries()) {
        await expect(game.getByText(`Ronda ${round + 1} de ${illustrated.size}`)).toBeVisible();
        const picture = game.locator("img");
        await expect(picture).toHaveAttribute("src", `${base}${image}`);
        await expect(picture).toHaveJSProperty("complete", true);
        expect(await picture.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
        await game.getByRole("button", { name: word.toLowerCase(), exact: true }).click();
        await game.getByRole("button", { name: /^(Continuar|Next) →$/ }).click();
      }
      await expect(game.getByText("Juego completado", { exact: true })).toBeVisible();
    });
  }
}

test("color and pet image paths serve WebP while preserving word meanings", async ({ request }) => {
  const basics = data.units.find(({ id }) => id === "english-2-b1-s00")!;
  const words = basics.vocabulary.filter(({ subsection }) => subsection === "Colors" || subsection === "Animals");
  expect(words).toHaveLength(28);
  await Promise.all(words.map(async ({ word, image, subsection }) => {
    expect(image, word).toContain(`/english-2-b1-s00/${subsection.toLowerCase()}/`);
    const response = await request.get(`${base}${image}`);
    expect(response.ok(), word).toBe(true);
    expect(response.headers()["content-type"], word).toContain("image/webp");
    expect((await response.body()).subarray(8, 12).toString(), word).toBe("WEBP");
  }));
  expect(unit.vocabulary.find(({ word }) => word === "Orange")!.image).toContain("/food-and-drinks/");
  expect(unit.vocabulary.find(({ word }) => word === "Fish")!.image).toContain("/food-and-drinks/");
});
