
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-brand-dark-light border border-brand-dark-lighter rounded-lg px-4 py-3 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-purple"
        {...props}
      />
    </div>
  );
};

export default Input;
