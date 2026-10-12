"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";
import AppBreadcrumb, { BreadcrumbItem } from "../navigation/AppBreadcrumb";
import { ChevronLeft } from "lucide-react";

export interface AppPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export default function AppPageHeader({
  title,
  subtitle,
  breadcrumbItems,
  onBack,
  actions,
  className,
}: AppPageHeaderProps) {
  return (
    <div className={cn("mb-4 pb-3 border-bottom", className)} style={{ borderColor: "var(--app-border)" }}>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <div className="mb-2">
          <AppBreadcrumb items={breadcrumbItems} />
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn btn-outline-secondary btn-sm p-1 rounded-2 d-flex align-items-center justify-content-center border"
              style={{ width: 34, height: 34, borderColor: "var(--app-border)" }}
              title="Kembali"
              aria-label="Kembali"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <AppTypography variant="h2" tone="primary" className="m-0 lh-1">
              {title}
            </AppTypography>
            {subtitle && (
              <AppTypography variant="caption" tone="muted" className="mt-1 d-block">
                {subtitle}
              </AppTypography>
            )}
          </div>
        </div>

        {actions && <div className="d-flex align-items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
