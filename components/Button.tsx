import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
};

const base = 'btn';
const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const sizeClass = {
  sm: 'btn-sm',
  md: '',
};

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return <button {...props} className={`${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`} />;
}
