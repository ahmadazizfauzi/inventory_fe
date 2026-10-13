"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";

export interface AppStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: string;
  colorScheme?: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
  className?: string;
}

const colorSchemeMap = {
  primary: {
    bg: "rgba(99, 102, 241, 0.12)",
    text: "var(--app-primary)",
    border: "rgba(99, 102, 241, 0.2)",
  },
  success: {
    bg: "rgba(16, 185, 129, 0.12)",
    text: "var(--app-success)",
    border: "rgba(16, 185, 129, 0.2)",
  },
  warning: {
    bg: "rgba(245, 158, 11, 0.12)",
    text: "var(--app-warning)",
    border: "rgba(245, 158, 11, 0.2)",
  },
  danger: {
    bg: "rgba(244, 63, 94, 0.12)",
    text: "var(--app-danger)",
    border: "rgba(244, 63, 94, 0.2)",
  },
  info: {
    bg: "rgba(14, 165, 233, 0.12)",
    text: "var(--app-secondary)",
    border: "rgba(14, 165, 233, 0.2)",
  },
  secondary: {
    bg: "rgba(148, 163, 184, 0.12)",
    text: "var(--app-text-secondary)",
    border: "rgba(148, 163, 184, 0.2)",
  },
};

export default function AppStatCard({
  label,
  value,
  icon,
  subtitle,
  trend,
  colorScheme = "primary",
  className,
}: AppStatCardProps) {
  const scheme = colorSchemeMap[colorScheme] || colorSchemeMap.primary;

  return (
    <div
      className={cn(
        "card app-card border p-3 p-xl-3 shadow-sm position-relative overflow-hidden h-100",
        className
      )}
      style={{
        backgroundColor: "var(--app-surface)",
        borderColor: "var(--app-border)",
      }}
    >
      {/* Top row: Label + Icon */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span
          className="text-uppercase fw-semibold text-truncate"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            color: "var(--app-text-muted)",
          }}
        >
          {label}
        </span>
        {icon && (
          <div
            className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
            style={{
              width: 32,
              height: 32,
              backgroundColor: scheme.bg,
              color: scheme.text,
              border: `1px solid ${scheme.border}`,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Middle row: Large clean value spanning full card */}
      <div className="my-1">
        <div
          className="font-mono fw-bold text-truncate"
          style={{
            fontSize: "1.375rem",
            letterSpacing: "-0.02em",
            color: "var(--app-text-primary)",
            lineHeight: 1.2,
          }}
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </div>
      </div>

      {/* Bottom row: Optional subtitle or trend */}
      {(subtitle || trend) && (
        <div className="d-flex align-items-center gap-2 mt-2 pt-1 border-top" style={{ borderColor: "var(--app-border)" }}>
          {trend && (
            <span
              className="fw-semibold font-mono"
              style={{ fontSize: "0.75rem", color: scheme.text }}
            >
              {trend}
            </span>
          )}
          {subtitle && (
            <span
              className="text-truncate"
              style={{ fontSize: "0.75rem", color: "var(--app-text-muted)" }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
