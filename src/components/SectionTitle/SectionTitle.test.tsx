import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SectionTitle from "./SectionTitle";

describe("SectionTitle", () => {
  it("renders text correctly", () => {
    render(<SectionTitle text="Unit" />);
    expect(screen.getByText("Unit")).toBeInTheDocument();
  });

  it("applies correct classes", () => {
    render(<SectionTitle text="Value" />);
    const container = screen.getByText("Value").parentElement;
    expect(container).toHaveClass(
      "flex",
      "items-center",
      "gap-1",
      "h-9",
      "flex-1"
    );
  });

  it("renders span with correct text color", () => {
    render(<SectionTitle text="Test Title" />);
    const span = screen.getByText("Test Title");
    expect(span).toHaveClass(
      "text-[#AAAAAA]",
      "text-xs",
      "font-normal",
      "leading-[1.67]"
    );
  });
});

