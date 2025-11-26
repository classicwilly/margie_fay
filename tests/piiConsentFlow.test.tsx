import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AIProtectionProvider } from "@contexts/AIProtectionContext";
import WonkyAIModule from "@components-root/modules/WonkyAIModule";
import * as telemetry from "../utils/telemetry";

vi.mock("@google/genai", () => ({
  GoogleGenAI: function GoogleGenAI() {
    return {
      models: {
        generateContent: vi.fn().mockResolvedValue({ text: "ok from ai" }),
      },
    };
  },
}));

describe("PII and Consent modal flow", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("shows PII modal, then consent modal, then runs AI", async () => {
    const telemetrySpy = vi.spyOn(telemetry, "logTelemetry");

    render(
      <AIProtectionProvider>
        <WonkyAIModule />
      </AIProtectionProvider>,
    );

    // Input a text with an email (should be flagged as PII)
    const input = screen.getByTestId
      ? screen.getByTestId("ask-ai-input")
      : screen.getByPlaceholderText(/Describe the chaos/i);
    fireEvent.change(input, {
      target: { value: "Contact me at test@example.com" },
    });

    const button = screen.getByTestId
      ? screen.getByTestId("ask-ai-btn")
      : screen.getByRole("button", { name: /Ask AI/i });
    fireEvent.click(button);

    // PII modal should appear
    await waitFor(() =>
      expect(
        screen.getByText(/Potential Sensitive Data Detected!/i),
      ).toBeInTheDocument(),
    );

    // Confirm 'Send Anyway' which triggers the consent modal to appear afterwards
    const sendAnyway = screen.getByRole("button", { name: /Send Anyway/i });
    fireEvent.click(sendAnyway);

    // Consent modal should appear
    await waitFor(() =>
      expect(screen.getByText(/AI Feature Consent/i)).toBeInTheDocument(),
    );

    // Click 'Acknowledge & Proceed'
    const acknowledge = screen.getByRole("button", {
      name: /Acknowledge & Proceed/i,
    });
    fireEvent.click(acknowledge);

    // Now AI should be called — mocked to return text
    await waitFor(() => expect(telemetrySpy).toHaveBeenCalled());
  });
});
