"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import AppInput from "./AppInput";
import AppButton from "../buttons/AppButton";
import { Filter, RotateCcw, Search, X, CornerDownLeft } from "lucide-react";

export interface AppSearchFilterBarProps {
  searchValue: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
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
  onSearchSubmit,
  searchPlaceholder = "Cari...",
  onFilterClick,
  isFilterActive = false,
  filterButtonText = "Filter",
  onResetClick,
  resetButtonTitle = "Reset Semua Filter",
  rightActions,
  className,
}: AppSearchFilterBarProps) {
  const [draftSearch, setDraftSearch] = useState(searchValue || "");

  // Sync draft value whenever external searchValue changes (e.g. from reset)
  useEffect(() => {
    setDraftSearch(searchValue || "");
  }, [searchValue]);

  const handleExecuteSearch = (val: string) => {
    if (onSearchSubmit) {
      onSearchSubmit(val);
    } else if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClear = () => {
    setDraftSearch("");
    if (onSearchSubmit) {
      onSearchSubmit("");
    } else if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <div className={cn("d-flex align-items-center gap-2 mb-4 w-100", className)}>
      <div className="flex-grow-1 position-relative d-flex align-items-center">
        <AppInput
          placeholder={searchPlaceholder}
          value={draftSearch}
          onChange={(e) => {
            setDraftSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleExecuteSearch(draftSearch);
            }
          }}
          icon={<Search size={16} />}
          iconPosition="start"
          wrapperClassName="mb-0 w-100"
          className="w-100 pe-4"
          style={{ height: 42 }}
        />

        {/* Clear Button if input has text */}
        {draftSearch && (
          <div
            className="position-absolute end-0 top-50 translate-middle-y me-2 d-flex align-items-center"
            style={{ zIndex: 6 }}
          >
            <button
              type="button"
              className="btn btn-sm btn-link text-muted p-1 border-0 shadow-none text-decoration-none"
              onClick={handleClear}
              title="Hapus pencarian"
              style={{ lineHeight: 1 }}
            >
              <X size={15} />
            </button>
          </div>
        )}
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
          onClick={() => {
            setDraftSearch("");
            onResetClick();
          }}
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
