"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppDateRangePicker, { DateRangeValue } from "@/components/inputs/AppDateRangePicker";
import { Calendar, CheckCircle2 } from "lucide-react";

export default function DateRangePickerSection() {
  // Live state matching the user's reference mockup
  const [selectedRange, setSelectedRange] = useState<DateRangeValue>({
    startDate: "2026-09-13",
    endDate: "2026-10-13",
  });

  const [emptyRange, setEmptyRange] = useState<DateRangeValue>({
    startDate: null,
    endDate: null,
  });

  return (
    <section id="date-range-picker" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppDateRangePicker.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Calendar & Date Range Picker
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Komponen kalender rentang tanggal dengan navigasi dua bulan berdampingan (dual-month), preset filter kilat (Today, This Week, This Month, dsb), serta aksi Reset, Cancel, dan Save terintegrasi.
        </AppTypography>
      </div>

      <div className="row g-4">
        {/* Interactive Showcase matching user's design */}
        <div className="col-12 col-lg-7">
          <div
            className="p-4 rounded-3 border h-100"
            style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <AppTypography variant="cardTitle" tone="primary">
                Interactive Date Range Picker
              </AppTypography>
              <span className="badge bg-primary-subtle text-primary fw-medium px-2 py-1" style={{ fontSize: "12px" }}>
                Live Demo
              </span>
            </div>

            <p className="text-secondary mb-3" style={{ fontSize: "13.5px" }}>
              Klik kotak input di bawah untuk membuka dialog kalender range date dengan preset sidebar:
            </p>

            <div className="mb-4" style={{ maxWidth: "380px" }}>
              <AppDateRangePicker
                label="Rentang Waktu Laporan / Audit"
                value={selectedRange}
                onChange={(val) => setSelectedRange(val)}
              />
            </div>

            {/* Current State Output Card */}
            <div
              className="p-3 rounded-3 border"
              style={{
                backgroundColor: "var(--app-surface-subtle)",
                borderColor: "var(--app-border)",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-success" />
                <span className="fw-semibold" style={{ fontSize: "13px", color: "var(--app-text)" }}>
                  Nilai Terpilih Saat Ini:
                </span>
              </div>
              <div className="font-monospace small p-2 rounded bg-dark text-light">
                {JSON.stringify(
                  {
                    start_date: selectedRange.startDate,
                    end_date: selectedRange.endDate,
                  },
                  null,
                  2
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Variations & States */}
        <div className="col-12 col-lg-5">
          <div
            className="p-4 rounded-3 border h-100"
            style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
          >
            <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
              Variasi & State
            </AppTypography>

            {/* Empty State */}
            <div className="mb-4">
              <AppDateRangePicker
                label="State Kosong / Default"
                placeholder="Pilih rentang tanggal transaksi..."
                value={emptyRange}
                onChange={(val) => setEmptyRange(val)}
              />
            </div>

            {/* Disabled State */}
            <div className="mb-4">
              <AppDateRangePicker
                label="State Disabled"
                disabled
                value={{ startDate: "2026-01-01", endDate: "2026-01-31" }}
              />
            </div>

            {/* Features Highlight */}
            <div
              className="p-3 rounded-3"
              style={{
                backgroundColor: "rgba(108, 92, 231, 0.08)",
                border: "1px dashed var(--app-primary)",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <Calendar size={16} style={{ color: "var(--app-primary)" }} />
                <span className="fw-semibold" style={{ fontSize: "13px", color: "var(--app-primary)" }}>
                  Fitur Utama UI Kit:
                </span>
              </div>
              <ul className="mb-0 ps-3 text-secondary" style={{ fontSize: "12.5px" }}>
                <li>8 Preset rentang cepat (All Dates, Today, This Month, etc.)</li>
                <li>Dua kalender berdampingan dengan seleksi start & end track</li>
                <li>Dropdown pemilih bulan & tahun langsung</li>
                <li>Responsive mobile-friendly (stack di layar sempit)</li>
                <li>Dukungan Light Mode & Dark Mode</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
