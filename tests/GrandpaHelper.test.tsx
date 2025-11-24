import React from "react";
import { render, screen } from "@testing-library/react";
import GrandpaHelper from "../src/components/GrandpaHelper";

describe("GrandpaHelper", () => {
  it("renders advice for the task", () => {
    render(<GrandpaHelper task="finish the report" />);
    expect(screen.getByText(/Grandpa's Advice/i)).toBeInTheDocument();
    expect(screen.getByText(/15-minute timer/i)).toBeInTheDocument();
  });
});
