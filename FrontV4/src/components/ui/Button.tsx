import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'orange' | 'lime';
  className?: string;
  disabled?: boolean;
  icon?: any;
}

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  icon: Icon
}: ButtonProps) => {
  const baseStyles = "flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-natty-teal text-white hover:bg-opacity-90",
    secondary: "bg-natty-lime text-natty-teal hover:bg-opacity-90",
    lime: "bg-natty-lime text-natty-teal hover:bg-opacity-90",
    orange: "bg-natty-orange text-white hover:bg-opacity-90 shadow-lg shadow-natty-orange/20",
    outline: "border-2 border-natty-teal text-natty-teal hover:bg-natty-teal hover:text-white",
    ghost: "text-natty-charcoal hover:bg-black/5"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
      {Icon && <Icon size={20} />}
    </button>
  );
};

export default Button;
