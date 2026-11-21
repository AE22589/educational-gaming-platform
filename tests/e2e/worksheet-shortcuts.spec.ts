import { expect, test } from "@playwright/test";

const base = process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";
const section = `${base}/unit/science-2-b2-s02/`;
const topic = `${section}subsection/healthcare-and-illnesses/`;
const pdf = `${base}/worksheets/science/science-2-b2-s02/healthcare-and-illnesses/healthcare-and-illnesses.pdf`;

test("the Healthy Habits section and Healthcare topic link directly to the PDF", async ({ page, request }) => {
  for (const route of [section, topic]) {
    await page.goto(route);
    const link = page.getByRole("link", { name: /Imprimir fichas/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", pdf);
    await expect(link).toHaveAttribute("target", "_blank");
  }
  expect((await request.get(pdf)).headers()["content-type"]).toContain("application/pdf");

  await page.goto(`${base}/unit/science-2-b2-s01/`);
  await expect(page.getByRole("link", { name: /Imprimir fichas/ })).toHaveCount(0);
});

test("a Worksheets deep link opens with the requested topic selected", async ({ page }) => {
  await page.goto(`${base}/worksheets/?section=science-2-b2-s02&topic=science-2-b2-s02-02`);
  await expect(page.getByLabel("Tema")).toHaveValue("science-2-b2-s02-02");
  await expect(page.getByRole("link", { name: /Abrir e imprimir/ })).toHaveAttribute("href", pdf);
});
