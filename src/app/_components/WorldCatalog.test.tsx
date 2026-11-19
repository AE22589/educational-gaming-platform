import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { WorldPage } from "./WorldPage";

test("each world automatically shows the Primaria 2 units for its subject", () => {
  const { rerender } = render(<WorldPage world="englishworld" title="English World" />);
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(10);
  expect(screen.getByRole("heading", { name: "0 Let's Learn the Basics!" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "1 Let's Play Sports!" })).toBeVisible();

  rerender(<WorldPage world="scienceworld" title="Science World" />);
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(6);
  expect(screen.getByRole("heading", { name: "1 My Amazing Body!" })).toBeVisible();
  expect(screen.queryByRole("heading", { name: "1 Let's Play Sports!" })).toBeNull();
  expect(screen.queryByRole("combobox")).toBeNull();
});
