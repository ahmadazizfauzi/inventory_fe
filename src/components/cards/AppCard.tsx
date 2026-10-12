"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function AppCard({ className, hoverable = false, children, ...props }: AppCardProps) {
  return (
    <div
      className={cn(
        "card app-card border shadow-sm",
        hoverable && "transition-transform hover-translate-y",
        className
      )}
      style={{
        backgroundColor: "var(--app-surface)",
        borderColor: "var(--app-border)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function AppCardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("card-header bg-transparent py-3 px-4 border-bottom", className)}
      style={{ borderColor: "var(--app-border)" }}
      {...props}
    >
      {children}
    </div>
  );
}

export function AppCardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-body p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function AppCardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("card-footer bg-transparent py-3 px-4 border-top", className)}
      style={{ borderColor: "var(--app-border)" }}
      {...props}
    >
      {children}
    </div>
  );
}
