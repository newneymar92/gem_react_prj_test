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
  const { min = 0, max, previousValidValue } = options;

  if (numValue === null) {
    return currentValue;
  }

  const validatedValue = roundNumber(numValue);

  if (validatedValue < min) {
    return min;
  }

  if (max !== undefined && validatedValue > max) {
    return previousValidValue !== undefined ? previousValidValue : max;
  }

  return validatedValue;
};
