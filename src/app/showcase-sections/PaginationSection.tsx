"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppPagination from "@/components/navigation/AppPagination";

export default function PaginationSection() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(4);
  const [page3, setPage3] = useState(10);

  return (
    <section
      id="pagination"
      className="mb-5 pb-4 border-bottom"
      style={{ borderColor: "var(--app-border)" }}
    >
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppPagination.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Pagination Navigation
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Komponen navigasi halaman terstandar UI Kit dengan tombol kotak modern, dukungan ellipsis (...), indikator jumlah data, dan kontrol Previous/Next responsif.
        </AppTypography>
      </div>

      {/* Interactive Demo */}
      <div
        className="p-4 rounded-3 border mb-4"
        style={{
          backgroundColor: "var(--app-surface)",
          borderColor: "var(--app-border)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <AppTypography variant="cardTitle" tone="primary">
            Interactive Pagination (5 Halaman)
          </AppTypography>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
            Halaman Aktif: {page1}
          </span>
        </div>
        <p className="text-secondary small mb-3">
          Klik tombol nomor halaman atau panah di bawah ini untuk melihat transisi halaman aktif secara interaktif:
        </p>

        <div className="p-3 rounded-2 border" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-card-bg)" }}>
          <AppPagination
            currentPage={page1}
            totalPages={5}
            totalItems={48}
            itemsPerPage={10}
            onPageChange={(p) => setPage1(p)}
          />
        </div>
      </div>

      {/* Multi-page with Ellipsis */}
      <div
        className="p-4 rounded-3 border mb-4"
        style={{
          backgroundColor: "var(--app-surface)",
          borderColor: "var(--app-border)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <AppTypography variant="cardTitle" tone="primary">
            Banyak Halaman dengan Smart Ellipsis (...)
          </AppTypography>
          <span className="badge bg-secondary-subtle text-secondary border px-2 py-1">
            Total 12 Halaman (Halaman Aktif: {page2})
          </span>
        </div>
        <p className="text-secondary small mb-3">
          Otomatis memotong dan menampilkan titik-titik (...) ketika total halaman melebihi kapasitas tampilan:
        </p>

        <div className="p-3 rounded-2 border" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-card-bg)" }}>
          <AppPagination
            currentPage={page2}
            totalPages={12}
            totalItems={120}
            itemsPerPage={10}
            onPageChange={(p) => setPage2(p)}
          />
        </div>
      </div>

      {/* Minimal / Without Item Count */}
      <div
        className="p-4 rounded-3 border"
        style={{
          backgroundColor: "var(--app-surface)",
          borderColor: "var(--app-border)",
        }}
      >
        <AppTypography variant="cardTitle" tone="primary" className="mb-2 d-block">
          Mode Tanpa Label Hitungan Item
        </AppTypography>
        <p className="text-secondary small mb-3">
          Gunakan properti <code>showItemCount=&#123;false&#125;</code> untuk tampilan minimalis di modal atau kartu ringkas:
        </p>

        <div className="p-3 rounded-2 border d-flex justify-content-center" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-card-bg)" }}>
          <AppPagination
            currentPage={page3}
            totalPages={10}
            showItemCount={false}
            onPageChange={(p) => setPage3(p)}
          />
        </div>
      </div>
    </section>
  );
}
