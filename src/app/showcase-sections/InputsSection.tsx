"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppInput from "@/components/inputs/AppInput";
import AppSelect from "@/components/inputs/AppSelect";
import AppTextarea from "@/components/inputs/AppTextarea";
import { Search, DollarSign, Barcode, Mail, Lock } from "lucide-react";

export default function InputsSection() {
  const [sku, setSku] = useState("SKU-INV-2026-001");
  const [productName, setProductName] = useState("Server Rack 42U Enterprise");

  return (
    <section id="inputs" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppInput.tsx & Form Controls
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Inputs, Selects & Forms
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Komponen input form dengan integrasi label, icon, pesan validasi error, dan dropdown select terstandar.
        </AppTypography>
      </div>

      <div className="row g-4">
        {/* Basic Inputs & Icons */}
        <div className="col-12 col-md-6">
          <div className="p-4 rounded-3 border h-100" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
            <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
              Text Inputs & Icons
            </AppTypography>

            <AppInput
              label="Kode SKU Produk"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Contoh: SKU-2026-001"
              icon={<Barcode size={18} />}
              helperText="Kode identifikasi unik barang di database"
            />

            <AppInput
              label="Nama Barang"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Masukkan nama barang"
            />

            <AppInput
              label="Pencarian Global"
              placeholder="Ketik untuk mencari produk..."
              icon={<Search size={18} />}
            />

            <AppInput
              label="Harga Beli (Modal)"
              placeholder="0"
              icon={<DollarSign size={18} />}
              helperText="Nominal dasar sebelum kalkulasi margin"
            />
          </div>
        </div>

        {/* Validation States & Selects */}
        <div className="col-12 col-md-6">
          <div className="p-4 rounded-3 border h-100" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
            <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
              Validation & Select
            </AppTypography>

            <AppInput
              label="Email Administrator"
              defaultValue="admin@siindonesia.com"
              icon={<Mail size={18} />}
            />

            <AppInput
              label="Password (Error State)"
              type="password"
              defaultValue="123"
              icon={<Lock size={18} />}
              error="Password minimal harus 6 karakter untuk otentikasi JWT"
            />

            <AppSelect
              label="Kategori Barang"
              options={[
                { value: "1", label: "Hardware & Server" },
                { value: "2", label: "Networking & Cabling" },
                { value: "3", label: "Accessories & Peripherals" },
              ]}
              helperText="Pilih kelompok kategori master data"
            />

            <AppTextarea
              label="Catatan Mutasi / Alasan Perubahan Stok"
              placeholder="Tuliskan keterangan detail mutasi barang..."
              rows={2}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
