"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppPageHeader from "@/components/layout/AppPageHeader";
import AppFormSection from "@/components/layout/AppFormSection";
import AppButton from "@/components/buttons/AppButton";
import AppInput from "@/components/inputs/AppInput";
import AppSelect from "@/components/inputs/AppSelect";
import { Plus, Check, Barcode, DollarSign } from "lucide-react";

export default function PageHeaderSection() {
  const [currentMode, setCurrentMode] = useState<"list" | "create">("list");
  const [productName, setProductName] = useState("");
  const [productSku, setProductSku] = useState("");

  return (
    <section id="page-header" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppPageHeader.tsx & AppFormSection.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Page Header & Split Form Layout
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Sub-navbar penanda status halaman dengan tombol kembali, breadcrumb, serta layout form split 2-kolom ala backoffice (tanpa popup modal).
        </AppTypography>
      </div>

      {currentMode === "list" ? (
        <div
          className="p-4 rounded-3 border"
          style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
        >
          <AppPageHeader
            title="Daftar Pelanggan"
            subtitle="Menampilkan data master pelanggan dan akun terdaftar"
            breadcrumbItems={[
              { label: "Home", href: "#" },
              { label: "Master Data" },
              { label: "Pelanggan" },
            ]}
            actions={
              <AppButton
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => setCurrentMode("create")}
              >
                Tambah Pelanggan
              </AppButton>
            }
          />
          <div
            className="p-4 rounded-2 border text-center"
            style={{ backgroundColor: "var(--app-surface-subtle)", borderColor: "var(--app-border)" }}
          >
            <AppTypography variant="bodySm" tone="muted">
              Klik tombol <strong>&quot;Tambah Pelanggan&quot;</strong> di kanan atas untuk menguji transisi ke sub-navbar mode input form tanpa modal.
            </AppTypography>
          </div>
        </div>
      ) : (
        <div
          className="p-4 rounded-3 border"
          style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
        >
          {/* Sub-Navbar Penanda Tambah Pelanggan */}
          <AppPageHeader
            title="Tambah Pelanggan"
            subtitle="Isi formulir di bawah untuk mendaftarkan akun pelanggan baru"
            onBack={() => setCurrentMode("list")}
            breadcrumbItems={[
              { label: "Home", href: "#" },
              { label: "Pelanggan", href: "#" },
              { label: "Tambah Pelanggan" },
            ]}
            actions={
              <div className="d-flex align-items-center gap-2">
                <AppButton variant="outlineSecondary" onClick={() => setCurrentMode("list")}>
                  Batal
                </AppButton>
                <AppButton
                  variant="success"
                  icon={<Check size={16} />}
                  onClick={() => setCurrentMode("list")}
                >
                  Simpan Pelanggan
                </AppButton>
              </div>
            }
          />

          {/* Form Split 2-Kolom: Informasi Dasar */}
          <AppFormSection
            title="Informasi Dasar"
            description="Isi informasi dasar identitas dari pelanggan baru."
          >
            <AppInput
              label="Nama Pelanggan *"
              placeholder="Contoh: Ananda Budiman"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              helperText="Nama lengkap sesuai identitas resmi"
            />
            <AppSelect
              label="Grup Pelanggan (Opsional)"
              options={[
                { value: "1", label: "Pilih Grup Pelanggan" },
                { value: "vip", label: "VIP Enterprise" },
                { value: "reguler", label: "Reguler Retail" },
              ]}
            />
            <AppSelect
              label="Kategori Pelanggan (Opsional)"
              options={[
                { value: "1", label: "Pilih Kategori Pelanggan" },
                { value: "b2b", label: "Corporate / B2B" },
                { value: "individual", label: "Individual Consumer" },
              ]}
            />
          </AppFormSection>

          {/* Form Split 2-Kolom: Kontak & Finansial */}
          <AppFormSection
            title="Detail Kontak & Finansial"
            description="Nomor kontak, kode akun, dan limit transaksi pelanggan."
          >
            <AppInput
              label="Kode Pelanggan *"
              placeholder="CUST-2026-001"
              icon={<Barcode size={18} />}
              value={productSku}
              onChange={(e) => setProductSku(e.target.value)}
            />
            <AppInput
              label="Plafon Kredit / Saldo Awal (Rp)"
              placeholder="0"
              icon={<DollarSign size={18} />}
            />
          </AppFormSection>
        </div>
      )}
    </section>
  );
}
