import { describe, it, expect } from "vitest";
import { formatNumber, extractValidNumber, roundNumber } from "./numberUtils";

describe("numberUtils", () => {
  describe("formatNumber", () => {
    it("formats integer correctly", () => {
      expect(formatNumber(123)).toBe("123");
    });

    it("formats decimal correctly", () => {
      expect(formatNumber(123.45)).toBe("123.45");
    });

    it("removes trailing zeros", () => {
      expect(formatNumber(123.0)).toBe("123");
      expect(formatNumber(123.10)).toBe("123.1");
    });

    it("handles zero", () => {
      expect(formatNumber(0)).toBe("0");
    });

    it("handles negative numbers", () => {
      expect(formatNumber(-123.45)).toBe("-123.45");
    });
  });

  describe("extractValidNumber", () => {
    it("extracts valid integer", () => {
      expect(extractValidNumber("123")).toBe(123);
    });

    it("extracts valid decimal", () => {
      expect(extractValidNumber("123.45")).toBe(123.45);
    });

    it("replaces comma with dot", () => {
      expect(extractValidNumber("123,45")).toBe(123.45);
    });

    it("extracts number from string with text", () => {
      expect(extractValidNumber("123abc")).toBe(123);
    });

    it("returns null for invalid input starting with letter", () => {
      expect(extractValidNumber("a123")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(extractValidNumber("")).toBeNull();
      expect(extractValidNumber("   ")).toBeNull();
    });

    it("returns null for multiple dots", () => {
      expect(extractValidNumber("12.3.4")).toBeNull();
    });

    it("handles negative numbers", () => {
      expect(extractValidNumber("-123")).toBe(-123);
    });

    it("handles decimal starting with dot", () => {
      expect(extractValidNumber(".5")).toBe(0.5);
    });
  });

  describe("roundNumber", () => {
    it("rounds floating point precision issues", () => {
      const result = roundNumber(0.1 + 0.2);
      expect(result).toBeCloseTo(0.3, 10);
    });

    it("handles integers", () => {
      expect(roundNumber(123)).toBe(123);
    });

    it("handles decimals", () => {
      expect(roundNumber(123.456789)).toBe(123.456789);
    });
  });
});

