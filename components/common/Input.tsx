
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
