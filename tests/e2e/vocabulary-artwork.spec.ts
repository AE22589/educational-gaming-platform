import { expect, test } from "@playwright/test";
import data from "../../src/features/curriculum/curriculum.generated.json" with { type: "json" };

const base = process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";
const supplied = new Set(["An omelette", "Breakfast", "Cereals", "Fizzy drink", "Fruits",
  "Good posture", "Hairbrush", "Ham", "Joint", "Lentils", "Milkshake", "Natural yogurt",
  "Olive oil", "Omelette", "Shampoo", "Snack", "Sockets", "Swimming pool", "Towel", "Vegetables", "Yogurt"]);
const unit = data.units.find(({ id }) => id === "science-2-b2-s02")!;

test("all supplied Science illustrations load during Picture Match", async ({ page }) => {
  test.setTimeout(120000);
  const seen = new Set<string>();
  for (const topic of unit.subsections) {
    const words = unit.vocabulary.filter(({ subsection, image }) => subsection === topic.title && image);
    if (!words.some(({ word }) => supplied.has(word))) continue;
    await page.goto(`${base}/unit/${unit.id}/subsection/${topic.id}/`);
    await page.getByRole("button", { name: "Picture Match" }).click();
    const game = page.getByRole("region", { name: "Picture Match" });
    for (let round = 0; round < words.length; round++) {
      const image = game.locator("img");
      await expect(image).toBeVisible();
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      const src = await image.getAttribute("src");
      const entry = words.find(({ image }) => src === `${base}${image}`)!;
      expect(entry).toBeDefined();
      if (supplied.has(entry.word)) seen.add(entry.word);
      await game.getByRole("button", { name: entry.word.toLowerCase(), exact: true }).click();
      await game.getByRole("button", { name: "Continuar →", exact: true }).click();
    }
    await expect(game.getByText("Juego completado", { exact: true })).toBeVisible();
  }
  expect([...seen].sort()).toEqual([...supplied].sort());
});

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
