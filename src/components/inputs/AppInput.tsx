"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";

export interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
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
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="mb-3 w-100">
        {label && (
          <label htmlFor={inputId} className="form-label d-block mb-1">
            <AppTypography variant="label" tone="secondary">
              {label}
            </AppTypography>
          </label>
        )}
        <div className="position-relative">
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
            className={cn(
              "form-control rounded-3 py-2 px-3 transition-colors",
              icon && iconPosition === "start" && "ps-5",
              icon && iconPosition === "end" && "pe-5",
              error && "is-invalid border-danger",
              className
            )}
            style={{
              backgroundColor: "var(--app-surface)",
              borderColor: error ? "var(--app-danger)" : "var(--app-border)",
              color: "var(--app-text-primary)",
            }}
            {...props}
          />
          {icon && iconPosition === "end" && (
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary d-flex align-items-center pointer-events-none"
              style={{ zIndex: 4 }}
            >
              {icon}
            </span>
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
