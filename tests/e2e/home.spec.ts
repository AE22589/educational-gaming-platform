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
      "¡Vamos a aprender juntos!",
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
      .getByRole("link", { name: "Ver la vista previa de la misión" })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Tu próxima aventura",
    );
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Tienda", exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "La tienda de la aventura",
    );
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Mi avatar", exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Mi avatar",
    );
    expect(await page.evaluate(() => localStorage.length)).toBe(0);
    expect(errors).toEqual([]);
  });
}
