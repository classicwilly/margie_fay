import React from "react";
import { render, fireEvent } from "@testing-library/react";
import WonkyToolkit from "@components/WonkyToolkit";
import { AppStateProvider } from "@contexts/AppStateContext";

describe("Wonky Toolkit", () => {
  it("starts a pomodoro", () => {
    const { getByText } = render(
      <AppStateProvider>
        <WonkyToolkit />
      </AppStateProvider>,
    );
    const startButton = getByText("Start Pomodoro");
    fireEvent.click(startButton);
    expect(startButton).toBeTruthy();
  });

  it("opens sensory toolkit", () => {
    const { getByText } = render(
      <AppStateProvider>
        <WonkyToolkit />
      </AppStateProvider>,
    );
    const sensoryButton = getByText("Open Sensory Tools");
    fireEvent.click(sensoryButton);
    expect(sensoryButton).toBeTruthy();
  });

  it("activates bubble shield protocol", () => {
    const { getByText } = render(
      <AppStateProvider>
        <WonkyToolkit />
      </AppStateProvider>,
    );
    const bubbleButton = getByText("Bubble Shield Protocol");
    fireEvent.click(bubbleButton);
    expect(bubbleButton).toBeTruthy();
  });

  it("toggles micro-steps mode", () => {
    const { getByText } = render(
      <AppStateProvider>
        <WonkyToolkit />
      </AppStateProvider>,
    );
    const microStepsButton = getByText("Toggle Micro-steps");
    fireEvent.click(microStepsButton);
    expect(microStepsButton).toBeTruthy();
  });

  it("resets checklists", () => {
    const { getByText } = render(
      <AppStateProvider>
        <WonkyToolkit />
      </AppStateProvider>,
    );
    const resetButton = getByText("Reset Checklists");
    fireEvent.click(resetButton);
    expect(resetButton).toBeTruthy();
  });

  it("clears brain dump", () => {
    const { getByText } = render(
      <AppStateProvider>
        <WonkyToolkit />
      </AppStateProvider>,
    );
    const clearButton = getByText("Clear Brain Dump");
    fireEvent.click(clearButton);
    expect(clearButton).toBeTruthy();
  });

  it("starts focus mode", () => {
    const { getByText } = render(
      <AppStateProvider>
        <WonkyToolkit />
      </AppStateProvider>,
    );
    const focusButton = getByText("Start Focus Mode");
    fireEvent.click(focusButton);
    expect(focusButton).toBeTruthy();
  });
});
