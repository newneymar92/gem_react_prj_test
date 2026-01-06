import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  it("renders tooltip when show is true", () => {
    render(<Tooltip text="Test tooltip" show={true} />);
    expect(screen.getByText("Test tooltip")).toBeInTheDocument();
  });

  it("does not render tooltip when show is false", () => {
    const { container } = render(<Tooltip text="Test tooltip" show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("applies correct classes", () => {
    render(<Tooltip text="Test tooltip" show={true} />);
    const tooltip = screen.getByText("Test tooltip");
    expect(tooltip).toHaveClass(
      "bg-[#212121]",
      "text-[#F9F9F9]",
      "text-xs",
      "font-normal"
    );
  });

  it("renders arrow indicator", () => {
    render(<Tooltip text="Test tooltip" show={true} />);
    const container = screen.getByText("Test tooltip").parentElement;
    expect(container).toHaveClass("absolute", "bottom-full");
  });
});

