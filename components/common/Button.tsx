
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = 'w-full text-center font-semibold rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark';

  const variantClasses = {
    primary: 'bg-brand-purple hover:bg-brand-purple-light text-white focus:ring-brand-purple',
    secondary: 'bg-transparent border border-brand-dark-lighter hover:bg-brand-dark-lighter text-brand-text-secondary focus:ring-brand-dark-lighter',
    ghost: 'bg-transparent hover:bg-brand-dark-lighter text-brand-text-secondary'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
