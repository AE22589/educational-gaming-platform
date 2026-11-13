import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(`contact on ${viewport.name}`, () => {
    test.use({ viewport, hasTouch: viewport.name === "mobile" });

    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name: /Contact Us/ }).click();
      await expect(page).toHaveURL(/\/contact\/$/);
    });

    test("validates email and message in Spanish", async ({ page }) => {
      await expect(page.getByRole("heading", { name: "¡Cuéntanos!" })).toBeVisible();
      await expect(page.getByText(/Si eres menor/)).toBeVisible();
      await expect.poll(() => page.locator("main img").first().evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

      const email = page.getByLabel(/Tu correo electrónico/);
      const message = page.getByLabel(/Tu mensaje/);
      const send = page.getByRole("button", { name: /Enviar mensaje/ });
      const feedback = page.locator("#contact-feedback");

      await send.click();
      await expect(email).toBeFocused();
      await email.fill("invalid-email");
      await message.fill("A test message");
      await send.click();
      await expect(feedback).toHaveText(/correo electrónico válido/);
      await expect(email).toBeFocused();

      await email.fill("visitor@example.com");
      for (const value of ["", "   "]) {
        await message.fill(value);
        await send.click();
        await expect(feedback).toHaveText(/Escribe un mensaje/);
        await expect(message).toBeFocused();
      }
    });

    test("preserves fields on failure and clears them after one accepted retry", async ({ page }) => {
      const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
      test.skip(!formId, "Set NEXT_PUBLIC_FORMSPREE_FORM_ID before building to exercise submission.");

      const email = page.getByLabel(/Tu correo electrónico/);
      const message = page.getByLabel(/Tu mensaje/);
      const send = page.getByRole("button", { name: /Enviar mensaje/ });
      const feedback = page.locator("#contact-feedback");
      let requests = 0;
      let releaseSuccess!: () => void;
      const successGate = new Promise<void>((resolve) => { releaseSuccess = resolve; });
      await page.route("https://formspree.io/f/**", async (route) => {
        requests++;
        expect(route.request().method()).toBe("POST");
        expect(route.request().postData()).toContain('name="email"');
        expect(route.request().postData()).toContain("visitor@example.com");
        expect(route.request().postData()).toContain('name="_gotcha"');
        if (requests === 1) {
          await route.fulfill({ status: 503, json: { error: "Unavailable" } });
          return;
        }
        if (requests === 2) {
          await route.abort("failed");
          return;
        }
        await successGate;
        await route.fulfill({ json: { ok: true } });
      });

      await email.fill("visitor@example.com");
      await message.fill("A test message");
      for (const expectedRequests of [1, 2]) {
        await send.click();
        await expect(feedback).toContainText("No hemos podido enviar tu mensaje. Inténtalo de nuevo");
        await expect(email).toHaveValue("visitor@example.com");
        await expect(message).toHaveValue("A test message");
        expect(requests).toBe(expectedRequests);
      }

      await send.click();
      try {
        await expect(feedback).toContainText("Enviando…");
        await expect(page.getByRole("button", { name: /Enviando/ })).toBeDisabled();
        await expect.poll(() => requests).toBe(3);
        await email.locator("..").locator("..").evaluate((form) => (form as HTMLFormElement).requestSubmit());
      } finally {
        releaseSuccess();
      }
      await expect(feedback).toContainText("¡Gracias! Hemos recibido tu mensaje");
      expect(requests).toBe(3);
      await expect(email).toHaveValue("");
      await expect(message).toHaveValue("");
    });
  });
}
