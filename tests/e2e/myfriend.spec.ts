import { expect, test } from "@playwright/test";

test("chooses, names and edits a companion without losing its birthday", async ({ page }) => {
  await page.goto("/myfriend/");
  await expect(page.locator(".friend-card")).toHaveCount(10);
  await expect(page.getByText("¡Próximamente!", { exact: true })).toHaveCount(9);
  await page.getByRole("button", { name: "Elegir a Chispitas" }).click();
  await page.getByLabel("Elige un nombre para tu amigo").fill("Draco");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByRole("heading", { name: "La cueva de Chispitas" })).toBeVisible();
  await expect(page.locator(".cave-intro").filter({ hasText: "Draco" })).toBeVisible();
  await page.getByRole("button", { name: "Mi amigo" }).click();
  const birthday = await page.locator("time").getAttribute("datetime");
  await expect(page.getByRole("heading", { name: "Draco" })).toBeVisible();
  for (const label of ["Happiness", "Hunger", "Cleanliness"]) await expect(page.getByRole("meter", { name: label })).toBeVisible();
  await expect(page.getByRole("link", { name: /Star Shop/ })).toBeVisible();
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await page.getByRole("button", { name: "Cambiar nombre" }).click();
  await page.getByLabel("Elige un nombre para tu amigo").fill("Luna");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.locator(".cave-intro").filter({ hasText: "Luna" })).toBeVisible();
  await page.getByRole("button", { name: "Mi amigo" }).click();
  await expect(page.locator("time")).toHaveAttribute("datetime", birthday!);
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await page.reload();
  await expect(page.locator(".cave-intro").filter({ hasText: "Luna" })).toBeVisible();
  await page.getByRole("button", { name: "Cambiar de amigo" }).click();
  await expect(page.getByText("¡Próximamente!", { exact: true })).toHaveCount(9);
  await page.getByRole("button", { name: "Volver con Chispitas" }).click();
  await expect(page.locator(".cave-intro").filter({ hasText: "Luna" })).toBeVisible();
});

test("keeps an earlier unavailable friend accessible after choosing the dragon", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("chispitas.myfriend.v1", JSON.stringify({ avatarId: "kitten", name: "Luna", birthday: "2025-06-01" })));
  await page.goto("/myfriend/");
  await page.getByRole("button", { name: "Ver a Luna" }).click();
  await expect(page.getByRole("heading", { name: "Luna" })).toBeVisible();
  await expect(page.locator("time")).toHaveAttribute("datetime", "2025-06-01");
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await page.getByRole("button", { name: "Elegir a Chispitas" }).click();
  await page.getByLabel("Elige un nombre para tu amigo").fill("Draco");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await page.getByRole("button", { name: "Cambiar de amigo" }).click();
  await page.getByRole("button", { name: "Ver a Luna" }).click();
  await expect(page.getByRole("heading", { name: "Luna" })).toBeVisible();
});

test("migrates a previously named dragon and preserves its birthday", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("chispitas.myfriend.v1", JSON.stringify({ avatarId: "dragon", name: "Draco", birthday: "2025-06-01" })));
  await page.goto("/myfriend/");
  await expect(page.locator(".cave-intro").filter({ hasText: "Draco" })).toBeVisible();
  await page.getByRole("button", { name: "Mi amigo" }).click();
  await expect(page.locator("time")).toHaveAttribute("datetime", "2025-06-01");
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
    const panel = page.getByRole("region", { name: "Elige a tu pequeño amigo" });
    const [headerBox, panelBox] = await Promise.all([header.boundingBox(), panel.boundingBox()]);
    expect(panelBox!.y - (headerBox!.y + headerBox!.height)).toBeGreaterThanOrEqual(5);
  });
}
