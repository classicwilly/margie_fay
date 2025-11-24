import React from "react";
import { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
vi.mock("@services/geminiService", () => ({
  getGrandmaAdvice: vi.fn(async (q: string) => `GRANDMA: ${q}`),
  getGrandpaAdvice: vi.fn(async (q: string) => `GRANDPA: ${q}`),
  getBobAdvice: vi.fn(async (q: string) => `BOB: ${q}`),
  getMargeAdvice: vi.fn(async (q: string) => `MARGE: ${q}`),
}));

import GrandmaHelper from "../components/GrandmaHelper";
import { AppStateProvider } from "@contexts/AppStateContext";

describe("GrandmaHelper persona chooser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("asks Grandma by default and shows response", async () => {
    render(
      <AppStateProvider>
        <GrandmaHelper />
      </AppStateProvider>,
    );
    const input = screen.getByTestId("grandma-input");
    fireEvent.change(input, { target: { value: "How do I fix the sink?" } });
    fireEvent.click(screen.getByTestId("grandma-ask-button"));
    await waitFor(() =>
      expect(
        screen.getByText(/GRANDMA: How do I fix the sink/),
      ).toBeInTheDocument(),
    );
  });

  it("switches to Grandpa and uses his persona", async () => {
    render(
      <AppStateProvider>
        <GrandmaHelper />
      </AppStateProvider>,
    );
    const personaSelect = screen.getByRole("combobox", { name: /AI persona/i });
    fireEvent.change(personaSelect, { target: { value: "grandpa" } });
    const input = screen.getByTestId("grandma-input");
    fireEvent.change(input, { target: { value: "How do I prune roses?" } });
    fireEvent.click(screen.getByTestId("grandma-ask-button"));
    await waitFor(() =>
      expect(
        screen.getByText(/GRANDPA: How do I prune roses/),
      ).toBeInTheDocument(),
    );
  });

  it("listens for the generic set-ai-query event and processes it by current persona", async () => {
    render(
      <AppStateProvider>
        <GrandmaHelper />
      </AppStateProvider>,
    );
    const personaSelect = screen.getByRole("combobox", { name: /AI persona/i });
    fireEvent.change(personaSelect, { target: { value: "grandpa" } });
    // dispatch generic event that the quick action or other modules might emit
    act(() =>
      window.dispatchEvent(
        new CustomEvent("set-ai-query", {
          detail: { value: "How do I prune roses?" },
        }),
      ),
    );
    const input = screen.getByTestId("grandma-input");
    await waitFor(() =>
      expect((input as HTMLInputElement).value).toBe("How do I prune roses?"),
    );
    fireEvent.click(screen.getByTestId("grandma-ask-button"));
    await waitFor(() =>
      expect(
        screen.getByText(/GRANDPA: How do I prune roses/),
      ).toBeInTheDocument(),
    );
  });

  it("switches to Bob and uses Bob persona", async () => {
    render(
      <AppStateProvider>
        <GrandmaHelper />
      </AppStateProvider>,
    );
    const personaSelect = screen.getByRole("combobox", { name: /AI persona/i });
    fireEvent.change(personaSelect, { target: { value: "bob" } });
    const input = screen.getByTestId("grandma-input");
    fireEvent.change(input, { target: { value: "How do I fix the fence?" } });
    fireEvent.click(screen.getByTestId("grandma-ask-button"));
    await waitFor(() =>
      expect(
        screen.getByText(/BOB: How do I fix the fence/),
      ).toBeInTheDocument(),
    );
  });

  it("switches to Marge and uses Marge persona", async () => {
    render(
      <AppStateProvider>
        <GrandmaHelper />
      </AppStateProvider>,
    );
    const personaSelect = screen.getByRole("combobox", { name: /AI persona/i });
    fireEvent.change(personaSelect, { target: { value: "marge" } });
    const input = screen.getByTestId("grandma-input");
    fireEvent.change(input, {
      target: { value: "How do I organize my pantry?" },
    });
    fireEvent.click(screen.getByTestId("grandma-ask-button"));
    await waitFor(() =>
      expect(
        screen.getByText(/MARGE: How do I organize my pantry/),
      ).toBeInTheDocument(),
    );
  });
});
