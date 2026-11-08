import { expect, test } from "@playwright/test";

test("login and register navigation switches forms and validates registration email", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: /Log in\/Register/ }).click();
  await expect(page).toHaveURL(/\/login-register\/?$/);
  await expect(page.getByRole("form", { name: /Sign In/ })).toBeVisible();
  await expect(page.getByLabel(/Email \/ Correo/)).toBeVisible();
  await expect(page.getByLabel(/Password \/ Contraseña/)).toBeVisible();
  await expect(page.getByRole("form", { name: /Register/ })).toHaveCount(0);

  await page.getByRole("button", { name: /Register \/ Registrarse/ }).click();
  const register = page.getByRole("form", { name: /Register/ });
  await expect(register).toBeVisible();
  await expect(page.getByRole("form", { name: /Sign In/ })).toHaveCount(0);
  await expect(page.getByLabel(/Grade \/ Curso/).locator("option")).toHaveText([
    "1.º de Primaria", "2.º de Primaria", "3.º de Primaria",
    "4.º de Primaria", "5.º de Primaria", "6.º de Primaria",
  ]);
  await expect(page.getByLabel(/School Name \/ Nombre de la escuela/).locator("option")).toHaveText(["AE School"]);

  await page.getByLabel(/Email \/ Correo/).fill("not-an-email");
  await page.getByRole("button", { name: /Create Account \/ Crear cuenta/ }).click();
  await expect(page.locator("#register-email-error")).toContainText("valid email address");
  await expect(page.getByLabel(/Email \/ Correo/)).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel(/Email \/ Correo/).fill("student@example.com");
  await page.getByLabel(/User Name \/ Nombre de usuario/).fill("Chispa");
  await page.getByRole("button", { name: /Create Account \/ Crear cuenta/ }).click();
  await expect(page.getByText("Account creation is not connected yet.")).toBeVisible();

  await page.getByRole("button", { name: /Sign In \/ Iniciar sesión/ }).click();
  await page.getByLabel(/Email \/ Correo/).fill("student@example.com");
  await page.getByLabel(/Password \/ Contraseña/).fill("example-password");
  await page.getByRole("button", { name: /Log In \/ Iniciar sesión/ }).click();
  await expect(page.getByText("Sign in is not connected yet.")).toBeVisible();
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).resolves.toBe(true);
});
