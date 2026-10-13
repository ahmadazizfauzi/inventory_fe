"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";
import { Eye, EyeOff } from "lucide-react";

export interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  wrapperClassName?: string;
  showPasswordToggle?: boolean;
}

const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      icon,
      iconPosition = "start",
      id,
      disabled,
      wrapperClassName,
      type = "text",
      showPasswordToggle,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const hasCustomMargin = wrapperClassName && /(^|\s)m[btseaxy]?-?\d/.test(wrapperClassName);

    const isPasswordType = type === "password";
    const enablePasswordToggle = showPasswordToggle ?? isPasswordType;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const effectiveType = isPasswordType && enablePasswordToggle
      ? (isPasswordVisible ? "text" : "password")
      : type;

    return (
      <div className={cn(!hasCustomMargin && "mb-3", "w-100", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="form-label d-block mb-1">
            <AppTypography variant="label" tone="secondary">
              {label}
            </AppTypography>
          </label>
        )}
        <div className="position-relative d-flex align-items-center">
          {icon && iconPosition === "start" && (
            <span
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary d-flex align-items-center pointer-events-none"
              style={{ zIndex: 4 }}
            >
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            type={effectiveType}
            className={cn(
              "form-control rounded-3 py-2 px-3 transition-colors",
              icon && iconPosition === "start" && "ps-5",
              (enablePasswordToggle || (icon && iconPosition === "end")) && "pe-5",
              error && "is-invalid border-danger",
              className
            )}
            style={{
              backgroundColor: "var(--app-surface)",
              borderColor: error ? "var(--app-danger)" : "var(--app-border)",
              color: "var(--app-text-primary)",
            }}
            {...props}
            onWheel={(e) => {
              if (effectiveType === "number" || type === "number") {
                (e.target as HTMLElement).blur();
              }
              props.onWheel?.(e);
            }}
          />
          {enablePasswordToggle ? (
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="btn btn-link p-0 position-absolute top-50 end-0 translate-middle-y me-3 text-secondary d-flex align-items-center justify-content-center border-0 shadow-none text-decoration-none"
              style={{
                zIndex: 5,
                color: "var(--app-text-muted)",
                cursor: "pointer",
                width: 24,
                height: 24,
              }}
              tabIndex={-1}
              aria-label={isPasswordVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : (
            icon && iconPosition === "end" && (
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary d-flex align-items-center pointer-events-none"
                style={{ zIndex: 4 }}
              >
                {icon}
              </span>
            )
          )}
        </div>
        {error && (
          <div className="invalid-feedback d-block mt-1">
            <AppTypography variant="caption" tone="danger">
              {error}
            </AppTypography>
          </div>
        )}
        {!error && helperText && (
          <div className="form-text mt-1">
            <AppTypography variant="caption" tone="muted">
              {helperText}
            </AppTypography>
          </div>
        )}
      </div>
    );
  }
);

AppInput.displayName = "AppInput";

export default AppInput;
