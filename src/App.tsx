import { useState, useEffect, useRef } from "react";
import SectionTitle from "./components/SectionTitle/SectionTitle";
import Button from "./components/Button/Button";
import SlidingIndicator from "./components/UnitSelector/SlidingIndicator";
import Tooltip from "./components/Tooltip/Tooltip";
import Input from "./components/Input/Input";
import {
  formatNumber,
  extractValidNumber,
  roundNumber,
} from "./utils/numberUtils";
import { validateAndFormatValue } from "./utils/validationUtils";
import MinusIcon from "./icons/minus.svg?react";
import PlusIcon from "./icons/plus.svg?react";

const App = () => {
  const [selectedUnit, setSelectedUnit] = useState<"%" | "px">("%");
  const [value, setValue] = useState(1.0);
  const [inputValue, setInputValue] = useState("1");
  const [inputState, setInputState] = useState({
    isFocused: false,
    isHovered: false,
  });
  const [hoveredElement, setHoveredElement] = useState<
    "input" | "minus" | "plus" | null
  >(null);
  const previousValidValueRef = useRef(1.0);

  // Handle unit switch
  const handleUnitChange = (newUnit: "%" | "px") => {
    if (newUnit === "%" && value > 100) {
      const clampedValue = 100;
      setValue(clampedValue);
      setInputValue(formatNumber(clampedValue));
      previousValidValueRef.current = clampedValue;
    }
    setSelectedUnit(newUnit);
  };

  // Handle value change (increase or decrease)
  const handleValueChange = (step: number) => {
    const currentNumValue = extractValidNumber(inputValue) ?? value;
    let newValue = roundNumber(currentNumValue + step);

    newValue = Math.max(0, newValue);

    if (selectedUnit === "%" && newValue > 100) {
      newValue = 100;
    }

    previousValidValueRef.current = newValue;
    setValue(newValue);
    setInputValue(formatNumber(newValue));
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newInput = e.target.value;
    newInput = newInput.replace(/,/g, ".");
    setInputValue(newInput);

    // Try to extract valid number for real-time validation
    const numValue = extractValidNumber(newInput);
    if (numValue !== null) {
      setValue(numValue);
    }
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setInputState((prev) => ({ ...prev, isFocused: false }));

    const numValue = extractValidNumber(e.target.value);

    const valueToValidate =
      numValue !== null ? numValue : previousValidValueRef.current;
    const currentValueForValidation =
      numValue !== null ? value : previousValidValueRef.current;

    if (numValue !== null) {
      const roundedValue = roundNumber(numValue);
      if (roundedValue >= 0 && (selectedUnit === "px" || roundedValue <= 100)) {
        previousValidValueRef.current = roundedValue;
      }
    }

    const validatedValue = validateAndFormatValue(
      valueToValidate,
      currentValueForValidation,
      {
        min: 0,
        max: selectedUnit === "%" ? 100 : undefined,
      }
    );

    const formattedValue = formatNumber(validatedValue);
    setInputValue(formattedValue);
    setValue(validatedValue);
    previousValidValueRef.current = validatedValue;
  };

  // Update previous valid value when value changes (but not during input)
  useEffect(() => {
    if (
      !inputState.isFocused &&
      value >= 0 &&
      (selectedUnit === "px" || value <= 100)
    ) {
      previousValidValueRef.current = value;
    }
  }, [value, inputState.isFocused, selectedUnit]);

  // Also update previousValidValue when value reaches 100 (for % unit)
  useEffect(() => {
    if (selectedUnit === "%" && value === 100) {
      previousValidValueRef.current = 100;
    }
  }, [value, selectedUnit]);

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-neutral-800 p-4 rounded-lg">
        <div className="flex flex-col gap-4 p-4 bg-[#151515]">
          {/* Unit Section */}
          <div className="flex items-center gap-2 w-[248px]">
            <SectionTitle text="Unit" />
            <div className="relative flex gap-0.5 p-0.5 bg-[#212121] rounded-lg w-[140px]">
              {/* Sliding background indicator */}
              <SlidingIndicator selectedUnit={selectedUnit} />
              {/* % Button */}
              <Button onClick={() => handleUnitChange("%")} variant="unit">
                <span
                  className={`text-xs font-medium leading-[1.67] transition-colors duration-300 ease-in-out ${
                    selectedUnit === "%" ? "text-[#F9F9F9]" : "text-[#AAAAAA]"
                  }`}
                >
                  %
                </span>
              </Button>
              {/* px Button */}
              <Button onClick={() => handleUnitChange("px")} variant="unit">
                <span
                  className={`text-xs font-medium leading-[1.67] transition-colors duration-300 ease-in-out ${
                    selectedUnit === "px" ? "text-[#F9F9F9]" : "text-[#AAAAAA]"
                  }`}
                >
                  px
                </span>
              </Button>
            </div>
          </div>

          {/* Value Section */}
          <div className="flex items-center gap-2 w-[248px]">
            <SectionTitle text="Value" />
            <div
              className={`flex items-center rounded-lg w-[140px] h-9 transition-all duration-200 ${
                inputState.isFocused
                  ? "bg-[#212121] shadow-[0_0_0_1px_#3C67FF]"
                  : inputState.isHovered
                    ? "bg-[#3B3B3B]"
                    : "bg-[#212121]"
              } `}
            >
              <div
                className="relative"
                onMouseEnter={() => setHoveredElement("minus")}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {/* Minus Button */}
                <Button
                  onClick={() => handleValueChange(-0.1)}
                  disabled={value <= 0}
                  variant="icon"
                  className="rounded-l-lg"
                >
                  <MinusIcon
                    className={
                      value <= 0
                        ? "text-[#AAAAAA] opacity-67"
                        : "text-[#F9F9F9]"
                    }
                  />
                </Button>
                {/* Tooltip */}
                <Tooltip
                  text="Value must greater than 0"
                  show={value <= 0 && hoveredElement === "minus"}
                />
              </div>
              <div className="flex-1 flex items-center justify-center px-2">
                {/* Input */}
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => {
                    setInputState((prev) => ({ ...prev, isFocused: true }));
                    previousValidValueRef.current = value;
                  }}
                  onBlur={handleInputBlur}
                  onMouseEnter={() => {
                    setInputState((prev) => ({ ...prev, isHovered: true }));
                    setHoveredElement("input");
                  }}
                  onMouseLeave={() => {
                    setInputState((prev) => ({ ...prev, isHovered: false }));
                    setHoveredElement(null);
                  }}
                />
              </div>
              <div
                className="relative"
                onMouseEnter={() => setHoveredElement("plus")}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {/* Plus Button */}
                <Button
                  onClick={() => handleValueChange(0.1)}
                  disabled={selectedUnit === "%" ? value >= 100 : false}
                  variant="icon"
                  className="rounded-r-lg"
                >
                  <PlusIcon
                    className={
                      selectedUnit === "%" && value >= 100
                        ? "text-[#AAAAAA] opacity-67"
                        : "text-[#F9F9F9]"
                    }
                  />
                </Button>
                {/* Tooltip */}
                <Tooltip
                  text="Value must smaller than 100"
                  show={
                    selectedUnit === "%" &&
                    value >= 100 &&
                    hoveredElement === "plus"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
