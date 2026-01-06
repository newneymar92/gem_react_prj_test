import { useState, useEffect } from 'react'

const App = () => {
  const [selectedUnit, setSelectedUnit] = useState<'%' | 'px'>('%')
  const [isInputHovered, setIsInputHovered] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [value, setValue] = useState(1.0)
  const [inputValue, setInputValue] = useState('1')
  const [isMinusButtonHovered, setIsMinusButtonHovered] = useState(false)
  const [isPlusButtonHovered, setIsPlusButtonHovered] = useState(false)
  const [previousValidValue, setPreviousValidValue] = useState(1.0)

  // Helper function to format number without unnecessary decimals
  const formatNumber = (num: number): string => {
    // Round to avoid floating point precision issues
    const rounded = Math.round(num * 1000000000) / 1000000000
    // Convert to string
    const str = String(rounded)
    // If it's exactly 0, return '0'
    if (rounded === 0) {
      return '0'
    }
    // Remove trailing zeros after decimal point, but keep the number
    return str.replace(/\.0+$/, '').replace(/\.$/, '')
  }

  // Helper function to extract valid number from string
  const extractValidNumber = (str: string): number | null => {
    if (!str || str.trim() === '') {
      return null
    }
    
    // Replace comma with dot
    let cleaned = str.replace(/,/g, '.')
    
    // Check if input starts with non-numeric character (except minus)
    // If so, return null to use closest valid value
    if (!/^-?\d/.test(cleaned)) {
      return null
    }
    
    // Check for multiple dots - if more than one dot, return null to use closest valid value
    const dotCount = (cleaned.match(/\./g) || []).length
    if (dotCount > 1) {
      return null
    }
    
    // Extract valid number pattern: optional minus, digits, optional dot and digits
    // Stop at first invalid character
    const match = cleaned.match(/^-?\d+\.?\d*/)
    if (!match) {
      // If no valid number found at start, return null
      return null
    }
    
    // Get the matched part
    let validPart = match[0]
    
    // Try to parse
    const parsed = parseFloat(validPart)
    return isNaN(parsed) ? null : parsed
  }

  // Validate and format value
  const validateAndFormatValue = (numValue: number | null, currentValue: number): number => {
    if (numValue === null) {
      return currentValue
    }
    
    // Round to avoid floating point precision issues
    numValue = Math.round(numValue * 1000000000) / 1000000000
    
    // If < 0, set to 0
    if (numValue < 0) {
      return 0
    }
    
    // If unit is % and > 100, revert to previous valid value
    // But allow exactly 100 (with small tolerance for floating point)
    if (selectedUnit === '%' && numValue > 100.0000001) {
      return previousValidValue
    }
    
    // If value is valid (0 or within range), return it
    return numValue
  }

  // Handle unit switch
  const handleUnitChange = (newUnit: '%' | 'px') => {
    if (newUnit === '%' && value > 100) {
      const clampedValue = 100
      setValue(clampedValue)
      setInputValue(formatNumber(clampedValue))
      setPreviousValidValue(clampedValue)
    }
    setSelectedUnit(newUnit)
  }

  // Update previous valid value when value changes (but not during input)
  useEffect(() => {
    if (!isInputFocused && value >= 0 && (selectedUnit === 'px' || value <= 100)) {
      setPreviousValidValue(value)
    }
  }, [value, isInputFocused, selectedUnit])

  // Also update previousValidValue when value reaches 100 (for % unit)
  useEffect(() => {
    if (selectedUnit === '%' && value === 100) {
      setPreviousValidValue(100)
    }
  }, [value, selectedUnit])

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-neutral-800 p-4 rounded-lg">
        <div className="flex flex-col gap-4 p-4 bg-[#151515] rounded">
          {/* Unit Section */}
          <div className="flex items-center gap-2 w-[248px]">
            <div className="flex items-center gap-1 h-9 flex-1">
              <span className="text-[#AAAAAA] text-xs font-normal leading-[1.67]">Unit</span>
            </div>
            <div className="relative flex gap-0.5 p-0.5 bg-[#212121] rounded-lg w-[140px]">
              {/* Sliding background indicator */}
              <div
                className={`absolute top-0.5 h-8 bg-[#424242] rounded-md transition-transform duration-300 ease-in-out ${selectedUnit === '%' ? 'translate-x-0' : 'translate-x-full'
                  }`}
                style={{ width: 'calc(50% - 0.125rem)' }}
              />
              <button
                onClick={() => handleUnitChange('%')}
                className="relative flex-1 h-8 rounded-md flex items-center justify-center z-10"
              >
                <span className={`text-xs font-medium leading-[1.67] transition-colors duration-300 ease-in-out ${selectedUnit === '%' ? 'text-[#F9F9F9]' : 'text-[#AAAAAA]'}`}>%</span>
              </button>
              <button
                onClick={() => handleUnitChange('px')}
                className="relative flex-1 h-8 rounded-md flex items-center justify-center z-10"
              >
                <span className={`text-xs font-medium leading-[1.67] transition-colors duration-300 ease-in-out ${selectedUnit === 'px' ? 'text-[#F9F9F9]' : 'text-[#AAAAAA]'}`}>px</span>
              </button>
            </div>
          </div>

          {/* Value Section */}
          <div className="flex items-center gap-2 w-[248px]">
            <div className="flex items-center gap-1 h-9 flex-1">
              <span className="text-[#AAAAAA] text-xs font-normal leading-[1.67]">Value</span>
            </div>
            <div className={`flex items-center rounded-lg w-[140px] h-9 transition-all duration-200 ${isInputFocused
              ? 'bg-[#212121] shadow-[0_0_0_1px_#3C67FF]'
              : isInputHovered
                ? 'bg-[#3B3B3B]'
                : 'bg-[#212121]'
              } `}>
              <div
                className="relative"
                onMouseEnter={() => setIsMinusButtonHovered(true)}
                onMouseLeave={() => setIsMinusButtonHovered(false)}
              >
                <button
                  onClick={() => {
                    const currentNumValue = extractValidNumber(inputValue) ?? value
                    let newValue = currentNumValue - 0.1
                    // Round to avoid floating point precision issues
                    newValue = Math.round(newValue * 1000000000) / 1000000000
                    newValue = Math.max(0, newValue)
                    // Update previousValidValue to the new value
                    setPreviousValidValue(newValue)
                    setValue(newValue)
                    setInputValue(formatNumber(newValue))
                  }}
                  disabled={value <= 0}
                  className={`w-9 h-9 flex items-center justify-center rounded-l-lg transition-colors duration-200 ${value <= 0
                    ? 'opacity-50'
                    : 'hover:bg-[#3B3B3B]'
                    }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={value <= 0 ? 'text-[#AAAAAA] opacity-67' : 'text-[#F9F9F9]'}>
                    <path d="M4 6H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {value <= 0 && isMinusButtonHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                    <div className="bg-[#212121] text-[#F9F9F9] text-xs font-normal leading-[1.67] px-2 py-1 rounded-lg whitespace-nowrap h-[26px] flex items-center">
                      Value must greater than 0
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                        <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[#212121]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 flex items-center justify-center px-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    let newInput = e.target.value
                    // Replace comma with dot
                    newInput = newInput.replace(/,/g, '.')
                    setInputValue(newInput)
                    
                    // Try to extract valid number for real-time validation
                    const numValue = extractValidNumber(newInput)
                    if (numValue !== null) {
                      setValue(numValue)
                    }
                  }}
                  onMouseEnter={() => setIsInputHovered(true)}
                  onMouseLeave={() => setIsInputHovered(false)}
                  onFocus={() => {
                    setIsInputFocused(true)
                    setPreviousValidValue(value)
                  }}
                  onBlur={(e) => {
                    setIsInputFocused(false)
                    const numValue = extractValidNumber(e.target.value)
                    if (numValue !== null) {
                      // Round to avoid floating point precision issues
                      const roundedValue = Math.round(numValue * 1000000000) / 1000000000
                      // Update previousValidValue before validation if value is valid
                      if (roundedValue >= 0 && (selectedUnit === 'px' || roundedValue <= 100)) {
                        setPreviousValidValue(roundedValue)
                      }
                    }
                    const validatedValue = validateAndFormatValue(numValue, value)
                    setInputValue(formatNumber(validatedValue))
                    setValue(validatedValue)
                    setPreviousValidValue(validatedValue)
                  }}
                  className="w-full text-[#F9F9F9] text-xs font-normal leading-[1.67] text-center bg-transparent border-none outline-none focus:outline-none"
                />
              </div>
              <div
                className="relative"
                onMouseEnter={() => setIsPlusButtonHovered(true)}
                onMouseLeave={() => setIsPlusButtonHovered(false)}
              >
                <button
                  onClick={() => {
                    const currentNumValue = extractValidNumber(inputValue) ?? value
                    let newValue = currentNumValue + 0.1
                    // Round to avoid floating point precision issues
                    newValue = Math.round(newValue * 1000000000) / 1000000000
                    if (selectedUnit === '%' && newValue > 100) {
                      newValue = 100
                    }
                    // Update previousValidValue to the new value
                    setPreviousValidValue(newValue)
                    setValue(newValue)
                    setInputValue(formatNumber(newValue))
                  }}
                  disabled={selectedUnit === '%' ? value >= 100 : false}
                  className={`w-9 h-9 flex items-center justify-center rounded-r-lg transition-colors duration-200 ${(selectedUnit === '%' && value >= 100)
                    ? 'opacity-50'
                    : 'hover:bg-[#3B3B3B]'
                    }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={(selectedUnit === '%' && value >= 100) ? 'text-[#AAAAAA] opacity-67' : 'text-[#F9F9F9]'}>
                    <path d="M6 4V8M4 6H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {selectedUnit === '%' && value >= 100 && isPlusButtonHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                    <div className="bg-[#212121] text-[#F9F9F9] text-xs font-normal leading-[1.67] px-2 py-1 rounded-lg whitespace-nowrap h-[26px] flex items-center">
                      Value must smaller than 100
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                        <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[#212121]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
