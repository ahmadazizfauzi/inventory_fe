"use client";

import React from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppButton from "@/components/buttons/AppButton";
import { Plus, Download, Trash2, Check, RefreshCw } from "lucide-react";

export default function ButtonsSection() {
  return (
    <section id="buttons" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppButton.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Button Variants & States
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Komponen tombol pembungkus Bootstrap Button lengkap dengan loading spinner, icon position, dan outline.
        </AppTypography>
      </div>

      {/* Solid Variants */}
      <div className="p-4 rounded-3 border mb-3" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
        <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
          Solid Buttons
        </AppTypography>
        <div className="d-flex flex-wrap gap-2">
          <AppButton variant="primary">Primary Action</AppButton>
          <AppButton variant="secondary">Secondary</AppButton>
          <AppButton variant="success" icon={<Check size={16} />}>Simpan Data</AppButton>
          <AppButton variant="warning">Warning / Draft</AppButton>
          <AppButton variant="danger" icon={<Trash2 size={16} />}>Hapus Produk</AppButton>
          <AppButton variant="info">Informasi</AppButton>
          <AppButton variant="light">Light Border</AppButton>
          <AppButton variant="dark">Dark Button</AppButton>
        </div>
      </div>

      {/* Outline Variants */}
      <div className="p-4 rounded-3 border mb-3" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
        <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
          Outline Buttons
        </AppTypography>
        <div className="d-flex flex-wrap gap-2">
          <AppButton variant="outlinePrimary" icon={<Plus size={16} />}>Tambah Stok</AppButton>
          <AppButton variant="outlineSecondary">Batal</AppButton>
          <AppButton variant="outlineSuccess">Export Excel</AppButton>
          <AppButton variant="outlineWarning">Filter Kategori</AppButton>
          <AppButton variant="outlineDanger">Hapus Terpilih</AppButton>
          <AppButton variant="outlineInfo" icon={<Download size={16} />}>Download PDF</AppButton>
        </div>
      </div>

      {/* Sizes & Loading State */}
      <div className="p-4 rounded-3 border" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
        <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
          Sizes & States
        </AppTypography>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <AppButton size="sm" variant="primary">Small (sm)</AppButton>
          <AppButton size="md" variant="primary">Medium (md)</AppButton>
          <AppButton size="lg" variant="primary">Large (lg)</AppButton>
          <AppButton variant="primary" isLoading>Sedang Menyimpan...</AppButton>
          <AppButton variant="outlinePrimary" disabled>Tombol Disabled</AppButton>
          <AppButton variant="outlineSecondary" icon={<RefreshCw size={16} />}>Refresh</AppButton>
        </div>
      </div>
    </section>
  );
}
