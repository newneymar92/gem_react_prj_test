import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("renders button with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies disabled state correctly", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText("Disabled Button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50");
  });

  it("applies unit variant classes", () => {
    render(<Button variant="unit">Unit Button</Button>);
    const button = screen.getByText("Unit Button");
    expect(button).toHaveClass("relative", "flex-1", "h-8", "rounded-md", "z-10");
  });

  it("applies icon variant classes", () => {
    render(<Button variant="icon">Icon Button</Button>);
    const button = screen.getByText("Icon Button");
    expect(button).toHaveClass("w-9", "h-9");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByText("Custom Button");
    expect(button).toHaveClass("custom-class");
  });

  it("calls onMouseEnter and onMouseLeave", () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Hover Button
      </Button>
    );
    
    const button = screen.getByText("Hover Button");
    fireEvent.mouseEnter(button);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(button);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );
    
    fireEvent.click(screen.getByText("Disabled Button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

