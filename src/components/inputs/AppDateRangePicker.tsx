"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

export interface DateRangeValue {
  startDate: string | null; // format: "YYYY-MM-DD"
  endDate: string | null;   // format: "YYYY-MM-DD"
}

export interface AppDateRangePickerProps {
  value?: DateRangeValue;
  onChange?: (val: DateRangeValue) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

type PresetKey =
  | "all"
  | "today"
  | "yesterday"
  | "this_week"
  | "past_7_days"
  | "last_week"
  | "this_month"
  | "last_month";

interface PresetItem {
  key: PresetKey;
  label: string;
}

const PRESETS: PresetItem[] = [
  { key: "all", label: "All Dates" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "this_week", label: "This Week" },
  { key: "past_7_days", label: "This Past 7 Days" },
  { key: "last_week", label: "Last Week" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Date helper: format to YYYY-MM-DD
function toDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Date helper: format for display (e.g., "13 September 2026")
function formatDisplayDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${FULL_MONTH_NAMES[monthIndex]} ${year}`;
}

// Parse string "YYYY-MM-DD" to Date
function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export const AppDateRangePicker: React.FC<AppDateRangePickerProps> = ({
  value = { startDate: null, endDate: null },
  onChange,
  placeholder = "Pilih Rentang Tanggal",
  disabled = false,
  className = "",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Temporary selection state during popover open
  const [tempStart, setTempStart] = useState<string | null>(value.startDate || null);
  const [tempEnd, setTempEnd] = useState<string | null>(value.endDate || null);
  const [activePreset, setActivePreset] = useState<PresetKey>("all");

  // Calender view state: Month 1 (left) and Month 2 (right)
  const initialYear = parseDate(value.startDate)?.getFullYear() ?? 2026;
  const initialMonth = parseDate(value.startDate)?.getMonth() ?? 8; // September
  const [viewYear1, setViewYear1] = useState(initialYear);
  const [viewMonth1, setViewMonth1] = useState(initialMonth); // 0-11

  // Second month is usually Month 1 + 1
  const viewMonth2 = (viewMonth1 + 1) % 12;
  const viewYear2 = viewMonth1 === 11 ? viewYear1 + 1 : viewYear1;

  // Sync state when props value change or on client mount
  useEffect(() => {
    setTempStart(value.startDate || null);
    setTempEnd(value.endDate || null);
    if (value.startDate) {
      const parsed = parseDate(value.startDate);
      if (parsed) {
        setViewYear1(parsed.getFullYear());
        setViewMonth1(parsed.getMonth());
      }
    } else {
      const now = new Date();
      setViewYear1(now.getFullYear());
      setViewMonth1(now.getMonth());
    }
  }, [value.startDate, value.endDate]);

  // Click outside listener to close popup
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  // Handle Preset Selection
  const applyPreset = (preset: PresetKey) => {
    setActivePreset(preset);
    const today = new Date();

    if (preset === "all") {
      setTempStart(null);
      setTempEnd(null);
      return;
    }

    if (preset === "today") {
      const dStr = toDateStr(today);
      setTempStart(dStr);
      setTempEnd(dStr);
      setViewMonth1(today.getMonth());
      setViewYear1(today.getFullYear());
      return;
    }

    if (preset === "yesterday") {
      const yDate = new Date(today);
      yDate.setDate(today.getDate() - 1);
      const dStr = toDateStr(yDate);
      setTempStart(dStr);
      setTempEnd(dStr);
      setViewMonth1(yDate.getMonth());
      setViewYear1(yDate.getFullYear());
      return;
    }

    if (preset === "this_week") {
      const curr = new Date(today);
      const first = curr.getDate() - curr.getDay(); // Sunday
      const last = first + 6; // Saturday
      const start = new Date(curr.setDate(first));
      const end = new Date(curr.setDate(last));
      setTempStart(toDateStr(start));
      setTempEnd(toDateStr(end));
      setViewMonth1(start.getMonth());
      setViewYear1(start.getFullYear());
      return;
    }

    if (preset === "past_7_days") {
      const past7 = new Date(today);
      past7.setDate(today.getDate() - 6);
      setTempStart(toDateStr(past7));
      setTempEnd(toDateStr(today));
      setViewMonth1(past7.getMonth());
      setViewYear1(past7.getFullYear());
      return;
    }

    if (preset === "last_week") {
      const curr = new Date(today);
      const first = curr.getDate() - curr.getDay() - 7;
      const last = first + 6;
      const start = new Date(curr.setDate(first));
      const end = new Date(curr.setDate(last));
      setTempStart(toDateStr(start));
      setTempEnd(toDateStr(end));
      setViewMonth1(start.getMonth());
      setViewYear1(start.getFullYear());
      return;
    }

    if (preset === "this_month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setTempStart(toDateStr(start));
      setTempEnd(toDateStr(end));
      setViewMonth1(start.getMonth());
      setViewYear1(start.getFullYear());
      return;
    }

    if (preset === "last_month") {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      setTempStart(toDateStr(start));
      setTempEnd(toDateStr(end));
      setViewMonth1(start.getMonth());
      setViewYear1(start.getFullYear());
      return;
    }
  };

  // Month navigation for Month 1
  const prevMonth1 = () => {
    if (viewMonth1 === 0) {
      setViewMonth1(11);
      setViewYear1(viewYear1 - 1);
    } else {
      setViewMonth1(viewMonth1 - 1);
    }
  };

  const nextMonth1 = () => {
    if (viewMonth1 === 11) {
      setViewMonth1(0);
      setViewYear1(viewYear1 + 1);
    } else {
      setViewMonth1(viewMonth1 + 1);
    }
  };

  // Day selection logic
  const handleDateClick = (dateStr: string) => {
    setActivePreset("all"); // Custom range clears explicit preset highlight
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd(null);
    } else if (tempStart && !tempEnd) {
      if (dateStr < tempStart) {
        setTempEnd(tempStart);
        setTempStart(dateStr);
      } else {
        setTempEnd(dateStr);
      }
    }
  };

  // Save changes
  const handleSave = () => {
    onChange?.({
      startDate: tempStart,
      endDate: tempEnd || tempStart,
    });
    setIsOpen(false);
  };

  // Reset to empty
  const handleReset = () => {
    setTempStart(null);
    setTempEnd(null);
    setActivePreset("all");
    onChange?.({ startDate: null, endDate: null });
    setIsOpen(false);
  };

  // Cancel changes
  const handleCancel = () => {
    setTempStart(value.startDate || null);
    setTempEnd(value.endDate || null);
    setIsOpen(false);
  };

  // Generate matrix for a month (including empty leading days)
  const renderMonthDays = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    // Preceding month trailing days for visual context
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push(-(prevMonthTotalDays - i)); // Negative number indicates previous month
    }

    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }

    // Next month leading days to complete row
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push(100 + i); // Greater than 100 indicates next month
    }

    return days;
  };

  // Formatted display text for input trigger
  const displayLabel = useMemo(() => {
    if (value.startDate && value.endDate) {
      if (value.startDate === value.endDate) {
        return formatDisplayDate(value.startDate);
      }
      return `${formatDisplayDate(value.startDate)} - ${formatDisplayDate(value.endDate)}`;
    }
    if (value.startDate) {
      return `${formatDisplayDate(value.startDate)} - ...`;
    }
    return "";
  }, [value.startDate, value.endDate]);

  // Selected date range text for header
  const headerSelectedText = useMemo(() => {
    if (tempStart && tempEnd) {
      return `${formatDisplayDate(tempStart)} - ${formatDisplayDate(tempEnd)}`;
    }
    if (tempStart) {
      return `${formatDisplayDate(tempStart)} - ${formatDisplayDate(tempStart)}`;
    }
    return "All Dates";
  }, [tempStart, tempEnd]);

  // Helper to render calendar grid
  const renderCalendarMonth = (
    year: number,
    month: number,
    onPrev: () => void,
    onNext: () => void,
    onYearChange: (y: number) => void,
    onMonthChange: (m: number) => void
  ) => {
    const days = renderMonthDays(year, month);

    return (
      <div className="flex-grow-1" style={{ minWidth: "260px" }}>
        {/* Navigation & Month/Year Selectors */}
        <div className="d-flex align-items-center justify-content-between mb-3 px-1">
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none p-1 text-secondary"
            onClick={onPrev}
            style={{ borderRadius: "50%" }}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="d-flex align-items-center gap-2">
            {/* Month Dropdown */}
            <select
              className="form-select form-select-sm py-1 px-2 border-0 fw-semibold"
              style={{
                backgroundColor: "var(--app-surface-hover)",
                color: "var(--app-text)",
                borderRadius: "8px",
                width: "auto",
                cursor: "pointer",
                fontSize: "13px",
              }}
              value={month}
              onChange={(e) => onMonthChange(parseInt(e.target.value, 10))}
            >
              {MONTH_NAMES.map((mName, idx) => (
                <option key={idx} value={idx}>
                  {mName}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              className="form-select form-select-sm py-1 px-2 border-0 fw-semibold"
              style={{
                backgroundColor: "var(--app-surface-hover)",
                color: "var(--app-text)",
                borderRadius: "8px",
                width: "auto",
                cursor: "pointer",
                fontSize: "13px",
              }}
              value={year}
              onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 15 }, (_, i) => year - 7 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none p-1 text-secondary"
            onClick={onNext}
            style={{ borderRadius: "50%" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day Name Headers */}
        <div
          className="d-grid mb-1 text-center"
          style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="py-1 text-muted fw-semibold"
              style={{ fontSize: "12px" }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div
          className="d-grid text-center"
          style={{ gridTemplateColumns: "repeat(7, 1fr)", rowGap: "4px" }}
        >
          {days.map((item, idx) => {
            const isPrev = item !== null && item < 0;
            const isNext = item !== null && item > 100;
            const dayNum = isPrev ? -item : isNext ? item - 100 : item;

            // Compute exact date string for dayNum
            let targetDateStr = "";
            if (!isPrev && !isNext && item !== null) {
              const mStr = String(month + 1).padStart(2, "0");
              const dStr = String(item).padStart(2, "0");
              targetDateStr = `${year}-${mStr}-${dStr}`;
            }

            const isStart = targetDateStr !== "" && targetDateStr === tempStart;
            const isEnd = targetDateStr !== "" && targetDateStr === tempEnd;
            const isInRange =
              targetDateStr !== "" &&
              tempStart !== null &&
              tempEnd !== null &&
              targetDateStr > tempStart &&
              targetDateStr < tempEnd;

            // Outside month days appearance
            if (isPrev || isNext) {
              return (
                <div
                  key={idx}
                  className="d-flex align-items-center justify-content-center text-muted opacity-25"
                  style={{ height: "36px", fontSize: "13px" }}
                >
                  {dayNum}
                </div>
              );
            }

            // In range background styling
            let trackBg = "transparent";
            let borderRadius = "50%";
            let textColor = "var(--app-text)";
            let isSelected = isStart || isEnd;

            if (isInRange) {
              trackBg = "rgba(108, 92, 231, 0.16)";
              borderRadius = "0";
              textColor = "var(--app-primary)";
            } else if (isStart && tempEnd) {
              trackBg = "linear-gradient(90deg, transparent 50%, rgba(108, 92, 231, 0.16) 50%)";
            } else if (isEnd && tempStart) {
              trackBg = "linear-gradient(90deg, rgba(108, 92, 231, 0.16) 50%, transparent 50%)";
            }

            return (
              <div
                key={idx}
                className="position-relative d-flex align-items-center justify-content-center"
                style={{
                  height: "36px",
                  background: trackBg,
                  cursor: "pointer",
                }}
                onClick={() => handleDateClick(targetDateStr)}
              >
                <div
                  className="d-flex align-items-center justify-content-center fw-medium transition-all"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: isSelected ? "var(--app-primary)" : "transparent",
                    color: isSelected ? "#ffffff" : textColor,
                    boxShadow: isSelected ? "0 2px 6px rgba(108, 92, 231, 0.35)" : "none",
                    fontSize: "13px",
                  }}
                >
                  {dayNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`position-relative ${className}`} ref={containerRef}>
      {label && (
        <label
          className="form-label mb-1 fw-medium"
          style={{ fontSize: "13px", color: "var(--app-text-secondary)" }}
        >
          {label}
        </label>
      )}

      {/* Input Trigger Button */}
      <div
        className={`d-flex align-items-center justify-content-between px-3 py-2 border rounded-3 bg-white ${
          disabled ? "opacity-50 pe-none" : ""
        }`}
        style={{
          borderColor: isOpen ? "var(--app-primary)" : "var(--app-border)",
          boxShadow: isOpen ? "0 0 0 3px rgba(108, 92, 231, 0.15)" : "none",
          backgroundColor: "var(--app-surface)",
          cursor: disabled ? "not-allowed" : "pointer",
          minHeight: "40px",
          transition: "all 0.15s ease-in-out",
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className="text-truncate"
          style={{
            fontSize: "13.5px",
            color: displayLabel ? "var(--app-text)" : "var(--app-text-muted)",
            fontWeight: displayLabel ? 500 : 400,
          }}
        >
          {displayLabel || placeholder}
        </span>

        <div className="d-flex align-items-center gap-2">
          {displayLabel && (
            <button
              type="button"
              className="btn btn-link p-0 text-muted border-0"
              style={{ lineHeight: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              title="Hapus tanggal"
            >
              <X size={15} />
            </button>
          )}
          <CalendarIcon size={16} style={{ color: "var(--app-text-secondary)" }} />
        </div>
      </div>

      {/* Popover Dropdown (Matches Screenshot Visual Design) */}
      {isOpen && (
        <div
          className="position-absolute shadow-lg border rounded-4 bg-white z-3 mt-2"
          style={{
            top: "100%",
            left: 0,
            width: "min(720px, 94vw)",
            backgroundColor: "var(--app-surface)",
            borderColor: "var(--app-border)",
            color: "var(--app-text)",
            boxShadow: "0 18px 40px -10px rgba(0, 0, 0, 0.18)",
            overflow: "hidden",
            maxWidth: "740px",
          }}
        >
          {/* Main Content: Left Presets + Right Calendars */}
          <div className="d-flex flex-column flex-md-row">
            {/* Sidebar Presets */}
            <div
              className="d-flex flex-row flex-md-column border-bottom border-md-bottom-0 border-md-end p-2 p-md-3 overflow-auto"
              style={{
                width: "100%",
                maxWidth: "200px",
                borderColor: "var(--app-border)",
                backgroundColor: "var(--app-surface-subtle)",
                flexShrink: 0,
              }}
            >
              {PRESETS.map((p) => {
                const isActive = activePreset === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    className="btn btn-sm text-start text-nowrap rounded-3 py-2 px-3 mb-1 border-0 fw-medium transition-all"
                    style={{
                      backgroundColor: isActive ? "var(--app-primary)" : "transparent",
                      color: isActive ? "#ffffff" : "var(--app-text)",
                      fontSize: "13px",
                    }}
                    onClick={() => applyPreset(p.key)}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Right Calendar Area */}
            <div className="p-3 p-md-4 flex-grow-1">
              {/* Selected Date Header */}
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: "var(--app-border)" }}>
                <span className="text-secondary" style={{ fontSize: "13px" }}>
                  Selected Date:
                </span>
                <span className="fw-bold" style={{ fontSize: "14px", color: "var(--app-text)" }}>
                  {headerSelectedText}
                </span>
              </div>

              {/* Calendars Grid (Dual Months on desktop, single/stacked on mobile) */}
              <div className="d-flex flex-column flex-lg-row gap-4 align-items-start">
                {/* Month 1 */}
                {renderCalendarMonth(
                  viewYear1,
                  viewMonth1,
                  prevMonth1,
                  nextMonth1,
                  (y) => setViewYear1(y),
                  (m) => setViewMonth1(m)
                )}

                {/* Vertical Divider for Desktop */}
                <div
                  className="d-none d-lg-block align-self-stretch border-start"
                  style={{ borderColor: "var(--app-border)" }}
                />

                {/* Month 2 */}
                <div className="d-none d-md-block flex-grow-1" style={{ minWidth: "260px" }}>
                  {renderCalendarMonth(
                    viewYear2,
                    viewMonth2,
                    () => {
                      if (viewMonth1 === 0) {
                        setViewMonth1(11);
                        setViewYear1(viewYear1 - 1);
                      } else {
                        setViewMonth1(viewMonth1 - 1);
                      }
                    },
                    () => {
                      if (viewMonth1 === 11) {
                        setViewMonth1(0);
                        setViewYear1(viewYear1 + 1);
                      } else {
                        setViewMonth1(viewMonth1 + 1);
                      }
                    },
                    (y) => {
                      setViewYear1(viewMonth1 === 11 ? y - 1 : y);
                    },
                    (m) => {
                      setViewMonth1(m === 0 ? 11 : m - 1);
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions: Reset (left), Cancel & Save (right) */}
          <div
            className="d-flex align-items-center justify-content-between p-3 border-top"
            style={{
              borderColor: "var(--app-border)",
              backgroundColor: "var(--app-surface)",
            }}
          >
            <button
              type="button"
              className="btn btn-link text-decoration-none fw-semibold p-0"
              style={{ color: "var(--app-primary)", fontSize: "13.5px" }}
              onClick={handleReset}
            >
              Reset
            </button>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-3 py-1 fw-medium rounded-3"
                style={{ fontSize: "13px" }}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm text-white px-4 py-1 fw-semibold rounded-3"
                style={{
                  backgroundColor: "var(--app-primary)",
                  borderColor: "var(--app-primary)",
                  fontSize: "13px",
                  boxShadow: "0 2px 6px rgba(108, 92, 231, 0.3)",
                }}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDateRangePicker;
