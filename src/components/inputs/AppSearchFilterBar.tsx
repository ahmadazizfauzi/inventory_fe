"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AppInput from "./AppInput";
import AppButton from "../buttons/AppButton";
import { Filter, RotateCcw } from "lucide-react";

export interface AppSearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onFilterClick?: () => void;
  isFilterActive?: boolean;
  filterButtonText?: string;
  onResetClick?: () => void;
  resetButtonTitle?: string;
  rightActions?: React.ReactNode;
  className?: string;
}

export default function AppSearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  onFilterClick,
  isFilterActive = false,
  filterButtonText = "Filter",
  onResetClick,
  resetButtonTitle = "Reset Semua Filter",
  rightActions,
  className,
}: AppSearchFilterBarProps) {
  return (
    <div className={cn("d-flex align-items-center gap-2 mb-4 w-100", className)}>
      <div className="flex-grow-1 position-relative d-flex align-items-center">
        <AppInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          wrapperClassName="mb-0 w-100"
          className="w-100"
          style={{ height: 42 }}
        />
      </div>

      {onFilterClick && (
        <AppButton
          type="button"
          variant={isFilterActive ? "primary" : "outlineSecondary"}
          size="md"
          icon={<Filter size={16} />}
          onClick={onFilterClick}
          style={{ height: 42, whiteSpace: "nowrap" }}
        >
          {filterButtonText}
          {isFilterActive && (
            <span className="badge bg-light text-dark ms-1 rounded-pill">
              Aktif
            </span>
          )}
        </AppButton>
      )}

      {isFilterActive && onResetClick && (
        <AppButton
          type="button"
          variant="outlineSecondary"
          size="md"
          onClick={onResetClick}
          title={resetButtonTitle}
          style={{ height: 42 }}
        >
          <RotateCcw size={15} />
        </AppButton>
      )}

      {rightActions}
    </div>
  );
}
