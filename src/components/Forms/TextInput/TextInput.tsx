import React from "react";
import {
  TextInputContainer,
  TextInputField,
  ErrorMessage,
} from "./TextInput.styled";

interface TextInputProps {
  sx?: any;
  type: string;
  id: string;
  label?: string;
  name: string;
  placeholder: string;
  variant: string;
  required: boolean;
  error: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  helperText: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  sx,
  type,
  id,
  label,
  name,
  placeholder,
  required,
  error,
  value,
  onChange,
  onBlur,
  helperText,
}) => {
  return (
    <TextInputContainer sx={sx}>
      {label && <label htmlFor={id}>{label}</label>}
      <TextInputField
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <ErrorMessage>{helperText}</ErrorMessage>}
    </TextInputContainer>
  );
};
