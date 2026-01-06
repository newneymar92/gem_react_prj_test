import { roundNumber } from "./numberUtils";

export interface ValidateValueOptions {
  min?: number;
  max?: number;
  previousValidValue?: number;
}

//  Validates and formats a numeric value
export const validateAndFormatValue = (
  numValue: number | null,
  currentValue: number,
  options: ValidateValueOptions = {}
): number => {
  const { min = 0, max } = options;

  if (numValue === null) {
    return currentValue;
  }

  const validatedValue = roundNumber(numValue);

  if (validatedValue < min) {
    return min;
  }

  if (max !== undefined && validatedValue > max) {
    // Clamp to max when value exceeds max (user entered a valid but out-of-range value)
    return max;
  }

  return validatedValue;
};
