//  Formats a number to string without unnecessary decimals
export const formatNumber = (num: number): string => {
  const rounded = Math.round(num * 1000000000) / 1000000000;
  const str = String(rounded);
  if (rounded === 0) {
    return "0";
  }
  return str.replace(/\.0+$/, "").replace(/\.$/, "");
};

// Extracts a valid number from a string input
export const extractValidNumber = (str: string): number | null => {
  if (!str || str.trim() === "") {
    return null;
  }

  const cleaned = str.replace(/,/g, ".");

  if (!/^-?\d/.test(cleaned)) {
    return null;
  }

  const dotCount = (cleaned.match(/\./g) || []).length;
  if (dotCount > 1) {
    return null;
  }

  const match = cleaned.match(/^-?\d+\.?\d*/);
  if (!match) {
    return null;
  }

  const validPart = match[0];

  const parsed = parseFloat(validPart);
  return isNaN(parsed) ? null : parsed;
};

//  Rounds a number to avoid floating point precision issues
export const roundNumber = (num: number): number => {
  return Math.round(num * 1000000000) / 1000000000;
};
