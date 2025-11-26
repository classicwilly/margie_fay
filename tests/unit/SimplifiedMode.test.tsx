import { render, fireEvent } from "@testing-library/react";
import {
  SimplifiedModeProvider,
  useSimplifiedMode,
} from "../../src/contexts/SimplifiedModeContext";

const TestComponent = () => {
  const { simplifiedMode, setSimplifiedMode } = useSimplifiedMode();
  return (
    <div>
      <button
        onClick={() => setSimplifiedMode(!simplifiedMode)}
        data-testid="toggle"
      >
        Toggle
      </button>
      <div data-testid="status">{simplifiedMode ? "on" : "off"}</div>
    </div>
  );
};

test("SimplifiedMode provider toggles and updates body class", () => {
  const { getByTestId } = render(
    <SimplifiedModeProvider>
      <TestComponent />
    </SimplifiedModeProvider>,
  );
  expect(document.body.classList.contains("simplified-mode")).toBe(false);
  fireEvent.click(getByTestId("toggle"));
  expect(getByTestId("status").textContent).toBe("on");
  expect(document.body.classList.contains("simplified-mode")).toBe(true);
});
