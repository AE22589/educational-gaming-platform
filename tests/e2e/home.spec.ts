import { expect, test } from "@playwright/test";

for (const width of [320, 375, 768, 1280]) {
  test(`CHISPITAS homepage content and layout at ${width}px`, async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleProblems: string[] = [];
    const failedRequests: string[] = [];
    const unsuccessfulResponses: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        consoleProblems.push(message.text());
      }
    });
    page.on("requestfailed", (request) => failedRequests.push(request.url()));
    page.on("response", (response) => {
      if (response.status() >= 400) {
        unsuccessfulResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page).toHaveTitle("CHISPITAS | Learning Platform for Bilingual Schools");
    await expect(page.getByRole("link", { name: "CHISPITAS home" })).toBeVisible();
    await expect(page.getByText("Aventura Animal", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Learning Platform for Bilingual Schools")).toBeVisible();
    await expect(page.getByText("Pequeñas chispas, grandes descubrimientos.")).toBeVisible();
    await expect(page.getByText("Little sparks. Big discoveries.")).toBeVisible();

    const navigation = page.getByRole("navigation", { name: "Main navigation / Navegación principal" });
    for (const label of ["My Profile", "Science", "English", "Star Shop", "Adventure Map"]) {
      await expect(navigation.getByText(label, { exact: true })).toBeVisible();
    }
    for (const label of ["Mi perfil", "Ciencias", "Inglés", "Tienda de estrellas", "Mapa de aventuras"]) {
      await expect(navigation.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(navigation.getByRole("link")).toHaveCount(1);
    await expect(navigation.getByText("Coming soon", { exact: true })).toHaveCount(4);

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hello, Explorer!");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("¡Hola, explorador!");
    await expect(page.getByText("Ready for today’s adventure?")).toBeVisible();
    await expect(page.getByText("¿Preparado para la aventura de hoy?")).toBeVisible();
    await expect(page.getByRole("img", { name: /smiling explorer avatar/ })).toBeVisible();
    await expect(page.getByLabel("Sample star balance: 125 stars")).toBeVisible();
    expect(await page.locator(".chispitas-world-card").first().evaluate((element) => getComputedStyle(element).transitionProperty)).toBe("none");

    const worldsHeading = page.getByRole("heading", { name: /Explore the Worlds.*Explora los mundos/ });
    await expect(worldsHeading).toBeVisible();
    for (const title of ["Science World", "English World", "My Avatar", "Adventure Map"]) {
      await expect(page.getByRole("heading", { name: new RegExp(title) })).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: /Today’s Missions.*Misiones de hoy/ })).toBeVisible();
    for (const mission of [
      { title: "Find 5 animal words", total: "5" },
      { title: "Label the parts of a plant", total: "1" },
      { title: "Complete a spelling challenge", total: "1" },
    ]) {
      await expect(page.getByRole("heading", { name: new RegExp(mission.title) })).toBeVisible();
      await expect(page.getByRole("progressbar", { name: `${mission.title}: 0 of ${mission.total}` }))
        .toHaveAttribute("max", mission.total);
    }
    await expect(page.getByRole("progressbar", { name: "Star collection: 125 of 150 stars" }))
      .toHaveAttribute("aria-valuenow", "125");
    await expect(page.getByRole("progressbar", { name: "Star collection: 125 of 150 stars" }))
      .toHaveAttribute("aria-valuemax", "150");
    await expect(page.getByText("125 / 150 Stars")).toBeVisible();
    await expect(page.getByText("25 more stars to unlock a surprise!")).toBeVisible();
    await expect(page.getByText("¡25 estrellas más para desbloquear una sorpresa!")).toBeVisible();
    for (const item of ["Badges", "Pets", "Avatar Accessories", "Special Outfits", "World Decorations"]) {
      await expect(page.getByText(item, { exact: true })).toBeVisible();
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(pageErrors).toEqual([]);
    expect(unsuccessfulResponses).toEqual([]);
    expect(consoleProblems).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}

test("available homepage destinations work with keyboard and navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /Create My Avatar/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/avatar\/?$/);

  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const starShopLink = page.getByRole("navigation").getByRole("link", { name: /Star Shop/ });
  await expect(starShopLink).toBeFocused();
  expect(await starShopLink.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  expect(await starShopLink.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/shop\/?$/);

  await page.goto("/");
  await page.getByRole("navigation").getByRole("link", { name: /Star Shop/ }).click();
  await expect(page).toHaveURL(/\/shop\/?$/);
  await expect(page.getByRole("heading", { name: "La tienda de la aventura" })).toBeVisible();
});
