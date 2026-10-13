"use client";

import React from "react";
import AppTypography, { type TypographyWeight } from "@/components/typography/AppTypography";

const weights: { weight: TypographyWeight; label: string; numeric: number }[] = [
  { weight: "light", label: "Light", numeric: 300 },
  { weight: "normal", label: "Normal", numeric: 400 },
  { weight: "medium", label: "Medium", numeric: 500 },
  { weight: "semibold", label: "Semibold", numeric: 600 },
  { weight: "bold", label: "Bold", numeric: 700 },
];

const scale = [
  { variant: "display" as const, label: "Display", sample: "Manajemen Inventory" },
  { variant: "h1" as const, label: "Heading 1", sample: "Dashboard Monitoring" },
  { variant: "h2" as const, label: "Heading 2", sample: "Laporan Mutasi Barang" },
  { variant: "h3" as const, label: "Heading 3", sample: "Valuasi Aset Keuangan" },
  { variant: "h4" as const, label: "Heading 4", sample: "Katalog Master Produk" },
  { variant: "eyebrow" as const, label: "Eyebrow", sample: "INVENTORY SYSTEM" },
  { variant: "lead" as const, label: "Lead", sample: "Aplikasi enterprise berbasis RESTful API Laravel dengan autentikasi JWT dan database MySQL." },
  { variant: "body" as const, label: "Body", sample: "Data stok dan valuasi aset diperbarui secara berkala melalui endpoint terproteksi." },
  { variant: "bodySm" as const, label: "Body Small", sample: "Informasi detail pergerakan stok keluar dan masuk hari ini." },
  { variant: "statValue" as const, label: "Stat Value", sample: "Rp 62.400.000" },
  { variant: "statLabel" as const, label: "Stat Label", sample: "TOTAL NILAI PASAR" },
  { variant: "mono" as const, label: "Mono / Code", sample: "POST /api/stock-mutations" },
  { variant: "label" as const, label: "Mono Label", sample: "Filter Semua Kategori" },
];

export default function TypographySection() {
  return (
    <section id="typography" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppTypography.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Typography System
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Hierarki tipografi lengkap per level dengan font <strong>Plus Jakarta Sans</strong>, <strong>Inter</strong>, dan <strong>JetBrains Mono</strong>.
        </AppTypography>
      </div>

      {/* Type Scale List */}
      <div className="rounded-3 border overflow-hidden mb-4" style={{ borderColor: "var(--app-border)" }}>
        {scale.map((item, index) => (
          <div
            key={item.variant}
            className="p-3 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2"
            style={{
              backgroundColor: "var(--app-surface)",
              borderBottom: index < scale.length - 1 ? "1px solid var(--app-border)" : "none",
            }}
          >
            <AppTypography variant="meta" tone="muted" style={{ minWidth: 140 }}>
              {item.label}
            </AppTypography>
            <div className="flex-grow-1 text-break">
              <AppTypography variant={item.variant} tone="primary">
                {item.sample}
              </AppTypography>
            </div>
          </div>
        ))}
      </div>

      {/* Weight Axis Section (Seperti di projek 2026) */}
      <div className="mb-3">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          WEIGHT AXIS
        </AppTypography>
        <AppTypography variant="bodySm" tone="secondary" className="d-block max-w-2xl">
          Tidak ada satu pun level yang terkunci ke satu ketebalan — lewat prop <code>weight</code>, setiap varian di atas (display sampai mono label) bisa dipakai di 5 pilihan: light, normal, medium, semibold, bold. Tiap varian tetap punya default yang masuk akal, tinggal timpa kalau perlu.
        </AppTypography>
      </div>

      {/* Grid of Weight Axis per Variant */}
      <div className="row g-3">
        {scale.map((demo) => (
          <div key={demo.variant} className="col-12 col-lg-6">
            <div
              className="p-3 rounded-3 border h-100"
              style={{
                backgroundColor: "var(--app-surface)",
                borderColor: "var(--app-border)",
              }}
            >
              <AppTypography variant="meta" tone="muted" className="mb-3 d-block text-uppercase">
                VARIANT=&quot;{demo.variant}&quot;
              </AppTypography>

              <div className="d-flex flex-column">
                {weights.map((w, wIndex) => (
                  <div
                    key={w.weight}
                    className="d-flex align-items-center justify-content-between py-2 gap-2"
                    style={{
                      borderBottom: wIndex < weights.length - 1 ? "1px solid var(--app-border)" : "none",
                    }}
                  >
                    <AppTypography variant="meta" tone="muted" className="flex-shrink-0">
                      {w.label} <span className="text-secondary opacity-75">({w.numeric})</span>
                    </AppTypography>
                    <AppTypography
                      variant={demo.variant}
                      weight={w.weight}
                      tone="primary"
                      className="text-truncate text-end"
                    >
                      {demo.sample}
                    </AppTypography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
