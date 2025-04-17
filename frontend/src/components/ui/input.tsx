import React from 'react';
import { Form } from 'react-bootstrap';

export interface InputProps {
  type?: string;
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  label?: string;
  name?: string;
  size?: 'sm' | 'lg';
  disabled?: boolean;
  readOnly?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, id, ...props }, ref) => {
    return (
      <>
        {label && <Form.Label htmlFor={id}>{label}</Form.Label>}
        <Form.Control
          ref={ref}
          type={type}
          id={id}
          className={className}
          {...props}
        />
      </>
    );
  }
);
Input.displayName = "Input";

export { Input }; 