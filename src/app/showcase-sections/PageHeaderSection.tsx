"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppPageHeader from "@/components/layout/AppPageHeader";
import AppFormSection from "@/components/layout/AppFormSection";
import AppButton from "@/components/buttons/AppButton";
import AppInput from "@/components/inputs/AppInput";
import AppSelect from "@/components/inputs/AppSelect";
import { Plus } from "lucide-react";

export default function PageHeaderSection() {
  const [backClicked, setBackClicked] = useState(false);
  const [productName, setProductName] = useState("");

  const handleTestBack = () => {
    setBackClicked(true);
    setTimeout(() => setBackClicked(false), 2000);
  };

  return (
    <section id="page-header" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppPageHeader.tsx & AppFormSection.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Page Header & Navigasi Panah Kembali
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Sub-navbar penanda status halaman dengan tombol panah kembali (<code>onBack</code>), breadcrumb terstandar, dan layout split form 2-kolom tanpa modal dialog.
        </AppTypography>
      </div>

      {/* 1. Header with Back Arrow Button (onBack) */}
      <div
        className="p-4 rounded-3 border mb-4"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <AppTypography variant="cardTitle" tone="primary">
            1. Header Halaman Form dengan Tombol Panah Kembali (onBack)
          </AppTypography>
          {backClicked && (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
              Tombol panah diklik! (Navigasi kembali berjalan)
            </span>
          )}
        </div>
        <p className="text-secondary small mb-3">
          Digunakan secara konsisten pada halaman Tambah Produk, Edit Produk, Tambah Staf, dan Edit Staf:
        </p>

        <div className="p-3 rounded-2 border" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-card-bg)" }}>
          <AppPageHeader
            title="Tambah Produk / Edit Data"
            subtitle="Daftarkan item barang baru atau perbarui informasi data master"
            onBack={handleTestBack}
          />
        </div>
      </div>

      {/* 2. Header for List / Overview (Without onBack) */}
      <div
        className="p-4 rounded-3 border mb-4"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <AppTypography variant="cardTitle" tone="primary" className="mb-2 d-block">
          2. Header Halaman Master / List Data (Tanpa onBack)
        </AppTypography>
        <p className="text-secondary small mb-3">
          Digunakan pada halaman utama seperti Daftar Produk, Daftar Pengguna, dan Master Data dengan tombol aksi di kanan:
        </p>

        <div className="p-3 rounded-2 border" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-card-bg)" }}>
          <AppPageHeader
            title="Katalog Produk & Stok"
            subtitle="Daftar seluruh item inventaris dan pemantauan kuantitas stok gudang"
            actions={
              <AppButton variant="primary" size="md" icon={<Plus size={16} />}>
                Tambah Produk
              </AppButton>
            }
          />
        </div>
      </div>

      {/* 3. Form Split Layout (AppFormSection) */}
      <div
        className="p-4 rounded-3 border"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <AppTypography variant="cardTitle" tone="primary" className="mb-2 d-block">
          3. AppFormSection.tsx (Layout Split Form Tanpa Modal)
        </AppTypography>
        <p className="text-secondary small mb-3">
          Membagi form menjadi kolom deskripsi di kiri dan input controls di kanan secara proporsional:
        </p>

        <div className="p-3 rounded-2 border" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-card-bg)" }}>
          <AppFormSection
            title="Informasi Dasar Barang"
            description="Isi informasi identifikasi produk seperti SKU unik dan penamaan resmi."
          >
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <AppInput
                  label="Nama Barang *"
                  placeholder="Contoh: Beras Pandan Wangi 5kg"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6">
                <AppSelect
                  label="Kategori Barang"
                  options={[
                    { value: "1", label: "Sembako & Kebutuhan Pokok" },
                    { value: "2", label: "Minuman & Kemasan" },
                    { value: "3", label: "Snack & Makanan Ringan" },
                  ]}
                />
              </div>
            </div>
          </AppFormSection>
        </div>
      </div>
    </section>
  );
}
