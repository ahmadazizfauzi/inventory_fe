"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";

export interface AppSelectOption {
  value: string | number;
  label: string;
}

export interface AppSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: AppSelectOption[];
}

const AppSelect = forwardRef<HTMLSelectElement, AppSelectProps>(
  ({ className, label, helperText, error, options = [], id, children, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="mb-3 w-100">
        {label && (
          <label htmlFor={selectId} className="form-label d-block mb-1">
            <AppTypography variant="label" tone="secondary">
              {label}
            </AppTypography>
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          disabled={disabled}
          className={cn(
            "form-select rounded-3 py-2 px-3 transition-colors",
            error && "is-invalid border-danger",
            className
          )}
          style={{
            backgroundColor: "var(--app-surface)",
            borderColor: error ? "var(--app-danger)" : "var(--app-border)",
            color: "var(--app-text-primary)",
          }}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
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

AppSelect.displayName = "AppSelect";

export default AppSelect;
