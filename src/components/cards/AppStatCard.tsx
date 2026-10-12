"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";

export interface AppStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorScheme?: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
  className?: string;
}

const colorSchemeMap = {
  primary: {
    bg: "bg-primary-subtle",
    text: "text-primary",
    border: "border-primary-subtle",
  },
  success: {
    bg: "bg-success-subtle",
    text: "text-success",
    border: "border-success-subtle",
  },
  warning: {
    bg: "bg-warning-subtle",
    text: "text-warning-emphasis",
    border: "border-warning-subtle",
  },
  danger: {
    bg: "bg-danger-subtle",
    text: "text-danger",
    border: "border-danger-subtle",
  },
  info: {
    bg: "bg-info-subtle",
    text: "text-info-emphasis",
    border: "border-info-subtle",
  },
  secondary: {
    bg: "bg-secondary-subtle",
    text: "text-secondary-emphasis",
    border: "border-secondary-subtle",
  },
};

export default function AppStatCard({
  label,
  value,
  icon,
  colorScheme = "primary",
  className,
}: AppStatCardProps) {
  const scheme = colorSchemeMap[colorScheme] || colorSchemeMap.primary;

  return (
    <div
      className={cn(
        "card app-card border p-4 shadow-sm position-relative overflow-hidden h-100",
        className
      )}
      style={{
        backgroundColor: "var(--app-surface)",
        borderColor: "var(--app-border)",
      }}
    >
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div className="flex-grow-1 min-w-0">
          <AppTypography
            variant="statLabel"
            tone="muted"
            className="mb-2 d-block text-truncate"
            style={{ letterSpacing: "0.08em" }}
          >
            {label}
          </AppTypography>
          <AppTypography
            variant="display"
            tone="primary"
            className="d-block text-nowrap font-mono fs-2 fw-bold m-0"
          >
            {value}
          </AppTypography>
        </div>
        <div
          className={cn(
            "d-flex align-items-center justify-content-center rounded-3 p-3 border flex-shrink-0",
            scheme.bg,
            scheme.text,
            scheme.border
          )}
          style={{ width: 56, height: 56 }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
