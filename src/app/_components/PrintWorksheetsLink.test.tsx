import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PrintWorksheetsLink } from "./PrintWorksheetsLink";

vi.mock("@/features/curriculum/catalog", () => ({
  worksheets: [
    { sectionId: "health", subsectionId: "care", path: "/worksheets/care-1.pdf" },
    { sectionId: "health", subsectionId: "care", path: "/worksheets/care-2.pdf" },
    { sectionId: "health", subsectionId: "sleep", path: "/worksheets/sleep.pdf" },
    { sectionId: "health", subsectionId: "food", path: "/worksheets/food.docx" },
  ],
}));

test("multiple PDFs link to the Worksheets list scoped to the section or topic", () => {
  const { rerender } = render(<PrintWorksheetsLink sectionId="health" subsectionId={undefined} />);
  expect(screen.getByRole("link", { name: "Imprimir fichas" }))
    .toHaveAttribute("href", expect.stringMatching(/^\/worksheets\/?\?section=health$/));

  rerender(<PrintWorksheetsLink sectionId="health" subsectionId="care" />);
  expect(screen.getByRole("link", { name: "Imprimir fichas" }))
    .toHaveAttribute("href", expect.stringMatching(/^\/worksheets\/?\?section=health&topic=care$/));

  rerender(<PrintWorksheetsLink sectionId="health" subsectionId="sleep" />);
  expect(screen.getByRole("link", { name: /Imprimir fichas/ })).toHaveAttribute("target", "_blank");

  rerender(<PrintWorksheetsLink sectionId="health" subsectionId="food" />);
  expect(screen.queryByRole("link")).toBeNull();
});
