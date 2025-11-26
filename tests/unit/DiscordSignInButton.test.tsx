import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DiscordSignInButton from "../../src/components/DiscordSignInButton";

describe("DiscordSignInButton", () => {
  afterEach(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  it("renders sign in when not signed in", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ status: 401 })),
    );
    render(<DiscordSignInButton />);
    expect(screen.getByText("Sign in with Discord")).toBeTruthy();
  });

  it("renders profile when signed in", async () => {
    const profile = { id: "1", username: "wonky", avatar: null };
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () => ({ status: 200, json: async () => ({ profile }) }) as any,
      ),
    );
    render(<DiscordSignInButton />);
    await waitFor(() => expect(screen.getByText("wonky")).toBeTruthy());
  });
});
