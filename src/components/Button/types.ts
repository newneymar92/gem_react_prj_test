import { ReactNode } from 'react';

export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  variant?: 'unit' | 'icon';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

