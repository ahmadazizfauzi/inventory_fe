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
  icon?: React.ReactNode;
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
        "d-flex flex-column border-end flex-shrink-0 h-100",
        className
      )}
      style={{
        width,
        borderColor: "var(--app-border)",
        backgroundColor: "var(--app-surface)",
      }}
    >
      {/* Brand Header */}
      <div
        className="d-flex align-items-center px-4 border-bottom flex-shrink-0"
        style={{ height: 60, borderColor: "var(--app-border)" }}
      >
        <div className="overflow-hidden">
          <AppTypography
            variant="cardTitle"
            tone="primary"
            className="m-0 text-truncate fw-bold"
            style={{ fontSize: "0.95rem", letterSpacing: "-0.01em" }}
          >
            {brandTitle}
          </AppTypography>
          {brandSubtitle && (
            <span
              className="text-truncate d-block"
              style={{ fontSize: "0.72rem", color: "var(--app-text-muted)", marginTop: 2 }}
            >
              {brandSubtitle}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-grow-1 overflow-y-auto px-3 py-3 d-flex flex-column gap-3">
        {menuGroups.map((group, gIndex) => (
          <div key={group.heading || `group-${gIndex}`} className="d-flex flex-column gap-1">
            {group.heading && (
              <div className="px-3 pb-1 pt-2">
                <span
                  className="text-uppercase fw-semibold d-block"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    color: "var(--app-text-muted)",
                  }}
                >
                  {group.heading}
                </span>
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
                      "btn nav-link app-sidebar-link d-flex align-items-center justify-content-between w-100 px-3 py-2 text-start transition-all",
                      isActive ? "app-sidebar-link--active fw-semibold" : "border-0"
                    )}
                    style={{
                      fontSize: "0.84rem",
                      letterSpacing: "-0.01em",
                      backgroundColor: isActive ? "rgba(99, 102, 241, 0.12)" : "transparent",
                      color: isActive ? "var(--app-primary)" : "var(--app-text-secondary)",
                      borderLeft: isActive ? "3px solid var(--app-primary)" : "3px solid transparent",
                      borderRadius: "6px",
                    }}
                  >
                    <span className="d-flex align-items-center gap-2 text-truncate">
                      {item.icon && (
                        <span
                          className="sidebar-item-icon d-flex align-items-center justify-content-center flex-shrink-0 transition-colors"
                          style={{
                            width: 18,
                            height: 18,
                            color: isActive ? "var(--app-primary)" : "var(--app-text-muted)",
                          }}
                        >
                          {item.icon}
                        </span>
                      )}
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
          style={{
            borderColor: "var(--app-border)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle fw-bold font-mono flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                fontSize: 12,
                backgroundColor: "rgba(99, 102, 241, 0.15)",
                color: "var(--app-primary)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span
                className="fw-semibold text-truncate d-block text-nowrap"
                style={{ fontSize: "0.8125rem", color: "var(--app-text-primary)" }}
              >
                {user.name}
              </span>
              <span
                className="text-uppercase fw-semibold"
                style={{
                  fontSize: "0.625rem",
                  letterSpacing: "0.04em",
                  color: "var(--app-text-muted)",
                }}
              >
                {user.role}
              </span>
            </div>
          </div>
          {user.onLogout && (
            <button
              type="button"
              onClick={user.onLogout}
              className="btn btn-sm p-1 rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 border-0"
              style={{
                color: "var(--app-text-muted)",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--app-danger)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--app-text-muted)")}
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
