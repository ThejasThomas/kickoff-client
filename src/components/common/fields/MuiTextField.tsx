import type { Theme } from "@emotion/react";
import { TextField, type SxProps } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface MuiTextFieldProps {
  id: string;
  name: string;
  type?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  isPassword?: boolean;
  className?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  sx?: SxProps<Theme>;
}

export const MuiTextField: React.FC<MuiTextFieldProps> = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  disabled = false,
  className,
  onChange,
  onBlur,
  error,
  helperText,
  fullWidth,
  variant,
  isPassword = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      id={id}
      name={name}
      type={isPassword && showPassword ? "text" : type}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant={variant ?? "outlined"}
      slotProps={{
        input: {
          endAdornment: isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-500 hover:text-black focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          ) : null,
          sx:
            type === "number"
              ? {
                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  "&[type=number]": {
                    MozAppearance: "textfield",
                  },
                }
              : {},
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": { borderColor: "var(--yellow)" },
          "&.Mui-focused fieldset": { borderColor: "var(--yellow)" },
        },
        "& .MuiInputLabel-root.Mui-focused": { color: "var(--yellow)" },
        "& .MuiFormHelperText-root": {
          fontSize: "0.75rem",
          lineHeight: "1rem",
          minHeight: "1rem",
        },
      }}
      className={className}
    />
  );
};
