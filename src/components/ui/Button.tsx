import type { ButtonHTMLAttributes } from "react";
export function Button({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`action ${className}`} {...props}>
      {children}
    </button>
  );
}
