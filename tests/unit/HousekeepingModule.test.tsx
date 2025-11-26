import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HousekeepingModule from "@components/modules/housekeeping/HousekeepingModule";
import { AppStateProvider } from "@contexts/AppStateContext";

describe("HousekeepingModule - basic DOM checks", () => {
  it("renders coin balance with workshop testid and aria-live", () => {
    const { container } = render(
      <AppStateProvider>
        <HousekeepingModule />
      </AppStateProvider>,
    );

    const coinBalance = container.querySelector(
      '[data-workshop-testid="workshop-coin-balance" ]',
    );
    expect(coinBalance).toBeTruthy();
    expect(coinBalance?.getAttribute("role")).toBe("status");
    expect(coinBalance?.getAttribute("aria-live")).toBe("polite");
  });

  it("renders start step button with workshop testid and data-step-index", () => {
    const { container } = render(
      <AppStateProvider>
        <HousekeepingModule />
      </AppStateProvider>,
    );
    // default index is 0: the modal is hidden by default, open it first
    const openBtn = container.querySelector(
      '[data-workshop-testid="workshop-start-day-open" ]',
    );
    expect(openBtn).toBeTruthy();
    if (openBtn) {
      fireEvent.click(openBtn as Element);
    }

    // default index is 0
    const stepBtn = container.querySelector(
      '[data-workshop-testid="workshop-start-step-0" ]',
    );
    expect(stepBtn).toBeTruthy();
    expect(stepBtn?.getAttribute("data-step-index")).toBe("0");
  });
});
