import { expect, test } from "@playwright/test";
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
    await page.getByRole("link", { name: "Explorar misiones" }).click();
    await expect(page).toHaveURL(/\/learn\/?$/);
    await page
      .getByRole("link", { name: /Misión: partes del cuerpo/ })
      .click();
    await expect(page).toHaveURL(/\/learn\/body-parts-01\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Misión: partes del cuerpo",
    );
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Tienda de estrellas", exact: true })
      .click();
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
      .getByRole("link", { name: "Mi pequeño amigo: Ver amigo", exact: true })
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
