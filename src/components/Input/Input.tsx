import { InputProps } from "./types";

const Input = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  className = "",
  placeholder,
  disabled = false,
}: InputProps) => {
  const baseClassName =
    "w-full text-[#F9F9F9] text-xs font-normal leading-[1.67] text-center bg-transparent border-none outline-none focus:outline-none";
  const combinedClassName = `${baseClassName} ${className}`.trim();

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={combinedClassName}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default Input;
