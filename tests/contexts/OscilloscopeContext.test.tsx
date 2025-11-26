import { render, screen, fireEvent } from "@testing-library/react";
import {
  OscilloscopeProvider,
  useOscilloscope,
} from "@contexts/OscilloscopeContext";

function TestComponent() {
  const { state, dispatch } = useOscilloscope() as any;
  return (
    <div>
      <div data-testid="focus-mode">{state.focusMode}</div>
      <button
        data-testid="btn-deep"
        onClick={() => dispatch({ type: "SET_FOCUS_MODE", payload: "laser" })}
      >
        deep
      </button>
      <button
        data-testid="btn-neutral"
        onClick={() => dispatch({ type: "SET_FOCUS_MODE", payload: "none" })}
      >
        neutral
      </button>
      <button
        data-testid="btn-scout"
        onClick={() => dispatch({ type: "SET_FOCUS_MODE", payload: "scout" })}
      >
        scout
      </button>
    </div>
  );
}

describe("OscilloscopeContext adapter behavior", () => {
  test('dispatch("SET_FOCUS_MODE", "laser") updates focusMode to laser', () => {
    render(
      <OscilloscopeProvider>
        <TestComponent />
      </OscilloscopeProvider>,
    );
    expect(screen.getByTestId("focus-mode").textContent).toBe("none");
    fireEvent.click(screen.getByTestId("btn-deep"));
    expect(screen.getByTestId("focus-mode").textContent).toBe("laser");
  });

  test('dispatch("SET_FOCUS_MODE", "none") updates focusMode to none', () => {
    render(
      <OscilloscopeProvider>
        <TestComponent />
      </OscilloscopeProvider>,
    );
    fireEvent.click(screen.getByTestId("btn-deep"));
    expect(screen.getByTestId("focus-mode").textContent).toBe("laser");
    fireEvent.click(screen.getByTestId("btn-neutral"));
    expect(screen.getByTestId("focus-mode").textContent).toBe("none");
  });

  test("dispatch SET_FOCUS_MODE works directly", () => {
    render(
      <OscilloscopeProvider>
        <TestComponent />
      </OscilloscopeProvider>,
    );
    fireEvent.click(screen.getByTestId("btn-scout"));
    expect(screen.getByTestId("focus-mode").textContent).toBe("scout");
  });
});
