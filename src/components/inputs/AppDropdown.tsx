"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface AppDropdownOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface AppDropdownProps {
  label?: string;
  placeholder?: string;
  options: AppDropdownOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  size?: "sm" | "md" | "lg";
}

export default function AppDropdown({
  label,
  placeholder = "Pilih salah satu...",
  options,
  value,
  onChange,
  searchable = false,
  searchPlaceholder = "Cari opsi...",
  clearable = false,
  error,
  helperText,
  disabled = false,
  className,
  wrapperClassName,
  size = "md",
}: AppDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optValue: string | number) => {
    onChange?.(optValue);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  const sizePaddingMap = {
    sm: "py-1 px-2.5 small",
    md: "py-2 px-3",
    lg: "py-2.5 px-3.5 fs-6",
  };

  return (
    <div className={cn("w-100 position-relative", wrapperClassName)} ref={dropdownRef}>
      {label && (
        <label className="form-label d-block mb-1">
          <AppTypography variant="label" tone="secondary">
            {label}
          </AppTypography>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-100 d-flex align-items-center justify-content-between rounded-3 border text-start transition-all",
          sizePaddingMap[size],
          error && "border-danger",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        style={{
          backgroundColor: "var(--app-surface)",
          borderColor: error ? "var(--app-danger)" : isOpen ? "var(--app-primary)" : "var(--app-border)",
          color: selectedOption ? "var(--app-text)" : "var(--app-text-muted)",
          boxShadow: isOpen ? "0 0 0 1px var(--app-primary)" : "none",
          minHeight: 40,
        }}
      >
        <div className="d-flex align-items-center gap-2 text-truncate me-2">
          {selectedOption?.icon && (
            <span className="d-flex align-items-center text-primary flex-shrink-0">
              {selectedOption.icon}
            </span>
          )}
          <span className="text-truncate fw-normal" style={{ fontSize: "0.875rem" }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <div className="d-flex align-items-center gap-1 flex-shrink-0">
          {clearable && selectedOption && !disabled && (
            <span
              onClick={handleClear}
              className="text-muted p-1 rounded-circle hover-opacity cursor-pointer d-flex align-items-center"
              title="Hapus pilihan"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className="text-muted transition-transform"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </div>
      </button>

      {/* Feedback Messages */}
      {error && (
        <div className="invalid-feedback d-block mt-1">
          <AppTypography variant="caption" tone="danger">
            {error}
          </AppTypography>
        </div>
      )}
      {!error && helperText && (
        <div className="form-text mt-1">
          <AppTypography variant="caption" tone="muted">
            {helperText}
          </AppTypography>
        </div>
      )}

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className="position-absolute start-0 end-0 mt-1 rounded-3 border shadow-lg overflow-hidden animate-fade-in"
          style={{
            zIndex: 1060,
            backgroundColor: "var(--app-surface)",
            borderColor: "var(--app-border)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Search Box if Searchable */}
          {searchable && (
            <div className="p-2 border-bottom" style={{ borderColor: "var(--app-border)" }}>
              <div
                className="d-flex align-items-center px-2 py-1.5 rounded-2 border"
                style={{
                  backgroundColor: "var(--app-bg)",
                  borderColor: "var(--app-border)",
                }}
              >
                <Search size={14} className="text-muted me-2 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-100 bg-transparent border-0 p-0 text-white outline-none font-sans"
                  style={{
                    color: "var(--app-text)",
                    fontSize: "0.825rem",
                    outline: "none",
                  }}
                />
                {searchQuery && (
                  <span
                    onClick={() => setSearchQuery("")}
                    className="text-muted cursor-pointer d-flex align-items-center"
                  >
                    <X size={12} />
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            className="overflow-y-auto p-1"
            style={{ maxHeight: 240 }}
          >
            {filteredOptions.length === 0 ? (
              <div className="py-3 px-3 text-center text-muted small">
                Tidak ada opsi yang cocok
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "w-100 d-flex align-items-center justify-content-between px-3 py-2 rounded-2 text-start border-0 transition-colors",
                      isSelected ? "fw-semibold" : "fw-normal"
                    )}
                    style={{
                      backgroundColor: isSelected ? "rgba(99, 102, 241, 0.12)" : "transparent",
                      color: isSelected ? "var(--app-primary)" : "var(--app-text)",
                      fontSize: "0.85rem",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "var(--app-hover-bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 text-truncate me-2">
                      {opt.icon && (
                        <span className="d-flex align-items-center text-muted flex-shrink-0">
                          {opt.icon}
                        </span>
                      )}
                      <div>
                        <div className="text-truncate">{opt.label}</div>
                        {opt.description && (
                          <div className="small text-muted" style={{ fontSize: "0.75rem" }}>
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={15} className="text-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
