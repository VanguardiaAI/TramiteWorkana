import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-success' | 'outline-light' | 'outline-dark' | 'link';
  size?: 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size, children, ...props }, ref) => {
    return (
      <BootstrapButton
        ref={ref as any}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {children}
      </BootstrapButton>
    );
  }
);

Button.displayName = "Button";

export { Button }; 