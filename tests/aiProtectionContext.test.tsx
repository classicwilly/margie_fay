import { renderHook } from "@testing-library/react";
import { AIProtectionProvider } from "@contexts/AIProtectionContext";
import useAIPromptSafety from "../hooks/useAIPromptSafety";

describe("AIProtectionContext provider", () => {
  it("provides the same instance across components", async () => {
    const wrapper = ({ children }: any) => (
      <AIProtectionProvider>{children}</AIProtectionProvider>
    );
    const { result } = renderHook(() => useAIPromptSafety(), { wrapper });

    expect(result.current).toBeTruthy();
    expect(typeof result.current.checkAndExecute).toBe("function");
  });
});
