"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showItemCount?: boolean;
  className?: string;
}

export default function AppPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showItemCount = true,
  className,
}: AppPaginationProps) {
  if (totalPages <= 1 && (!totalItems || totalItems === 0)) {
    return null;
  }

  // Generate pagination items array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2);
        pages.push(3);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        pages.push(totalPages - 2);
        pages.push(totalPages - 1);
        pages.push(totalPages);
      } else {
        pages.push("...");
        pages.push(currentPage);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  const startItem = totalItems ? (currentPage - 1) * (itemsPerPage || 10) + 1 : 0;
  const endItem = totalItems
    ? Math.min(currentPage * (itemsPerPage || 10), totalItems)
    : 0;

  return (
    <div
      className={cn(
        "d-flex align-items-center justify-content-between flex-wrap gap-3",
        className
      )}
    >
      {/* Left: Info Text */}
      {showItemCount && totalItems !== undefined ? (
        <AppTypography variant="caption" tone="muted">
          Menampilkan {startItem} - {endItem} dari total {totalItems} data
        </AppTypography>
      ) : (
        <div />
      )}

      {/* Right: Nevira Square Pagination Controls */}
      <nav aria-label="Navigasi Halaman" className="d-flex align-items-center gap-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman Sebelumnya"
          className="app-pagination-btn d-flex align-items-center justify-content-center transition-all"
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            border: "1px solid var(--app-border)",
            backgroundColor: "var(--app-surface)",
            color: currentPage <= 1 ? "var(--app-text-muted)" : "var(--app-text)",
            opacity: currentPage <= 1 ? 0.45 : 1,
            cursor: currentPage <= 1 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Buttons */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <div
                key={`ellipsis-${idx}`}
                className="d-flex align-items-center justify-content-center font-mono text-muted"
                style={{
                  width: 38,
                  height: 38,
                  fontSize: "0.9rem",
                  letterSpacing: "0.1em",
                }}
              >
                ...
              </div>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? "page" : undefined}
              className="app-pagination-btn d-flex align-items-center justify-content-center fw-semibold font-mono transition-all"
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                border: isActive
                  ? "1.5px solid var(--app-primary)"
                  : "1px solid var(--app-border)",
                backgroundColor: "var(--app-surface)",
                color: isActive ? "var(--app-primary)" : "var(--app-text)",
                boxShadow: isActive
                  ? "0 0 0 1px rgba(99, 102, 241, 0.25)"
                  : "none",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman Berikutnya"
          className="app-pagination-btn d-flex align-items-center justify-content-center transition-all"
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            border: "1px solid var(--app-border)",
            backgroundColor: "var(--app-surface)",
            color: currentPage >= totalPages ? "var(--app-text-muted)" : "var(--app-text)",
            opacity: currentPage >= totalPages ? 0.45 : 1,
            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
