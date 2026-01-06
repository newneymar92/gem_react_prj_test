import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SlidingIndicator from "./SlidingIndicator";

describe("SlidingIndicator", () => {
  it("applies translate-x-0 when selectedUnit is %", () => {
    const { container } = render(<SlidingIndicator selectedUnit="%" />);
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass("translate-x-0");
  });

  it("applies translate-x-full when selectedUnit is px", () => {
    const { container } = render(<SlidingIndicator selectedUnit="px" />);
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass("translate-x-full");
  });

  it("applies correct base classes", () => {
    const { container } = render(<SlidingIndicator selectedUnit="%" />);
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass(
      "absolute",
      "top-0.5",
      "h-8",
      "bg-[#424242]",
      "rounded-md"
    );
  });

  it("applies correct style width", () => {
    const { container } = render(<SlidingIndicator selectedUnit="%" />);
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveStyle({ width: "calc(50% - 0.125rem)" });
  });
});

