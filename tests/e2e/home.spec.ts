import { expect, test } from "@playwright/test";

for (const width of [320, 360, 480, 680, 681, 768, 950, 951, 1280, 1920]) {
  test(`home navigation and layout fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const navigation = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(navigation.getByRole("link", { name: "My Profile Mi perfil" })).toBeVisible();
    // Contact Us and About Chispitas lead to friendly "coming soon" pages.
    await expect(navigation.getByRole("link", { name: /Contact Us/ })).toBeVisible();
    await expect(navigation.getByRole("link", { name: /About Chispitas/ })).toBeVisible();
    await expect(navigation.getByText("¡Muy pronto!", { exact: false })).toHaveCount(2);
    await expect(navigation.getByText("Log in/Register", { exact: false })).toBeVisible();
    await expect(navigation.getByText("Iniciar sesión/Registrarse", { exact: true })).toBeVisible();
    const subtitleColors = await navigation.locator("small").evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).color),
    );
    expect(new Set(subtitleColors)).toEqual(new Set(["rgb(94, 112, 138)"]));

    const contactArt = navigation.locator('img[src*="contact-dragon"]');
    await expect.poll(() => contactArt.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

    const layout = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".chispitas-nav");
      const navRect = nav?.getBoundingClientRect();
      const items = [...document.querySelectorAll<HTMLElement>(".chispitas-nav-item")];
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        navWidth: nav?.scrollWidth ?? Infinity,
        navClientWidth: nav?.clientWidth ?? 0,
        navItemsFit: Boolean(navRect && items.every((item) => {
          const rect = item.getBoundingClientRect();
          return rect.left >= navRect.left && rect.right <= navRect.right;
        })),
      };
    });
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.navWidth).toBeLessThanOrEqual(layout.navClientWidth);
    expect(layout.navItemsFit).toBe(true);
  });
}

for (const width of [360, 768, 1280]) {
  test(`Spanish home and keyboard navigation at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "¡Hola, explorador!",
    );
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Saltar al contenido" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.getByText("La primera aventura de animales está en preparación.")).toHaveCount(0);
    await page.getByRole("link", { name: "Jugar la misión" }).click();
    await expect(page).toHaveURL(/\/learn\/body-parts-01\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Misión: partes del cuerpo",
    );
    const startMission = page.getByRole("button", { name: "Empezar", exact: true });
    if (await startMission.isVisible()) await startMission.click();
    await page.getByRole("link", { name: "‹ Misiones" }).click();
    await expect(page).toHaveURL(/\/learn\/?$/);
    await page.getByRole("link", { name: "Chispitas" }).first().click();
    await page.getByRole("link", { name: "Visitar tienda" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tienda de estrellas");
    await expect(page.locator(".shop-star-balance strong")).toHaveText("100");
    await page.screenshot({ path: `test-results/shop-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: "Cueva" }).click();
    await expect(page.getByRole("heading", { name: "Manzana" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "Cama de hojas" })).toBeVisible();
    await page.getByRole("button", { name: "Todo" }).click();
    await page.locator(".product-apple").getByRole("button", { name: "Comprar" }).click();
    await expect(page.locator(".shop-star-balance strong")).toHaveText("99");
    await expect(page.locator(".shop-pantry")).toContainText("1 manzana");
    await page.reload();
    await expect(page.locator(".shop-star-balance strong")).toHaveText("99");
    await expect(page.locator(".shop-pantry")).toContainText("1 manzana");
    await page.locator(".product-water").getByRole("button", { name: "Comprar" }).click();
    await expect(page.locator(".shop-star-balance strong")).toHaveText("98");
    await expect(page.locator(".shop-pantry")).toContainText("1 agua");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto("/");
    await page
      .getByRole("link", { name: "My Little Friend: Ver amigo", exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "La cueva de Chispitas",
    );
    const caveImage = page.locator(".cave-art");
    const dragonImage = page.getByRole("img", { name: /Chispitas duerme enroscado/ });
    await expect(caveImage).toBeVisible();
    await expect(dragonImage).toBeVisible();
    await expect(page.getByRole("button", { name: /Arrastra agua fresca hasta Chispitas/ })).toBeVisible();
    await expect.poll(() => caveImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect.poll(() => dragonImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBe(512);
    expect(
      await page.evaluate(() => localStorage.getItem("tier-abenteuer.profile.v1")),
    ).not.toBeNull();
    expect(errors).toEqual([]);
  });
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
]) {
  test(`companion cave fits ${viewport.width}×${viewport.height} without scrolling`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/avatar");

    const caveImage = page.locator(".cave-art");
    const dragonImage = page.getByRole("img", { name: /Chispitas duerme enroscado/ });
    await expect(caveImage).toBeVisible();
    await expect(dragonImage).toBeVisible();
    await expect.poll(() => caveImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

    const layout = await page.evaluate(() => {
      const image = document.querySelector<HTMLImageElement>(".cave-art");
      const dragon = document.querySelector<HTMLImageElement>(".cave-dragon");
      const artWindow = document.querySelector<HTMLElement>(".cave-art-window");
      const footer = document.querySelector<HTMLElement>(".chispitas-footer");
      const dragonRect = dragon?.getBoundingClientRect();
      const artRect = artWindow?.getBoundingClientRect();
      return {
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        imageBottom: image?.getBoundingClientRect().bottom ?? Infinity,
        dragonInsideArt: Boolean(dragonRect && artRect && dragonRect.left >= artRect.left && dragonRect.right <= artRect.right && dragonRect.top >= artRect.top && dragonRect.bottom <= artRect.bottom),
        footerBottom: footer?.getBoundingClientRect().bottom ?? Infinity,
      };
    });

    expect(layout.scrollHeight).toBeLessThanOrEqual(layout.viewportHeight);
    expect(layout.imageBottom).toBeLessThanOrEqual(layout.viewportHeight);
    expect(layout.footerBottom).toBeLessThanOrEqual(layout.viewportHeight);
    expect(layout.dragonInsideArt).toBe(true);
  });
}

test("the companion cave follows the 06:00 and 18:00 local-time changes", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 1, 5, 59, 0) });
  await page.goto("/avatar");
  const caveImage = page.locator(".cave-art");
  await expect(page.getByRole("img", { name: /luna.*estrellas/i })).toBeVisible();
  await expect.poll(() => caveImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

  await page.clock.runFor(60_000);
  await expect(page.getByRole("img", { name: /luz del día/i })).toBeVisible();
  await expect.poll(() => caveImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

  await page.clock.setFixedTime(new Date(2026, 0, 1, 18, 0, 0));
  await page.clock.runFor(30_000);
  await expect(page.getByRole("img", { name: /luna.*estrellas/i })).toBeVisible();
  await expect.poll(() => caveImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test("the body mission has a single Empezar button, no Comenzar button, accepts face drags, and uses the matching round-two art", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/body-parts-01/");

  const eyeCard = page.getByRole("button", { name: "eye", exact: true });
  const startDemo = page.getByRole("button", { name: "Empezar", exact: true });
  await expect(startDemo).toBeVisible();
  await expect(page.getByRole("button", { name: "Saltar y empezar" })).toHaveCount(0);
  await startDemo.click();
  await expect(eyeCard).toBeEnabled();
  await expect(page.getByRole("button", { name: "Comenzar" })).toHaveCount(0);
  await page.getByRole("button", { name: "Ver ayuda" }).click();
  await expect(page.getByRole("dialog", { name: "Así se juega" })).toBeVisible();
  await page.getByRole("button", { name: "Empezar", exact: true }).click();
  await expect(eyeCard).toBeEnabled();

  const dragWord = async (word: string, targetId: string) => {
    const card = page.getByRole("button", { name: word, exact: true });
    const cardBox = await card.boundingBox();
    const targetBox = await page.locator(`[data-target-id="${targetId}"]`).boundingBox();
    if (!cardBox || !targetBox) throw new Error(`The ${word} card or target is missing.`);
    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 8 });
    await page.mouse.up();
    await expect(page.locator(`.body-placement-label.body-label-${word}`)).toBeVisible();
    await expect(page.locator(".body-feedback")).toContainText("¡Muy bien!");
  };

  await dragWord("eye", "eye-left");
  await dragWord("mouth", "mouth");
  await dragWord("nose", "nose");
  await page.getByRole("button", { name: "ear", exact: true }).click();
  await expect(page.getByRole("button", { name: "ear", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.locator('[data-target-id="ear-left"]').click();
  await expect(page.locator(".body-placement-label.body-label-ear")).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();
  const fullBody = page.getByRole("img", { name: "La niña de la portada de cuerpo entero, con los brazos extendidos a los lados" });
  await expect(fullBody).toBeVisible();
  await expect.poll(() => fullBody.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBe(1024);
  const headTarget = page.locator('[data-target-id="head"]');
  await expect.poll(() => headTarget.evaluate((target) => getComputedStyle(target).borderWidth)).toBe("0px");
  await page.getByRole("button", { name: "head", exact: true }).click();
  await expect(page.getByRole("button", { name: "head", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.locator('[data-target-id="head"]').click();
  await expect(page.locator(".body-placement-label.body-label-head")).toBeVisible();
  await dragWord("arm", "arm-left");
});
test("feeding the dragon plays the lossless WebP animations and returns to sleep", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/shop/");
  await page.locator(".product-apple").getByRole("button", { name: "Comprar" }).click();
  await expect(page.locator(".shop-pantry")).toContainText("1 manzana");
  await page.locator(".product-water").getByRole("button", { name: "Comprar" }).click();
  await expect(page.locator(".shop-pantry")).toContainText("1 agua");

  const requested: string[] = [];
  page.on("request", (request) => requested.push(request.url()));
  await page.goto("/avatar/");
  const dragon = page.locator(".cave-dragon");
  await expect(dragon).toHaveAttribute("src", /dragon-sleep.webp$/);
  // The feeding animations are fetched in the background before they are needed.
  await expect.poll(() => requested.filter((url) => /dragon-(eats|drinks)-shop-.*.webp$/.test(url)).length, { timeout: 10_000 }).toBe(2);

  for (const [item, alt, file] of [
    ["apple", "Chispitas está comiendo una manzana.", /dragon-eats-shop-apple.webp$/],
    ["water", "Chispitas está bebiendo agua fresca.", /dragon-drinks-shop-water.webp$/],
  ] as const) {
    const source = await page.locator(`.cave-${item}`).boundingBox();
    const target = await dragon.boundingBox();
    if (!source || !target) throw new Error("The consumable or the dragon is missing.");
    await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
    await page.mouse.down();
    await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 8 });
    await page.mouse.up();
    const animation = page.getByRole("img", { name: alt });
    await expect(animation).toHaveAttribute("src", file);
    await expect.poll(() => animation.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByRole("img", { name: /Chispitas duerme enroscado/ })).toBeVisible({ timeout: 8_000 });
  }
});
for (const [link, path, heading, text] of [
  ["Contact Us", /\/contact\/?$/, "Contacto", "buzón mágico"],
  ["About Chispitas", /\/about\/?$/, "Sobre Chispitas", "Pequeñas chispas, grandes descubrimientos"],
] as const) {
  test(`the ${link} tile opens a friendly coming-soon page`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: new RegExp(link) }).click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.getByText("¡Muy pronto!", { exact: true })).toBeVisible();
    await expect(page.locator("main").getByText(text, { exact: false })).toBeVisible();
    await expect.poll(() => page.locator("main img").first().evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
}
