import { describe, it, expect } from "vitest";
import { validateAndFormatValue } from "./validationUtils";

describe("validationUtils", () => {
  describe("validateAndFormatValue", () => {
    it("returns currentValue when numValue is null", () => {
      expect(validateAndFormatValue(null, 10)).toBe(10);
    });

    it("applies min constraint", () => {
      expect(validateAndFormatValue(-5, 10, { min: 0 })).toBe(0);
      expect(validateAndFormatValue(5, 10, { min: 0 })).toBe(5);
    });

    it("applies max constraint", () => {
      expect(validateAndFormatValue(150, 10, { max: 100 })).toBe(100);
      expect(validateAndFormatValue(50, 10, { max: 100 })).toBe(50);
    });

    it("clamps to max when value exceeds max", () => {
      expect(
        validateAndFormatValue(150, 10, {
          max: 100,
          previousValidValue: 80,
        })
      ).toBe(100);
    });

    it("clamps to max when value exceeds max without previousValidValue", () => {
      expect(validateAndFormatValue(150, 10, { max: 100 })).toBe(100);
    });

    it("handles valid value within range", () => {
      expect(
        validateAndFormatValue(50, 10, { min: 0, max: 100 })
      ).toBe(50);
    });

    it("handles value at boundaries", () => {
      expect(validateAndFormatValue(0, 10, { min: 0, max: 100 })).toBe(0);
      expect(validateAndFormatValue(100, 10, { min: 0, max: 100 })).toBe(100);
    });

    it("handles value without constraints", () => {
      expect(validateAndFormatValue(50, 10)).toBe(50);
    });
  });
});

