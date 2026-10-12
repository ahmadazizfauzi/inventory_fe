"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";
import AppBadge from "../badges/AppBadge";
import { LogOut } from "lucide-react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
  badgeVariant?: "softPrimary" | "softSuccess" | "softWarning" | "softDanger" | "softInfo";
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarMenuGroup {
  heading?: string;
  items: SidebarMenuItem[];
}

export interface AppSidebarProps {
  brandTitle?: string;
  brandSubtitle?: string;
  brandIcon?: React.ReactNode;
  menuGroups: SidebarMenuGroup[];
  activeId?: string;
  user?: {
    name: string;
    role: string;
    avatar?: string;
    onLogout?: () => void;
  };
  className?: string;
  width?: number | string;
}

export default function AppSidebar({
  brandTitle = "Enterprise Backoffice",
  brandSubtitle = "Inventory & Valuation",
  brandIcon,
  menuGroups,
  activeId,
  user,
  className,
  width = 280,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "d-flex flex-column border-end bg-body h-100",
        className
      )}
      style={{
        width,
        borderColor: "var(--app-border)",
      }}
    >
      {/* Brand Header */}
      <div
        className="d-flex align-items-center gap-3 px-4 border-bottom flex-shrink-0"
        style={{ height: 65, borderColor: "var(--app-border)" }}
      >
        {brandIcon && (
          <div
            className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary border border-primary-subtle flex-shrink-0"
            style={{ width: 36, height: 36 }}
          >
            {brandIcon}
          </div>
        )}
        <div className="overflow-hidden">
          <AppTypography variant="cardTitle" tone="primary" className="m-0 text-truncate d-block">
            {brandTitle}
          </AppTypography>
          {brandSubtitle && (
            <AppTypography variant="caption" tone="muted" className="text-truncate d-block">
              {brandSubtitle}
            </AppTypography>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-grow-1 overflow-y-auto px-3 py-3 d-flex flex-column gap-3">
        {menuGroups.map((group, gIndex) => (
          <div key={group.heading || `group-${gIndex}`} className="d-flex flex-column gap-1">
            {group.heading && (
              <div className="px-2 pb-1">
                <AppTypography variant="tableHeader" tone="muted" style={{ fontSize: "0.68rem" }}>
                  {group.heading}
                </AppTypography>
              </div>
            )}
            <ul className="nav nav-pills flex-column gap-1 list-unstyled m-0 p-0">
              {group.items.map((item) => {
                const isActive = item.active || activeId === item.id;
                const content = (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={cn(
                      "btn nav-link d-flex align-items-center justify-content-between w-100 px-3 py-2 rounded-2 text-start transition-all font-body",
                      isActive
                        ? "active bg-primary text-white shadow-sm fw-semibold"
                        : "text-body border-0 hover-bg-surface-subtle"
                    )}
                    style={{
                      fontSize: "0.875rem",
                      backgroundColor: isActive ? "var(--app-primary)" : "transparent",
                      color: isActive ? "#ffffff" : "var(--app-text-primary)",
                    }}
                  >
                    <span className="d-flex align-items-center gap-2 text-truncate">
                      <span className={isActive ? "text-white" : "text-secondary"}>{item.icon}</span>
                      <span className="text-truncate">{item.label}</span>
                    </span>
                    {item.badge !== undefined && (
                      <AppBadge
                        variant={item.badgeVariant || (isActive ? "primary" : "softSecondary")}
                        size="sm"
                        pill
                      >
                        {item.badge}
                      </AppBadge>
                    )}
                  </button>
                );

                return (
                  <li key={item.id} className="nav-item">
                    {item.href ? (
                      <Link href={item.href} className="text-decoration-none d-block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      {user && (
        <div
          className="p-3 border-top mt-auto flex-shrink-0 d-flex align-items-center justify-content-between"
          style={{ borderColor: "var(--app-border)" }}
        >
          <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fw-bold font-mono border border-primary-subtle flex-shrink-0"
              style={{ width: 34, height: 34, fontSize: 13 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <AppTypography variant="bodySm" tone="primary" className="fw-semibold text-truncate d-block m-0">
                {user.name}
              </AppTypography>
              <AppBadge variant="softPrimary" size="sm" pill>
                {user.role}
              </AppBadge>
            </div>
          </div>
          {user.onLogout && (
            <button
              type="button"
              onClick={user.onLogout}
              className="btn btn-outline-danger btn-sm p-1 rounded-2 d-flex align-items-center flex-shrink-0 border-0"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
