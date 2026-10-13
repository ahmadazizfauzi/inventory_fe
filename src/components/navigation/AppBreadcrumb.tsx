"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  homeHref?: string;
  separator?: "slash" | "chevron";
  className?: string;
}

export default function AppBreadcrumb({
  items,
  showHomeIcon = false,
  homeHref = "/dashboard",
  separator = "slash",
  className,
}: AppBreadcrumbProps) {
  const renderSeparator = () => {
    if (separator === "slash") {
      return (
        <span
          className="mx-2 flex-shrink-0 user-select-none"
          style={{
            color: "var(--app-border-subtle)",
            fontSize: "0.8125rem",
            lineHeight: 1,
          }}
        >
          /
        </span>
      );
    }
    return (
      <span
        className="d-inline-flex align-items-center justify-content-center mx-2 flex-shrink-0 text-secondary"
        style={{ opacity: 0.6, lineHeight: 1 }}
      >
        <ChevronRight size={13} style={{ display: "block" }} />
      </span>
    );
  };

  const firstIsHome = items.length > 0 && items[0].label.toLowerCase() === "home";

  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol
        className="list-unstyled p-0 m-0 d-inline-flex align-items-center flex-wrap font-body"
        style={{ minHeight: 20 }}
      >
        {/* Optional standalone Home Icon Item if not already provided as first item */}
        {showHomeIcon && !firstIsHome && (
          <li className="d-inline-flex align-items-center m-0 p-0 text-nowrap">
            <Link
              href={homeHref}
              className="text-decoration-none d-inline-flex align-items-center p-1 rounded"
              style={{ color: "var(--app-text-muted)", transition: "color 0.15s ease", lineHeight: 1 }}
              title="Home"
              aria-label="Home"
            >
              <Home size={15} style={{ display: "block" }} />
            </Link>
            {items.length > 0 && renderSeparator()}
          </li>
        )}

        {/* Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHomeItem = item.label.toLowerCase() === "home";

          const content = isHomeItem ? (
            <span
              className="d-inline-flex align-items-center"
              style={{ color: "var(--app-text-muted)", lineHeight: 1 }}
              title="Home"
              aria-label="Home"
            >
              <Home size={15} style={{ display: "block" }} />
            </span>
          ) : (
            <span className="d-inline-flex align-items-center">
              {item.icon && <span className="me-1.5 d-inline-flex align-items-center">{item.icon}</span>}
              <AppTypography
                as="span"
                variant="bodySm"
                tone={isLast ? "primary" : "secondary"}
                className={cn("m-0 d-inline-flex align-items-center lh-1", isLast && "fw-medium")}
              >
                {item.label}
              </AppTypography>
            </span>
          );

          return (
            <li
              key={`${item.label}-${index}`}
              className="d-inline-flex align-items-center m-0 p-0 text-nowrap"
              aria-current={isLast ? "page" : undefined}
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-decoration-none hover-underline d-inline-flex align-items-center"
                  style={{ lineHeight: 1 }}
                >
                  {content}
                </Link>
              ) : (
                content
              )}
              {!isLast && renderSeparator()}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
