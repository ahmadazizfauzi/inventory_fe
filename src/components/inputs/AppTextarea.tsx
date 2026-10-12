"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";

export interface AppTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const AppTextarea = forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  ({ className, label, helperText, error, id, rows = 3, disabled, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="mb-3 w-100">
        {label && (
          <label htmlFor={textareaId} className="form-label d-block mb-1">
            <AppTypography variant="label" tone="secondary">
              {label}
            </AppTypography>
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            "form-control rounded-3 py-2 px-3 transition-colors",
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

AppTextarea.displayName = "AppTextarea";

export default AppTextarea;
