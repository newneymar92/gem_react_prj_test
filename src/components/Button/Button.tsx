import { ButtonProps } from './types';

const Button = ({
  onClick,
  disabled = false,
  children,
  className = '',
  variant = 'unit',
  onMouseEnter,
  onMouseLeave,
}: ButtonProps) => {
  const baseClasses = 'flex items-center justify-center transition-colors duration-200';
  
  const variantClasses = {
    unit: 'relative flex-1 h-8 rounded-md z-10',
    icon: 'w-9 h-9',
  };

  const disabledClasses = disabled ? 'opacity-50' : '';
  const hoverClasses = !disabled && variant === 'icon' ? 'hover:bg-[#3B3B3B]' : '';

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${hoverClasses} ${className}`.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
};

export default Button;

