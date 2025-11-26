import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useApplyNeuroPrefs } from "@hooks/useApplyNeuroPrefs";

describe("useApplyNeuroPrefs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.className = "";
  });

  it("Toggling preferences updates document classes", () => {
    const addSpy = vi.spyOn(document.documentElement.classList, "add");
    // const removeSpy = vi.spyOn(document.documentElement.classList, "remove");

    const prefs = {
      simplifiedUi: true,
      reduceAnimations: false,
      largerText: false,
      focusModeDuration: 15,
      microStepsMode: true,
      assistTone: "concise",
      autoAdvanceSteps: false,
    };

    renderHook(() => useApplyNeuroPrefs(prefs));

    expect(addSpy).toHaveBeenCalledWith(expect.stringMatching(/simplified/));
    // Optionally: expect(removeSpy).toHaveBeenCalled();
  });
});
