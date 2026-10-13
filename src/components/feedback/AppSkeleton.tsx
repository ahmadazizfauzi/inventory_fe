"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AppSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: "text" | "rectangular" | "circular" | "rounded";
  animation?: "pulse" | "shimmer" | "none";
  className?: string;
}

export default function AppSkeleton({
  width,
  height,
  borderRadius,
  variant = "rounded",
  animation = "shimmer",
  className,
  style,
  ...props
}: AppSkeletonProps) {
  const getRadius = () => {
    if (borderRadius !== undefined) return borderRadius;
    switch (variant) {
      case "circular":
        return "50%";
      case "text":
        return "4px";
      case "rounded":
        return "8px";
      case "rectangular":
        return "0px";
      default:
        return "6px";
    }
  };

  const getHeight = () => {
    if (height !== undefined) return height;
    if (variant === "text") return "1rem";
    if (variant === "circular") return width || "40px";
    return "100%";
  };

  return (
    <div
      className={cn(
        "app-skeleton",
        animation === "pulse" && "app-skeleton-pulse",
        animation === "shimmer" && "app-skeleton-shimmer",
        className
      )}
      style={{
        width: width !== undefined ? width : "100%",
        height: getHeight(),
        borderRadius: getRadius(),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Helper component: Skeleton untuk baris tabel */
export function AppSkeletonTableRow({
  cols = 5,
  height = 24,
}: {
  cols?: number;
  height?: number | string;
}) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-3">
          <AppSkeleton height={height} width={i === 0 ? "80%" : i === 1 ? "60%" : "50%"} />
        </td>
      ))}
    </tr>
  );
}

/** Helper component: Skeleton untuk Stat Card */
export function AppSkeletonStatCard() {
  return (
    <div
      className="card app-card border p-3 shadow-sm h-100"
      style={{
        backgroundColor: "var(--app-surface)",
        borderColor: "var(--app-border)",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <AppSkeleton width="45%" height={14} />
        <AppSkeleton width={32} height={32} borderRadius={8} />
      </div>
      <div className="my-1">
        <AppSkeleton width="70%" height={28} borderRadius={6} />
      </div>
      <div className="mt-2 pt-1 border-top" style={{ borderColor: "var(--app-border)" }}>
        <AppSkeleton width="55%" height={12} />
      </div>
    </div>
  );
}
