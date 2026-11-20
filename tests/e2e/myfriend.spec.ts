import { expect, test } from "@playwright/test";

test("saves and edits a friend while keeping its birthday", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto("/myfriend/");
  const save = page.getByRole("button", { name: "Save" });
  const name = page.getByLabel("¿Cómo se llamará tu amigo?");
  await expect(page.getByRole("radio")).toHaveCount(10);
  await expect(save).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight)).toBe(true);

  await name.fill("Draco");
  await save.click();
  await expect(page.getByRole("heading", { name: "Draco" })).toBeVisible();
  await expect(page.getByRole("img", { name: "El Dragoncito" })).toBeVisible();
  for (const label of ["Happiness", "Hunger", "Cleanliness"]) {
    await expect(page.getByRole("meter", { name: label })).toBeVisible();
  }
  await expect(page.getByText("Birthday", { exact: true })).toBeVisible();
  const birthday = await page.locator("time").getAttribute("datetime");
  expect(birthday).toBe(await page.evaluate(() => new Date().toLocaleDateString("sv-SE")));

  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
  await page.getByRole("button", { name: "Editar amigo" }).click();
  await expect(page.getByRole("button", { name: "Cancel", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
  await name.fill("Draft");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Draco" })).toBeVisible();
  await page.getByRole("button", { name: "Editar amigo" }).click();
  await page.getByText("Kitten", { exact: true }).click();
  await name.fill("Luna");
  await save.click();
  await page.reload();

  await expect(page.getByRole("heading", { name: "Luna" })).toBeVisible();
  await expect(page.getByRole("img", { name: "El Gatito" })).toBeVisible();
  await expect(page.locator("time")).toHaveAttribute("datetime", birthday!);
  await page.getByRole("link", { name: "Star Shop" }).click();
  await expect(page).toHaveURL(/\/shop\/$/);
});


for (const viewport of [{ width: 390, height: 568 }, { width: 1280, height: 720 }]) {
  test(`primary header stays consistent across pages at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const header = page.locator(".chispitas-header");
    const appearance = () => header.evaluate((element) => {
      const about = element.querySelector(".chispitas-nav-item--about")!;
      const logo = element.querySelector(".chispitas-mark")!;
      return {
        height: element.getBoundingClientRect().height,
        background: getComputedStyle(element).background,
        tileWidth: about.getBoundingClientRect().width,
        tileHeight: about.getBoundingClientRect().height,
        logoWidth: logo.getBoundingClientRect().width,
        artworkWidth: about.querySelector(".chispitas-nav-art")!.getBoundingClientRect().width,
      };
    });

    await page.goto("/");
    const homeAppearance = await appearance();
    expect(homeAppearance.tileHeight).toBeGreaterThanOrEqual(viewport.width <= 680 ? 64 : 90);
    expect(homeAppearance.artworkWidth).toBe(viewport.width <= 680 ? 40 : 50);
    for (const path of ["/myfriend/", "/shop/", "/avatar/", "/scienceworld/body/", "/login-register/"]) {
      await page.goto(path);
      expect(await appearance(), path).toEqual(homeAppearance);
    }

    await page.goto("/myfriend/");
    const panel = page.getByRole("region", { name: /My Little Friend/ });
    const [headerBox, panelBox] = await Promise.all([header.boundingBox(), panel.boundingBox()]);
    expect(panelBox!.y - (headerBox!.y + headerBox!.height)).toBeGreaterThanOrEqual(5);
  });
}
