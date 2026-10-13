"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  AppPageHeader,
  AppFormSection,
  AppInput,
  AppDropdown,
  AppButton,
  AppAlert,
  AppSkeleton,
} from "@/components";
import {
  getCategories,
  getProductById,
  updateProduct,
} from "@/modules/products/services/product.service";
import {
  ICategory,
  IProductPayload,
} from "@/modules/products/types/product.types";
import { formatRupiah } from "@/lib/formatters";

function EditProductSkeleton() {
  return (
    <div className="container-fluid p-0" style={{ maxWidth: 1200 }}>
      {/* Header Skeleton */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <AppSkeleton width={36} height={36} borderRadius={8} />
        <div className="d-flex flex-column gap-2">
          <AppSkeleton width={200} height={26} borderRadius={6} />
          <AppSkeleton width={320} height={15} borderRadius={4} />
        </div>
      </div>

      {/* Section 1: Informasi Dasar */}
      <div
        className="row g-4 py-4 border-bottom"
        style={{ borderColor: "var(--app-border)" }}
      >
        <div className="col-12 col-md-4">
          <AppSkeleton width={140} height={20} className="mb-2" />
          <AppSkeleton width={230} height={14} />
        </div>
        <div className="col-12 col-md-8">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppSkeleton width={110} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
            <div className="col-12 col-md-6">
              <AppSkeleton width={120} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
            <div className="col-12">
              <AppSkeleton width={110} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Harga & Finansial */}
      <div
        className="row g-4 py-4 border-bottom"
        style={{ borderColor: "var(--app-border)" }}
      >
        <div className="col-12 col-md-4">
          <AppSkeleton width={130} height={20} className="mb-2" />
          <AppSkeleton width={240} height={14} />
        </div>
        <div className="col-12 col-md-8">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppSkeleton width={120} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
            <div className="col-12 col-md-6">
              <AppSkeleton width={90} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Manajemen Stok */}
      <div
        className="row g-4 py-4 border-bottom"
        style={{ borderColor: "var(--app-border)" }}
      >
        <div className="col-12 col-md-4">
          <AppSkeleton width={130} height={20} className="mb-2" />
          <AppSkeleton width={240} height={14} />
        </div>
        <div className="col-12 col-md-8">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppSkeleton width={130} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
            <div className="col-12 col-md-6">
              <AppSkeleton width={160} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Skeleton */}
      <div className="d-flex align-items-center justify-content-end gap-3 pt-4 mt-2">
        <AppSkeleton width={80} height={38} borderRadius={8} />
        <AppSkeleton width={140} height={38} borderRadius={8} />
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params?.id);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
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

    Promise.all([getCategories(), getProductById(productId)]).then(
      ([cats, prodRes]) => {
        setCategories(cats);
        if (prodRes.status && prodRes.data) {
          const p = prodRes.data;
          setFormData({
            sku: p.sku,
            name: p.name,
            category_id: String(p.category_id),
            purchase_price: String(p.purchase_price),
            selling_price: String(p.selling_price),
            stock: String(p.stock),
            min_stock: String(p.min_stock),
          });
        } else {
          setAlert({
            variant: "danger",
            message: prodRes.message || "Produk tidak ditemukan",
          });
        }
        setInitialLoading(false);
      }
    );
  }, [productId]);

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
    const payload: Partial<IProductPayload> = {
      sku: formData.sku.trim(),
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      purchase_price: Number(formData.purchase_price),
      selling_price: Number(formData.selling_price),
      stock: Number(formData.stock) || 0,
      min_stock: Number(formData.min_stock) || 0,
    };

    const res = await updateProduct(productId, payload);
    setLoading(false);

    if (res.status) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Produk berhasil diperbarui",
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
        message: res.message || "Gagal memperbarui produk",
      });
    }
  };

  const isFormValid =
    formData.sku.trim() !== "" &&
    formData.name.trim() !== "" &&
    Boolean(formData.category_id) &&
    formData.purchase_price.trim() !== "" &&
    formData.selling_price.trim() !== "";

  if (initialLoading) {
    return <EditProductSkeleton />;
  }

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

      {/* Header with Back Button */}
      <AppPageHeader
        title="Edit Produk"
        subtitle={`Perbarui spesifikasi, harga, dan kuantitas stok untuk produk #${productId}`}
        onBack={() => router.push("/products")}
      />

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
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
          description="Kuantitas fisik yang tersedia di gudang dan batas minimum peringatan"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppInput
                label="Stok Fisik Saat Ini"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                error={fieldErrors.stock}
                helperText="Jumlah unit saat ini di gudang"
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

        {/* Bottom Form Actions */}
        <div className="d-flex align-items-center justify-content-end gap-3 pt-4 mt-2">
          <AppButton
            type="button"
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
            disabled={!isFormValid || loading}
          >
            Perbarui Produk
          </AppButton>
        </div>
      </form>
    </div>
  );
}
