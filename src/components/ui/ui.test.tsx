import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { Card } from "./Card";
describe("shared UI", () => {
  it("supports keyboard activation with a semantic button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continuar</Button>);
    await user.tab();
    expect(screen.getByRole("button", { name: "Continuar" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("blocks disabled actions", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Continuar
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
  it("renders a card heading and content", () => {
    render(
      <Card title="Una aventura">
        <p>A tu ritmo</p>
      </Card>,
    );
    expect(
      screen.getByRole("heading", { name: "Una aventura", level: 2 }),
    ).toBeVisible();
    expect(screen.getByText("A tu ritmo")).toBeVisible();
  });
});
