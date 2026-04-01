import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className = "", onClick }: CardProps) => {
  const hasBg = className.includes('bg-');
  return (
    <div 
      onClick={onClick}
      className={`
        rounded-[32px] p-6 
        ${!hasBg ? 'bg-white' : ''} 
        ${onClick ? 'cursor-pointer active:scale-[0.98] hover:shadow-md transition-all duration-300' : 'shadow-sm'} 
        border border-black/5 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
