import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import * as React from "react";
import { afterEach, vi } from "vitest";

// Mock SVG imports - define MockSVG inside factory function
vi.mock("../icons/minus.svg?react", () => {
  const MockSVG = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return React.createElement("svg", {
      viewBox: "0 0 12 12",
      className,
      "data-testid": "mock-svg",
      ...props,
    });
  };
  return {
    default: MockSVG,
  };
});

vi.mock("../icons/plus.svg?react", () => {
  const MockSVG = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return React.createElement("svg", {
      viewBox: "0 0 12 12",
      className,
      "data-testid": "mock-svg",
      ...props,
    });
  };
  return {
    default: MockSVG,
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
