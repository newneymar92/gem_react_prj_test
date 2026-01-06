import { SlidingIndicatorProps } from "./types";

const SlidingIndicator = ({ selectedUnit }: SlidingIndicatorProps) => {
  return (
    <div
      className={`absolute top-0.5 h-8 bg-[#424242] rounded-md transition-transform duration-300 ease-in-out ${
        selectedUnit === "%" ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "calc(50% - 0.125rem)" }}
    />
  );
};

export default SlidingIndicator;

