import type { ButtonHTMLAttributes, FC } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md";
};

const base = "btn";
const variantClass = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

const sizeClass = {
  sm: "btn-sm",
  md: "",
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    />
  );
};

export default Button;
