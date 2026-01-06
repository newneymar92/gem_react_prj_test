import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Input from "./Input";

describe("Input", () => {
  it("renders input with value", () => {
    render(<Input value="test" onChange={vi.fn()} />);
    const input = screen.getByDisplayValue("test");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("calls onFocus when focused", () => {
    const handleFocus = vi.fn();
    render(<Input value="" onChange={vi.fn()} onFocus={handleFocus} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("calls onBlur when blurred", () => {
    const handleBlur = vi.fn();
    render(<Input value="" onChange={vi.fn()} onBlur={handleBlur} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("calls onMouseEnter and onMouseLeave", () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <Input
        value=""
        onChange={vi.fn()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );
    
    const input = screen.getByRole("textbox");
    fireEvent.mouseEnter(input);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(input);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("applies disabled state", () => {
    render(<Input value="" onChange={vi.fn()} disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("applies placeholder", () => {
    render(<Input value="" onChange={vi.fn()} placeholder="Enter value" />);
    const input = screen.getByPlaceholderText("Enter value");
    expect(input).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Input value="" onChange={vi.fn()} className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });
});

