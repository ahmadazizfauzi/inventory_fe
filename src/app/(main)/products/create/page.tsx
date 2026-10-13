"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppPageHeader,
  AppFormSection,
  AppInput,
  AppDropdown,
  AppButton,
  AppAlert,
  AppTypography,
} from "@/components";
import {
  getCategories,
  createProduct,
} from "@/modules/products/services/product.service";
import {
  ICategory,
  IProductPayload,
} from "@/modules/products/types/product.types";
import { formatRupiah, parseRupiah } from "@/lib/formatters";

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "danger" | "success";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category_id: "",
    purchase_price: "",
    selling_price: "",
    stock: "0",
    min_stock: "5",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("auth_user");
      if (cached) {
        try {
          const user = JSON.parse(cached);
          if (user.role === "staff") {
            router.replace("/products");
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    getCategories().then((data) => {
      setCategories(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, category_id: String(data[0].id) }));
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!formData.sku.trim()) errors.sku = "SKU produk wajib diisi";
    if (!formData.name.trim()) errors.name = "Nama produk wajib diisi";
    if (!formData.category_id) errors.category_id = "Kategori wajib dipilih";
    if (!formData.purchase_price || Number(formData.purchase_price) < 0) {
      errors.purchase_price = "Harga beli (HPP) tidak boleh kosong atau negatif";
    }
    if (!formData.selling_price || Number(formData.selling_price) < 0) {
      errors.selling_price = "Harga jual tidak boleh kosong atau negatif";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setAlert({
        variant: "danger",
        message: "Silakan lengkapi semua bidang isian wajib dengan benar.",
      });
      return;
    }

    setLoading(true);
    const payload: IProductPayload = {
      sku: formData.sku.trim(),
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      purchase_price: Number(formData.purchase_price),
      selling_price: Number(formData.selling_price),
      stock: Number(formData.stock) || 0,
      min_stock: Number(formData.min_stock) || 0,
    };

    const res = await createProduct(payload);
    setLoading(false);

    if (res.status) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Produk berhasil ditambahkan ke inventaris",
          })
        );
      }
      router.push("/products");
    } else {
      if (res.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(res.errors).forEach(([field, msgs]) => {
          mapped[field] = msgs[0];
        });
        setFieldErrors(mapped);
      }
      setAlert({
        variant: "danger",
        message: res.message || "Gagal menambahkan produk baru",
      });
    }
  };

  return (
    <div className="container-fluid p-0" style={{ maxWidth: 1200 }}>
      {/* Floating Top-Right Alert Box (Sesuai UI Kit AppAlert) */}
      {alert && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1090, maxWidth: 400, width: "100%" }}
        >
          <AppAlert
            variant={alert.variant}
            title={alert.variant === "success" ? "Berhasil" : "Pemberitahuan"}
            dismissible
            autoClose
            duration={5000}
            onDismiss={() => setAlert(null)}
          >
            {alert.message}
          </AppAlert>
        </div>
      )}

      {/* Header with Nevira Style Back Button (no duplicate action buttons on top) */}
      <AppPageHeader
        title="Tambah Produk"
        subtitle="Daftarkan item barang baru ke dalam katalog inventaris gudang"
        onBack={() => router.push("/products")}
      />

      <form onSubmit={handleSubmit}>
        {/* Section 1: Informasi Dasar */}
        <AppFormSection
          title="Informasi Dasar"
          description="Isi informasi dasar, kode SKU unik, dan klasifikasi kategori produk"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppInput
                label="SKU / Kode Barang *"
                placeholder="Contoh: PRD-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                error={fieldErrors.sku}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <AppDropdown
                label="Kategori Produk *"
                searchable
                searchPlaceholder="Cari kategori barang..."
                value={formData.category_id}
                onChange={(val) => setFormData({ ...formData, category_id: String(val) })}
                error={fieldErrors.category_id}
                options={categories.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                  description: c.description || undefined,
                }))}
              />
            </div>

            <div className="col-12">
              <AppInput
                label="Nama Produk *"
                placeholder="Contoh: Beras Pandan Wangi Premium 5kg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={fieldErrors.name}
                required
              />
            </div>
          </div>
        </AppFormSection>

        {/* Section 2: Harga & Finansial */}
        <AppFormSection
          title="Harga & Finansial"
          description="Tentukan biaya modal pembelian (HPP) dan patokan harga jual ke konsumen"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppInput
                label="Harga Beli (HPP) *"
                type="number"
                min="0"
                step="any"
                placeholder="Contoh: 68000"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                error={fieldErrors.purchase_price}
                helperText={
                  formData.purchase_price
                    ? `Format Rupiah: ${formatRupiah(formData.purchase_price)}`
                    : "Biaya modal pengadaan satuan"
                }
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <AppInput
                label="Harga Jual *"
                type="number"
                min="0"
                step="any"
                placeholder="Contoh: 78000"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                error={fieldErrors.selling_price}
                helperText={
                  formData.selling_price
                    ? `Format Rupiah: ${formatRupiah(formData.selling_price)}`
                    : "Harga patokan jual ke pelanggan"
                }
                required
              />
            </div>
          </div>
        </AppFormSection>

        {/* Section 3: Manajemen Inventaris Stok */}
        <AppFormSection
          title="Manajemen Stok"
          description="Kuantitas fisik awal yang tersedia di gudang dan batas minimum peringatan"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppInput
                label="Stok Fisik Awal"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                error={fieldErrors.stock}
                helperText="Jumlah unit awal di gudang"
              />
            </div>

            <div className="col-12 col-md-6">
              <AppInput
                label="Batas Minimum Stok (Alert Kritis)"
                type="number"
                min="0"
                placeholder="5"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                error={fieldErrors.min_stock}
                helperText="Sistem akan menandai status Kritis jika stok mencapai batas ini"
              />
            </div>
          </div>
        </AppFormSection>

        {/* Bottom Form Actions: ONLY at bottom right, NO icon */}
        <div className="d-flex align-items-center justify-content-end gap-3 pt-4 mt-2">
          <AppButton
            variant="outlineSecondary"
            size="md"
            onClick={() => router.push("/products")}
            disabled={loading}
          >
            Batal
          </AppButton>
          <AppButton
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
          >
            Simpan Produk
          </AppButton>
        </div>
      </form>
    </div>
  );
}
