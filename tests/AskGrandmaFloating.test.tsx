import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AskGrandmaFloating from "../components/AskGrandmaFloating";

describe("AskGrandmaFloating button", () => {
  it("dispatches both legacy and generic events that populate the Ask AI input", () => {
    let legacyFired = false;
    let genericFired = false;
    const legacyHandler = (e: any) => {
      legacyFired = true;
    };
    const genericHandler = (e: any) => {
      genericFired = true;
    };
    window.addEventListener("set-grandma-query", legacyHandler as any);
    window.addEventListener("set-ai-query", genericHandler as any);

    render(<AskGrandmaFloating />);
    const btn = screen.getByRole("button", { name: /Open Ask Grandma/i });
    fireEvent.click(btn);

    expect(legacyFired).toBeTruthy();
    expect(genericFired).toBeTruthy();

    window.removeEventListener("set-grandma-query", legacyHandler as any);
    window.removeEventListener("set-ai-query", genericHandler as any);
  });
});
