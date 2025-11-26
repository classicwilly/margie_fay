import { render, screen, fireEvent } from "@testing-library/react";
import GrandpaHelper from "../src/components/GrandpaHelper";

describe("GrandpaHelper", () => {
  it("renders advice for the task", () => {
    render(<GrandpaHelper task="finish the report" />);
    expect(screen.getByText(/Grandpa's Advice/i)).toBeInTheDocument();
    expect(screen.getByText(/Set a 15-minute timer/i)).toBeInTheDocument();
  });

  it("exposes a Grandpa Choice button that starts a timer", async () => {
    const mockStart = vi.fn();
    render(
      (<GrandpaHelper task="prepare slides" onStartTimer={mockStart} />) as any,
    );
    const btn = screen.getByRole("button", { name: /Grandpa's Choice/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockStart).toHaveBeenCalledWith(15);
  });
});
