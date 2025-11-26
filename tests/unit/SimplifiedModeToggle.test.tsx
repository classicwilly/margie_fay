import { render, fireEvent } from "@testing-library/react";
import SimplifiedModeToggle from "../../components/SimplifiedModeToggle";
import { SimplifiedModeProvider } from "../../src/contexts/SimplifiedModeContext";

test("SimplifiedModeToggle renders and toggles aria-pressed and label", () => {
  const { getByRole } = render(
    <SimplifiedModeProvider>
      <SimplifiedModeToggle />
    </SimplifiedModeProvider>,
  );
  const button = getByRole("button");
  // Initially off
  expect(button.getAttribute("aria-pressed")).toBe("false");
  expect(button.textContent).toBe("Standard");

  // Click to toggle on
  fireEvent.click(button);
  expect(button.getAttribute("aria-pressed")).toBe("true");
  expect(button.textContent).toBe("Simplified");

  // Click to toggle off
  fireEvent.click(button);
  expect(button.getAttribute("aria-pressed")).toBe("false");
  expect(button.textContent).toBe("Standard");
});
