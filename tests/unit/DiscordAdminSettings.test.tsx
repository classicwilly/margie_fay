import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiscordAdminSettings from "../../src/components/DiscordAdminSettings";
import { UserContext } from "../../src/contexts/UserContext";
import { discordService } from "../../src/services/discordService";

// Mock the discordService
vi.mock("../../src/services/discordService", () => ({
  discordService: {
    setServiceToken: vi.fn(),
    revokeServiceToken: vi.fn(),
    getServiceTokenStatus: vi.fn().mockResolvedValue({ hasToken: false }),
  },
}));

describe("DiscordAdminSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("does not render if user is not an admin", () => {
    render(
      <UserContext.Provider
        value={{
          user: { id: "1", roles: ["user"] },
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <DiscordAdminSettings isAdmin={false} />
      </UserContext.Provider>,
    );
    expect(screen.queryByText("Discord Bot Service Token")).toBeNull();
  });

  it("renders if user is an admin", () => {
    render(
      <UserContext.Provider
        value={{
          user: { id: "1", roles: ["admin"] },
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <DiscordAdminSettings isAdmin={true} />
      </UserContext.Provider>,
    );
    expect(screen.getByText("Discord Bot Service Token")).toBeInTheDocument();
  });

  it("saves the token when button is clicked and input is valid", async () => {
    render(
      <UserContext.Provider
        value={{
          user: { id: "1", roles: ["admin"] },
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <DiscordAdminSettings isAdmin={true} />
      </UserContext.Provider>,
    );

    const input = screen.getByPlaceholderText(
      "Enter Discord Bot Token",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test-token-123" } });
    fireEvent.click(screen.getByText("Save Service Token"));

    expect(discordService.setServiceToken).toHaveBeenCalledWith(
      "test-token-123",
    );
    expect(
      await screen.findByText("Discord service token saved successfully."),
    ).toBeInTheDocument();
    expect(input.value).toBe(""); // Input should be cleared
  });

  it("shows an error if token is empty", async () => {
    render(
      <UserContext.Provider
        value={{
          user: { id: "1", roles: ["admin"] },
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <DiscordAdminSettings isAdmin={true} />
      </UserContext.Provider>,
    );

    const input = screen.getByPlaceholderText(
      "Enter Discord Bot Token",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(screen.getByText("Save Service Token"));

    await waitFor(() => {
      expect(discordService.setServiceToken).not.toHaveBeenCalled();
      expect(screen.getByText("Token cannot be empty.")).toBeInTheDocument();
    });
  });

  it("shows an error if saving token fails", async () => {
    const errorMessage = "Network error";
    (discordService.setServiceToken as any).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    render(
      <UserContext.Provider
        value={{
          user: { id: "1", roles: ["admin"] },
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <DiscordAdminSettings isAdmin={true} />
      </UserContext.Provider>,
    );

    const input = screen.getByPlaceholderText(
      "Enter Discord Bot Token",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "invalid-token" } });
    fireEvent.click(screen.getByText("Save Service Token"));

    expect(discordService.setServiceToken).toHaveBeenCalledWith(
      "invalid-token",
    );
    expect(
      await screen.findByText(`Failed to save token: ${errorMessage}`),
    ).toBeInTheDocument();
  });

  it("shows revoke button when token exists and allows revoking", async () => {
    // set the getServiceTokenStatus to return true
    (discordService.getServiceTokenStatus as any).mockResolvedValueOnce({
      hasToken: true,
    });
    (discordService.revokeServiceToken as any).mockResolvedValueOnce({
      ok: true,
    });
    render(
      <UserContext.Provider
        value={{
          user: { id: "1", roles: ["admin"] },
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <DiscordAdminSettings isAdmin={true} />
      </UserContext.Provider>,
    );
    // Wait for mount effect to run and for revoke button to appear
    const revokeBtn = await screen.findByText("Revoke Service Token");
    expect(revokeBtn).toBeInTheDocument();
    fireEvent.click(revokeBtn);
    expect(discordService.revokeServiceToken).toHaveBeenCalled();
    expect(
      await screen.findByText("Discord service token revoked."),
    ).toBeInTheDocument();
  });
});
