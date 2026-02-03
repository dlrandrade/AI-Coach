
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'w-full px-6 py-3 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide';
  
  const variantClasses = {
    primary: 'bg-brand-dark text-white hover:bg-brand-secondary focus:ring-brand-dark',
    secondary: 'bg-white text-brand-dark border border-gray-300 hover:bg-brand-light focus:ring-brand-secondary',
    accent: 'bg-brand-accent text-white hover:opacity-90 focus:ring-brand-accent',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
