import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "@testing-library/react";
import { useLocalStorage } from "../hooks/useLocalStorage";

describe("useLocalStorage", () => {
  it("initializes with default value when nothing in storage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    const [state] = result.current;
    expect(state).toBe("default");
  });

  it("updates localStorage when state changes", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key-2", "initial"),
    );
    const [, setState] = result.current;
    act(() => {
      setState("updated");
    });
    const [value] = result.current;
    expect(value).toBe("updated");
    // localStorage read should reflect new value
    expect(localStorage.getItem("test-key-2")).toBe(JSON.stringify("updated"));
  });
});
