import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders the app correctly", () => {
    render(<App />);
    expect(screen.getByText("Unit")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("renders unit selector buttons", () => {
    render(<App />);
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("px")).toBeInTheDocument();
  });

  it("switches unit from % to px", () => {
    render(<App />);
    const pxButton = screen.getByText("px").closest("button");
    
    fireEvent.click(pxButton!);
    
    // Check if px button is now active (has active class)
    const pxSpan = screen.getByText("px");
    expect(pxSpan).toHaveClass("text-[#F9F9F9]");
  });

  it("switches unit from px to %", () => {
    render(<App />);
    const pxButton = screen.getByText("px").closest("button");
    const percentButton = screen.getByText("%").closest("button");
    
    // Switch to px first
    fireEvent.click(pxButton!);
    
    // Then switch back to %
    fireEvent.click(percentButton!);
    
    const percentSpan = screen.getByText("%");
    expect(percentSpan).toHaveClass("text-[#F9F9F9]");
  });

  it("clamps value to 100 when switching to % unit with value > 100", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Switch to px (to allow > 100)
    const pxButton = screen.getByText("px").closest("button");
    fireEvent.click(pxButton!);
    
    // Set value to 150 in px
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    
    // Switch back to %
    const percentButton = screen.getByText("%").closest("button");
    fireEvent.click(percentButton!);
    
    await waitFor(() => {
      expect(input).toHaveValue("100");
    });
  });

  it("increases value when plus button is clicked", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    const initialValue = parseFloat((input as HTMLInputElement).value || "1");
    
    // Find plus button by finding the button containing PlusIcon
    const buttons = screen.getAllByRole("button");
    const plusButton = buttons.find((btn) => 
      btn.querySelector('svg[viewBox="0 0 12 12"]') &&
      btn.className.includes("rounded-r-lg")
    );
    
    if (plusButton) {
      fireEvent.click(plusButton);
      
      await waitFor(() => {
        const newValue = parseFloat((input as HTMLInputElement).value || "0");
        expect(newValue).toBeGreaterThan(initialValue);
      });
    }
  });

  it("decreases value when minus button is clicked", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set initial value to 2
    fireEvent.change(input, { target: { value: "2" } });
    fireEvent.blur(input);
    
    // Find minus button
    const buttons = screen.getAllByRole("button");
    const minusButton = buttons.find((btn) => 
      btn.querySelector('svg[viewBox="0 0 12 12"]') && 
      btn.className.includes("rounded-l-lg")
    );
    
    if (minusButton) {
      fireEvent.click(minusButton);
      
      await waitFor(() => {
        const newValue = parseFloat((input as HTMLInputElement).value || "0");
        expect(newValue).toBeLessThan(2);
      });
    }
  });

  it("disables minus button when value is 0", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set value to 0
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.blur(input);
    
    const buttons = screen.getAllByRole("button");
    const minusButton = buttons.find((btn) => 
      btn.className.includes("rounded-l-lg")
    );
    expect(minusButton).toBeDisabled();
  });

  it("disables plus button when value is 100 in % unit", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set value to 100
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);
    
    const buttons = screen.getAllByRole("button");
    const plusButton = buttons.find((btn) => 
      btn.className.includes("rounded-r-lg")
    );
    expect(plusButton).toBeDisabled();
  });

  it("validates and formats input on blur", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Enter invalid input
    fireEvent.change(input, { target: { value: "a123" } });
    fireEvent.blur(input);
    
    // Should revert to previous valid value (1)
    await waitFor(() => {
      expect(input).toHaveValue("1");
    });
  });

  it("handles input with comma and converts to dot", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "12,5" } });
    fireEvent.blur(input);
    
    // Should convert comma to dot and format
    await waitFor(() => {
      expect(input).toHaveValue("12.5");
    });
  });

  it("clamps value to 0 when negative", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "-10" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveValue("0");
    });
  });

  it("clamps value to 100 when > 100 in % unit", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveValue("100");
    });
  });

  it("allows value > 100 in px unit", async () => {
    render(<App />);
    const pxButton = screen.getByText("px").closest("button");
    fireEvent.click(pxButton!);
    
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveValue("150");
    });
  });

  it("shows tooltip when minus button is hovered and value is 0", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set value to 0
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.blur(input);
    
    const buttons = screen.getAllByRole("button");
    const minusButtonContainer = buttons
      .find((btn) => btn.className.includes("rounded-l-lg"))
      ?.closest("div");
    
    if (minusButtonContainer) {
      fireEvent.mouseEnter(minusButtonContainer);
      expect(screen.getByText("Value must greater than 0")).toBeInTheDocument();
    }
  });

  it("shows tooltip when plus button is hovered and value is 100 in % unit", () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set value to 100
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);
    
    const buttons = screen.getAllByRole("button");
    const plusButtonContainer = buttons
      .find((btn) => btn.className.includes("rounded-r-lg"))
      ?.closest("div");
    
    if (plusButtonContainer) {
      fireEvent.mouseEnter(plusButtonContainer);
      expect(screen.getByText("Value must smaller than 100")).toBeInTheDocument();
    }
  });
});
