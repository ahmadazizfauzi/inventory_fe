"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "badge d-inline-flex align-items-center gap-1 fw-semibold text-decoration-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white",
        success: "bg-success text-white",
        danger: "bg-danger text-white",
        warning: "bg-warning text-dark",
        info: "bg-info text-white",
        light: "bg-light text-dark border",
        dark: "bg-dark text-white",
        // Soft / Subtle Variants (Modern Enterprise Badges)
        softPrimary: "bg-primary-subtle text-primary border border-primary-subtle",
        softSuccess: "bg-success-subtle text-success border border-success-subtle",
        softDanger: "bg-danger-subtle text-danger border border-danger-subtle",
        softWarning: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
        softInfo: "bg-info-subtle text-info-emphasis border border-info-subtle",
        softSecondary: "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle",
      },
      size: {
        sm: "px-2 py-0-5 small rounded-1 font-mono",
        md: "px-2-5 py-1 small rounded-2 font-mono",
        lg: "px-3 py-1-5 fs-6 rounded-pill",
      },
      pill: {
        true: "rounded-pill",
      },
    },
    defaultVariants: {
      variant: "softPrimary",
      size: "md",
    },
  }
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export interface AppBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  icon?: React.ReactNode;
}

export default function AppBadge({
  className,
  variant,
  size,
  pill,
  dot = false,
  icon,
  children,
  ...props
}: AppBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, pill }), className)} {...props}>
      {dot && (
        <span
          className="rounded-circle d-inline-block me-1"
          style={{ width: 6, height: 6, backgroundColor: "currentColor" }}
        />
      )}
      {icon && <span className="d-inline-flex align-items-center">{icon}</span>}
      {children}
    </span>
  );
}

export { badgeVariants };
