"use client";

import React from "react";
import AppTypography from "@/components/typography/AppTypography";

const colorTokens = [
  { name: "Brand Primary", hex: "#4f46e5", role: "Primary action, links, key brand focus" },
  { name: "Secondary / Cyan", hex: "#06b6d4", role: "Sub-accent, interactive highlights" },
  { name: "Accent Blue", hex: "#3b82f6", role: "Informational badges, secondary buttons" },
  { name: "Success Emerald", hex: "#10b981", role: "Stok Aman, profit positif, validasi sukses" },
  { name: "Warning Amber", hex: "#f59e0b", role: "Low stock alert, peringatan restock barang" },
  { name: "Danger Crimson", hex: "#f43f5e", role: "Out of stock, delete action, stok habis" },
  { name: "Dark Surface", hex: "#0b0f19", role: "Canvas background pada tema gelap" },
  { name: "Dark Card", hex: "#111827", role: "Elevated card surface pada tema gelap" },
  { name: "Light Surface", hex: "#f8fafc", role: "Canvas background pada tema terang" },
  { name: "Light Card", hex: "#ffffff", role: "Elevated card surface pada tema terang" },
];

export default function ColorsSection() {
  return (
    <section id="colors" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-3">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          Design Tokens
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Colors & Palettes
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Skema warna Manajemen Inventory & Finansial dengan kontras tinggi yang otomatis beradaptasi pada mode gelap dan terang.
        </AppTypography>
      </div>

      <div className="row g-3">
        {colorTokens.map((item) => (
          <div key={item.name} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div
              className="p-3 rounded-3 border h-100 shadow-sm"
              style={{
                backgroundColor: "var(--app-surface)",
                borderColor: "var(--app-border)",
              }}
            >
              <div
                className="rounded-2 mb-2 w-100 border"
                style={{ height: 60, backgroundColor: item.hex, borderColor: "var(--app-border)" }}
              />
              <AppTypography variant="cardTitle" tone="primary" className="d-block mb-1">
                {item.name}
              </AppTypography>
              <AppTypography variant="meta" tone="accent" className="d-block mb-1">
                {item.hex}
              </AppTypography>
              <AppTypography variant="caption" tone="muted">
                {item.role}
              </AppTypography>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
