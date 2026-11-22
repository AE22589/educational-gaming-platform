import { expect, test } from "@playwright/test";

import data from "../../src/features/curriculum/curriculum.generated.json" with { type: "json" };

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
  await expect(page.getByRole("heading", { name: "0 Let's Learn the Basics!" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "1 Let's Play Sports!" })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "1 My Amazing Body!" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "2 Healthy Habits, Happy Life!" })).toBeVisible();
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

test("Food and Drinks offers both food group games", async ({ page }) => {
  await page.goto(`${base}/unit/science-2-b2-s02/subsection/food-and-drinks/`);
  await page.route("**/audio/**", (route) => route.continue());
  await page.getByRole("button", { name: "Food Group Sort" }).click();
  const game = page.getByRole("region", { name: "Food Group Sort" });
  await expect(game.getByText("bread", { exact: true })).toBeVisible();
  await expect(game.locator("img")).toHaveCount(1);
  await game.getByRole("button", { name: "Growth" }).click();
  await expect(game.getByText("Casi. ¡Inténtalo otra vez!")).toBeVisible();
  const breadAudio = page.waitForResponse((response) => response.url().endsWith("/audio/en-gb/bread.mp3"));
  await game.getByRole("button", { name: "Energy" }).click();
  expect((await breadAudio).ok()).toBe(true);
  await game.getByRole("button", { name: "Continuar" }).click();
  await expect(game.getByText("Ronda 2 de 18", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Find the Food" }).click();
  const find = page.getByRole("region", { name: "Find the Food" });
  await expect(find.getByText("Ronda 1 de 18", { exact: true })).toBeVisible();
  await expect(find.getByText("Energy", { exact: true })).toBeVisible();
  await expect(find.locator("img")).toHaveCount(3);
  const foundAudio = page.waitForResponse((response) => response.url().endsWith("/audio/en-gb/bread.mp3"));
  await find.getByRole("button", { name: /\bbread\b/ }).click();
  expect((await foundAudio).ok()).toBe(true);
  await expect(find.getByText("¡Muy bien!")).toBeVisible();
});

test("Picture Match pronounces only a correct answer", async ({ page }) => {
  await page.goto(`${base}/unit/science-2-b2-s02/subsection/food-and-drinks/`);
  await page.getByRole("button", { name: "Picture Match" }).click();
  const game = page.getByRole("region", { name: "Picture Match" });
  const clip = game.locator("audio");
  await expect(page.getByText("Stars 0")).toBeVisible();
  await expect(game.getByText("Stars 0")).toHaveCount(0);
  await expect(page.locator("section[aria-label='Juegos de ciencias'] + [role='status'] + #unit-game")).toBeVisible();
  await expect(clip).toHaveAttribute("src", `${base}/audio/en-gb/apple.mp3`);
  await game.getByRole("button").filter({ hasNotText: /^apple$/ }).first().click();
  await expect(game.getByText("Casi. ¡Inténtalo otra vez!")).toBeVisible();
  expect(await clip.evaluate((audio) => (audio as HTMLAudioElement).paused)).toBe(true);

  const playback = page.waitForResponse((response) => response.url().endsWith("/audio/en-gb/apple.mp3"));
  await game.getByRole("button", { name: "apple", exact: true }).click();
  expect((await playback).headers()["content-type"]).toBe("audio/mpeg");
  await expect(game.getByRole("button", { name: "Listen" })).toHaveCount(0);
  await game.screenshot({ path: "test-results/picture-match-pronunciation.png" });
});

test("Mystery Word pronounces a correct answer and keeps the tall picture above the word", async ({ page }) => {
  test.setTimeout(90000);
  await page.goto(`${base}/unit/science-2-b2-s02/subsection/food-and-drinks/`);
  await page.getByRole("button", { name: "Mystery Word" }).click();
  const game = page.getByRole("region", { name: "Mystery Word" });
  await expect(page.getByText("Stars 0")).toBeVisible();
  const vocabulary = data.units.find(({ id }) => id === "science-2-b2-s02")!.vocabulary;
  const words = [...new Set(vocabulary.filter(({ subsection }) => subsection === "Food and drinks")
    .map(({ word }) => word.toLowerCase()))];
  const milkRound = words.indexOf("milk");
  const missingLetter = (word: string, round: number) => {
    const positions = Array.from(word.matchAll(/\p{L}/gu), ({ index }) => index);
    return positions[(round + 1) % positions.length]!;
  };
  for (const [round, word] of words.slice(0, milkRound).entries()) {
    await game.getByRole("button", { name: word[missingLetter(word, round)]!, exact: true }).click();
    await game.getByRole("button", { name: "Continuar" }).click();
  }

  const milkBlank = missingLetter("milk", milkRound);
  const picture = game.getByRole("img", { name: "Leche", exact: true });
  const word = game.getByLabel(Array.from("milk", (letter, index) =>
    index === milkBlank ? "blank" : letter).join(" "), { exact: true });
  await expect(page.locator("[role=status]:has(+ #unit-game) strong")).toHaveText(String(milkRound));
  await expect(game.getByRole("button", { name: "Listen" })).toHaveCount(0);
  expect(await game.locator("audio").evaluate((audio) => (audio as HTMLAudioElement).paused)).toBe(true);
  for (const width of [1280, 360]) {
    await page.setViewportSize({ width, height: 900 });
    const imageBox = await picture.locator("img").boundingBox();
    const frameBox = await picture.boundingBox();
    const wordBox = await word.boundingBox();
    expect(imageBox).not.toBeNull();
    expect(frameBox).not.toBeNull();
    expect(wordBox).not.toBeNull();
    expect(imageBox!.y).toBeGreaterThanOrEqual(frameBox!.y);
    expect(imageBox!.y + imageBox!.height).toBeLessThanOrEqual(frameBox!.y + frameBox!.height);
    expect(frameBox!.y + frameBox!.height).toBeLessThan(wordBox!.y);
  }
  const playback = page.waitForResponse((response) => response.url().endsWith("/audio/en-gb/milk.mp3"));
  await game.getByRole("button", { name: "milk"[milkBlank]!, exact: true }).click();
  expect((await playback).headers()["content-type"]).toBe("audio/mpeg");
  await expect(page.locator("[role=status]:has(+ #unit-game) strong")).toHaveText(String(milkRound + 1));
  await expect(game.getByRole("button", { name: "Listen" })).toHaveCount(0);
  await game.screenshot({ path: "test-results/mystery-word-pronunciation-mobile.png" });
});

test("spelling, phrase and scramble games play the matching recording", async ({ page }) => {
  await page.goto(`${base}/unit/english-2-b1-s01/`);
  for (const { name, label, audio, tiles } of [
    { name: "See It, Hear It, Spell It", label: "Listen", audio: "bat", tiles: [] },
    { name: "Build a Phrase", label: "Check", audio: "phrases/i-have-a-bat", tiles: ["I", "have", "a", "bat"] },
    { name: "Letter Scramble", label: "Check", audio: "bat", tiles: Array.from("bat") },
  ]) {
    await page.getByRole("button", { name }).click();
    const game = page.getByRole("region", { name, exact: true });
    for (const tile of tiles) {
      const group = name === "Build a Phrase" ? "Palabras disponibles" : "Letras disponibles";
      await game.getByRole("group", { name: group }).getByRole("button", { name: tile, exact: true }).click();
    }
    await expect(game.getByRole("button", { name: "Check", exact: true })).toBeVisible();
    const path = `${base}/audio/en-gb/${audio}.mp3`;
    await expect(game.locator("audio")).toHaveAttribute("src", path);
    await game.getByRole("button", { name: label, exact: true }).click();
    await expect.poll(() => game.locator("audio").evaluate((audio) =>
      (audio as HTMLAudioElement).played.length)).toBeGreaterThan(0);
    if (label === "Check") await expect(game.getByText("¡Muy bien!")).toBeVisible();
    else {
      await game.locator("audio").evaluate((audio) => (audio as HTMLAudioElement).pause());
      await game.getByRole("textbox").fill("bat");
      await game.getByRole("button", { name: "Check", exact: true }).click();
      await expect.poll(() => game.locator("audio").evaluate((audio) =>
        (audio as HTMLAudioElement).paused)).toBe(false);
      await expect(game.getByText("¡Muy bien!")).toBeVisible();
    }
  }
  await page.screenshot({ path: "test-results/letter-scramble-audio.png" });
});

test("Word Hunt, Look & Find and sports sorting pronounce correct selections", async ({ page }) => {
  await page.goto(`${base}/unit/english-2-b1-s01/`);
  await page.route("**/audio/**", (route) => route.continue());

  await page.getByRole("button", { name: "Word Hunt" }).click();
  const hunt = page.getByRole("region", { name: "Word Hunt" });
  const huntedAudio = page.waitForResponse((response) => response.url().endsWith("/audio/en-gb/bat.mp3"));
  await hunt.getByRole("button", { name: "B, 3, 1", exact: true }).click();
  await hunt.getByRole("button", { name: "T, 5, 1", exact: true }).click();
  expect((await huntedAudio).ok()).toBe(true);

  await page.getByRole("button", { name: "Look & Find" }).click();
  const spot = page.getByRole("region", { name: "Look & Find" });
  await spot.getByRole("textbox").fill("a");
  await spot.getByRole("button", { name: "Check", exact: true }).click();
  const spottedAudio = page.waitForResponse((response) => response.url().endsWith("/audio/en-gb/bat.mp3"));
  await spot.getByRole("button", { name: "Bate", exact: true }).click();
  expect((await spottedAudio).ok()).toBe(true);

  await page.getByRole("button", { name: "Play, Go, Do, Wear?" }).click();
  const sort = page.getByRole("region", { name: "Play, Go, Do, Wear?" });
  const sortedAudio = page.waitForResponse((response) => response.url().endsWith("/audio/en-gb/bat.mp3"));
  await sort.getByRole("button", { name: "Play", exact: true }).click();
  expect((await sortedAudio).ok()).toBe(true);
  await page.screenshot({ path: "test-results/stars-between-games-and-activity.png" });
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
  await expect(healthMatch.getByText("Ronda 1 de 7")).toBeVisible();
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
  { slug: "seasons", last: "Weather, Season or Activity?", imageMatch: true },
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
      await expect(page.getByText("Stars 0")).toBeVisible();
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
      await expect(menu.getByRole("button")).toHaveCount(8);
      await menu.getByRole("button", { name: "Picture Match" }).click();
      const match = page.getByRole("region", { name: "Picture Match" });
      await expect(match.locator("img")).toBeVisible();
      await expect(match.getByText("Ronda 1 de 34")).toBeVisible();
    } else {
      await page.getByRole("button", { name: "Picture Match" }).click();
      const match = page.getByRole("region", { name: "Picture Match" });
      await expect(match.getByText("Ronda 1 de 13")).toBeVisible();
      await expect(match.locator("img")).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await breadcrumb.getByRole("link", { name: section.title }).click();
    await expect(page).toHaveURL(unitUrl);
  });
}

test("Science Section 3 opens seven bilingual Animal Kingdom topics", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/scienceworld/`);
  await page.getByRole("article").filter({ hasText: "Discover the Animal Kingdom!" }).getByRole("link").click();
  const section = `${base}/unit/science-2-b2-s03/`;
  await expect(page).toHaveURL(section);
  const topics = page.getByRole("region", { name: "Subsecciones" }).getByRole("link");
  await expect(topics).toHaveCount(7);
  await expect(topics.locator('[lang="es"]')).toHaveCount(7);
  const first = topics.getByText("Discovering the Animal World", { exact: true });
  await first.click();
  await expect(page).toHaveURL(`${section}subsection/discovering-the-animal-world/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Discovering the Animal World");
  await expect(page.getByText("Descubriendo el mundo animal", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Picture Match" }).click();
  await expect(page.getByRole("region", { name: "Picture Match" }).locator("img")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole("link", { name: "Volver a las subsecciones" }).click();
  await expect(page).toHaveURL(section);
});
