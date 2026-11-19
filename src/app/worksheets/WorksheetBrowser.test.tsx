import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { WorksheetBrowser } from "./WorksheetBrowser";

test("switching grades and books resets the section and does not show its worksheets", async () => {
  const user = userEvent.setup();
  const books = [
    { id: "english-1-b1", grade: 1, title: "Libro 1" },
    { id: "english-2-b1", grade: 2, title: "Libro 1" },
    { id: "english-2-b2", grade: 2, title: "Libro 2" },
  ].map((book) => ({ ...book, world: "englishworld" }));
  const sections = books.map(({ id: bookId }) => ({
    id: `${bookId}-s01`, bookId, title: "Shared section name", language: "en", subsections: [],
  }));
  const worksheets = sections.map(({ id }, index) => ({
    sectionId: id, subsectionId: "", title: `Ficha ${index + 1}`, path: `/worksheets/${id}.pdf`,
  }));
  render(<WorksheetBrowser books={books} sections={sections} worksheets={worksheets} />);

  await user.click(screen.getByRole("button", { name: "Inglés" }));
  await user.selectOptions(screen.getByLabelText("Curso"), "1");
  await user.click(screen.getByRole("button", { name: "Shared section name" }));
  expect(screen.getByRole("link", { name: "Descargar PDF: Ficha 1" })).toBeVisible();

  await user.selectOptions(screen.getByLabelText("Curso"), "2");
  expect(screen.queryByRole("link", { name: /Descargar PDF/ })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Shared section name" }));
  expect(screen.getByRole("link", { name: "Descargar PDF: Ficha 2" })).toBeVisible();

  await user.selectOptions(screen.getByLabelText("Libro"), "english-2-b2");
  expect(screen.queryByRole("link", { name: /Descargar PDF/ })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Shared section name" }));
  expect(screen.getByRole("link", { name: "Descargar PDF: Ficha 3" })).toBeVisible();
});
