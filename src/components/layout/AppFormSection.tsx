"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";

export interface AppFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AppFormSection({
  title,
  description,
  children,
  className,
}: AppFormSectionProps) {
  return (
    <div
      className={cn("row g-4 py-4 border-bottom", className)}
      style={{ borderColor: "var(--app-border)" }}
    >
      {/* Left Column: Section Title & Description */}
      <div className="col-12 col-md-4">
        <AppTypography variant="h3" tone="primary" className="mb-1 d-block">
          {title}
        </AppTypography>
        {description && (
          <AppTypography variant="bodySm" tone="secondary" className="d-block">
            {description}
          </AppTypography>
        )}
      </div>

      {/* Right Column: Form Inputs Card / Container */}
      <div className="col-12 col-md-8">
        <div
          className="p-4 rounded-3 border shadow-sm"
          style={{
            backgroundColor: "var(--app-surface)",
            borderColor: "var(--app-border)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
