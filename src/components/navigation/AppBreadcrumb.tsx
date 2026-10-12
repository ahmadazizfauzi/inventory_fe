"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol
        className="list-unstyled p-0 m-0 d-flex align-items-center flex-wrap font-body"
        style={{ gap: "0.25rem", minHeight: 20 }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.label}
              className="d-inline-flex align-items-center m-0 p-0"
              aria-current={isLast ? "page" : undefined}
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-decoration-none hover-underline d-inline-flex align-items-center"
                >
                  <AppTypography variant="bodySm" tone="secondary">
                    {item.label}
                  </AppTypography>
                </Link>
              ) : (
                <AppTypography variant="bodySm" tone={isLast ? "primary" : "secondary"}>
                  {item.label}
                </AppTypography>
              )}
              {!isLast && (
                <span className="d-inline-flex align-items-center justify-content-center mx-1 text-secondary opacity-60">
                  <ChevronRight size={13} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
