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

  it("switches unit from % to px", async () => {
    render(<App />);
    const pxSpan = screen.getByText("px");
    const pxButton = pxSpan.closest("button");
    
    fireEvent.click(pxButton!);
    
    // Check if px button is now active (has active class)
    await waitFor(() => {
      expect(pxSpan).toHaveClass("text-[#F9F9F9]");
    });
  });

  it("switches unit from px to %", async () => {
    render(<App />);
    const pxSpan = screen.getByText("px");
    const percentSpan = screen.getByText("%");
    const pxButton = pxSpan.closest("button");
    const percentButton = percentSpan.closest("button");
    
    // Switch to px first
    fireEvent.click(pxButton!);
    
    await waitFor(() => {
      expect(pxSpan).toHaveClass("text-[#F9F9F9]");
    });
    
    // Then switch back to %
    fireEvent.click(percentButton!);
    
    await waitFor(() => {
      expect(percentSpan).toHaveClass("text-[#F9F9F9]");
    });
  });

  it("clamps value to 100 when switching to % unit with value > 100", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Switch to px (to allow > 100)
    const pxSpan = screen.getByText("px");
    const pxButton = pxSpan.closest("button");
    fireEvent.click(pxButton!);
    
    await waitFor(() => {
      expect(pxSpan).toHaveClass("text-[#F9F9F9]");
    });
    
    // Set value to 150 in px
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveValue("150");
    });
    
    // Switch back to %
    const percentSpan = screen.getByText("%");
    const percentButton = percentSpan.closest("button");
    fireEvent.click(percentButton!);
    
    await waitFor(() => {
      expect(input).toHaveValue("100");
    });
  });

  it("increases value when plus button is clicked", async () => {
    render(<App />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    const initialValue = parseFloat(input.value || "1");
    
    // Find plus button by finding the button containing PlusIcon
    const buttons = screen.getAllByRole("button");
    const plusButton = buttons.find((btn) => 
      btn.querySelector('svg[viewBox="0 0 12 12"]') &&
      btn.className.includes("rounded-r-lg")
    );
    
    expect(plusButton).toBeDefined();
    if (plusButton) {
      fireEvent.click(plusButton);
      
      await waitFor(() => {
        const newValue = parseFloat(input.value || "0");
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
    
    await waitFor(() => {
      expect(input).toHaveValue("2");
    });
    
    // Find minus button
    const buttons = screen.getAllByRole("button");
    const minusButton = buttons.find((btn) => 
      btn.querySelector('svg[viewBox="0 0 12 12"]') && 
      btn.className.includes("rounded-l-lg")
    );
    
    expect(minusButton).toBeDefined();
    if (minusButton) {
      fireEvent.click(minusButton);
      
      await waitFor(() => {
        const newValue = parseFloat((input as HTMLInputElement).value || "0");
        expect(newValue).toBeLessThan(2);
      });
    }
  });

  it("disables minus button when value is 0", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set value to 0
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      const minusButton = buttons.find((btn) => 
        btn.className.includes("rounded-l-lg")
      );
      expect(minusButton).toBeDisabled();
    });
  });

  it("disables plus button when value is 100 in % unit", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set value to 100
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      const plusButton = buttons.find((btn) => 
        btn.className.includes("rounded-r-lg")
      );
      expect(plusButton).toBeDisabled();
    });
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
    const input = screen.getByRole("textbox") as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "12,5" } });
    fireEvent.blur(input);
    
    // Should convert comma to dot and format
    await waitFor(() => {
      expect(input.value).toBe("12.5");
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

  it("reverts to previous valid value when > 100 in % unit", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set initial value to 50
    fireEvent.change(input, { target: { value: "50" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveValue("50");
    });
    
    // Enter value > 100
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    
    // Should revert to previous valid value (50)
    await waitFor(() => {
      expect(input).toHaveValue("50");
    });
  });

  it("allows value > 100 in px unit", async () => {
    render(<App />);
    const pxSpan = screen.getByText("px");
    const pxButton = pxSpan.closest("button");
    fireEvent.click(pxButton!);
    
    await waitFor(() => {
      expect(pxSpan).toHaveClass("text-[#F9F9F9]");
    });
    
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveValue("150");
    });
  });

  it("shows tooltip when minus button is hovered and value is 0", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set value to 0
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveValue("0");
    });
    
    const buttons = screen.getAllByRole("button");
    const minusButtonContainer = buttons
      .find((btn) => btn.className.includes("rounded-l-lg"))
      ?.closest("div");
    
    if (minusButtonContainer) {
      fireEvent.mouseEnter(minusButtonContainer);
      await waitFor(() => {
        expect(screen.getByText("Value must greater than 0")).toBeInTheDocument();
      });
    }
  });

  it("shows tooltip when plus button is hovered and value is 100 in % unit", async () => {
    render(<App />);
    const input = screen.getByRole("textbox");
    
    // Set value to 100
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveValue("100");
    });
    
    const buttons = screen.getAllByRole("button");
    const plusButtonContainer = buttons
      .find((btn) => btn.className.includes("rounded-r-lg"))
      ?.closest("div");
    
    if (plusButtonContainer) {
      fireEvent.mouseEnter(plusButtonContainer);
      await waitFor(() => {
        expect(screen.getByText("Value must smaller than 100")).toBeInTheDocument();
      });
    }
  });
});
