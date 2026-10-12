"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn d-inline-flex align-items-center justify-content-center gap-2 fw-medium transition-all text-decoration-none",
  {
    variants: {
      variant: {
        primary: "btn-primary shadow-sm",
        secondary: "btn-secondary",
        success: "btn-success text-white shadow-sm",
        danger: "btn-danger text-white shadow-sm",
        warning: "btn-warning text-dark shadow-sm",
        info: "btn-info text-white shadow-sm",
        light: "btn-light border",
        dark: "btn-dark shadow-sm",
        outlinePrimary: "btn-outline-primary",
        outlineSecondary: "btn-outline-secondary",
        outlineSuccess: "btn-outline-success",
        outlineDanger: "btn-outline-danger",
        outlineWarning: "btn-outline-warning",
        outlineInfo: "btn-outline-info",
        ghost: "btn-link text-decoration-none",
      },
      size: {
        sm: "btn-sm px-2 py-1 small rounded-2",
        md: "px-3 py-2 rounded-3",
        lg: "btn-lg px-4 py-2 fs-6 rounded-3",
      },
      fullWidth: {
        true: "w-100",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
}

export default function AppButton({
  className,
  variant,
  size,
  fullWidth,
  isLoading = false,
  icon,
  iconPosition = "start",
  disabled,
  children,
  ...props
}: AppButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span
          className="spinner-border spinner-border-sm me-1"
          role="status"
          aria-hidden="true"
        />
      )}
      {!isLoading && icon && iconPosition === "start" && icon}
      {children}
      {!isLoading && icon && iconPosition === "end" && icon}
    </button>
  );
}

export { buttonVariants };
