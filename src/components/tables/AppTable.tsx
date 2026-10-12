"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export interface AppTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  hoverable?: boolean;
  striped?: boolean;
  className?: string;
}

export default function AppTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = "Tidak ada data yang ditemukan",
  hoverable = true,
  striped = false,
  className,
}: AppTableProps<T>) {
  return (
    <div
      className={cn("table-responsive rounded-3 border overflow-hidden", className)}
      style={{ borderColor: "var(--app-border)" }}
    >
      <table
        className={cn(
          "table app-table align-middle mb-0",
          hoverable && "table-hover",
          striped && "table-striped"
        )}
      >
        <thead className="text-uppercase font-body">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "py-3 px-3 border-bottom",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-end",
                  col.className
                )}
                style={{ borderColor: "var(--app-border)" }}
              >
                <AppTypography variant="tableHeader" tone="muted">
                  {col.header}
                </AppTypography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--app-surface)" }}>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-5">
                <div className="spinner-border text-primary spinner-border-sm me-2" role="status" />
                <AppTypography variant="bodySm" tone="muted">
                  Memuat data...
                </AppTypography>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-5">
                <AppTypography variant="bodySm" tone="muted">
                  {emptyMessage}
                </AppTypography>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={keyExtractor(row, index)} style={{ borderColor: "var(--app-border)" }}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "py-3 px-3",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-end",
                      col.className
                    )}
                  >
                    {col.render ? col.render(row, index) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
