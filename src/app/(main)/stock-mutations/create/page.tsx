"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppPageHeader,
  AppFormSection,
  AppInput,
  AppDropdown,
  AppTextarea,
  AppButton,
  AppAlert,
  AppSkeleton,
  AppBadge,
  AppTypography,
} from "@/components";
import { getProducts } from "@/modules/products/services/product.service";
import { IProduct } from "@/modules/products/types/product.types";
import { getSuppliers } from "@/modules/suppliers/services/supplier.service";
import { ISupplierItem } from "@/modules/suppliers/types/supplier.types";
import { createStockMutation } from "@/modules/stock-mutations/services/mutation.service";
import { ICreateMutationPayload } from "@/modules/stock-mutations/types/mutation.types";
import { ArrowDownLeft, ArrowUpRight, Package, Truck, Info } from "lucide-react";

function CreateMutationSkeleton() {
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

      {/* Form Section Skeleton */}
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
            <div className="col-12">
              <AppSkeleton width={110} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
            <div className="col-12">
              <AppSkeleton width={120} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Skeleton */}
      <div className="d-flex justify-content-end gap-3 pt-4">
        <AppSkeleton width={90} height={40} borderRadius={8} />
        <AppSkeleton width={150} height={40} borderRadius={8} />
      </div>
    </div>
  );
}

export default function CreateStockMutationPage() {
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplierItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    variant: "danger" | "success" | "warning";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    product_id: "",
    type: "in" as "in" | "out",
    quantity: "1",
    supplier_id: "",
    notes: "",
  });

  useEffect(() => {
    setFormData({
      product_id: "",
      type: "in",
      quantity: "1",
      supplier_id: "",
      notes: "",
    });
    setFieldErrors({});
    setAlert(null);

    Promise.all([
      getProducts({ per_page: 100 }),
      getSuppliers({ all: true }),
    ]).then(([prodRes, supRes]) => {
      if (prodRes.status && prodRes.data) {
        setProducts(prodRes.data);
      }
      if (supRes.status && supRes.data) {
        setSuppliers(supRes.data);
      }
      setInitialLoading(false);
    });
  }, []);

  const selectedProduct = products.find((p) => String(p.id) === formData.product_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!formData.product_id) {
      errors.product_id = "Produk wajib dipilih";
    }

    const qty = parseInt(formData.quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      errors.quantity = "Jumlah mutasi harus lebih besar dari 0";
    } else if (
      formData.type === "out" &&
      selectedProduct &&
      qty > selectedProduct.stock
    ) {
      errors.quantity = `Stok tidak mencukupi. Stok saat ini: ${selectedProduct.stock}`;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setAlert({
        variant: "danger",
        message: "Silakan periksa dan lengkapi data mutasi dengan benar.",
      });
      return;
    }

    setLoading(true);
    const payload: ICreateMutationPayload = {
      product_id: Number(formData.product_id),
      type: formData.type,
      quantity: qty,
      supplier_id:
        formData.type === "in" && formData.supplier_id
          ? Number(formData.supplier_id)
          : null,
      notes: formData.notes.trim() || undefined,
    };

    const res = await createStockMutation(payload);
    setLoading(false);

    if (res.status) {
      setFormData({
        product_id: "",
        type: "in",
        quantity: "1",
        supplier_id: "",
        notes: "",
      });
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Mutasi stok berhasil dicatat",
          })
        );
      }
      router.push("/stock-mutations");
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
        message: res.message || "Gagal mencatat mutasi stok",
      });
    }
  };

  if (initialLoading) {
    return <CreateMutationSkeleton />;
  }

  const qty = parseInt(formData.quantity, 10);
  const isFormValid =
    Boolean(formData.product_id) &&
    !isNaN(qty) &&
    qty > 0 &&
    (formData.type !== "out" || !selectedProduct || qty <= selectedProduct.stock);

  return (
    <div className="container-fluid p-0" style={{ maxWidth: 1200 }}>
      {/* Floating Top-Right Alert Box */}
      {alert && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1090, maxWidth: 400, width: "100%" }}
        >
          <AppAlert
            variant={alert.variant}
            title={
              alert.variant === "success"
                ? "Berhasil"
                : alert.variant === "danger"
                ? "Kesalahan"
                : "Pemberitahuan"
            }
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
        title="Catat Mutasi Stok"
        subtitle="Entri log perubahan stok barang masuk (pembelian/retur) atau barang keluar (penjualan/kerusakan)"
        onBack={() => router.push("/stock-mutations")}
      />

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        {/* Section: Pemilihan Produk & Jenis Mutasi */}
        <AppFormSection
          title="Produk & Arah Mutasi"
          description="Tentukan item inventaris yang mengalami mutasi dan jenis aliran barang"
        >
          <div className="row g-3">
            <div className="col-12">
              <label
                className="form-label fw-semibold mb-1"
                style={{ fontSize: "0.875rem", color: "var(--app-text)" }}
              >
                Pilih Produk *
              </label>
              <AppDropdown
                searchable
                searchPlaceholder="Cari nama atau SKU produk..."
                options={[
                  { label: "-- Pilih Produk Inventaris --", value: "" },
                  ...products.map((p) => ({
                    label: `${p.name} (${p.sku}) - Sisa Stok: ${p.stock}`,
                    value: String(p.id),
                  })),
                ]}
                value={formData.product_id}
                onChange={(val) => {
                  setFormData({ ...formData, product_id: String(val) });
                  if (fieldErrors.product_id) {
                    setFieldErrors({ ...fieldErrors, product_id: "" });
                  }
                }}
              />
              {fieldErrors.product_id && (
                <div className="text-danger small mt-1">{fieldErrors.product_id}</div>
              )}
            </div>

            {/* Product Stock Preview Card */}
            {selectedProduct && (
              <div className="col-12">
                <div
                  className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: "var(--app-surface-subtle)",
                    border: "1px solid var(--app-border)",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="p-2 rounded-2 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "rgba(99, 102, 241, 0.12)",
                        color: "var(--app-primary)",
                      }}
                    >
                      <Package size={22} />
                    </div>
                    <div>
                      <AppTypography variant="body" weight="semibold" className="m-0">
                        {selectedProduct.name}
                      </AppTypography>
                      <AppTypography variant="meta" tone="muted" className="m-0">
                        SKU: {selectedProduct.sku}
                      </AppTypography>
                    </div>
                  </div>
                  <div className="text-end">
                    <AppTypography variant="caption" tone="muted" className="m-0">
                      Stok Tersedia Saat Ini
                    </AppTypography>
                    <AppTypography variant="statValue" tone="accent" className="m-0">
                      {selectedProduct.stock} unit
                    </AppTypography>
                  </div>
                </div>
              </div>
            )}

            <div className="col-12">
              <AppTypography variant="label" className="mb-1 d-block">
                Jenis Mutasi Barang *
              </AppTypography>
              <AppDropdown
                options={[
                  { label: "Barang Masuk (IN) - Stok Bertambah", value: "in" },
                  { label: "Barang Keluar (OUT) - Stok Berkurang", value: "out" },
                ]}
                value={formData.type}
                onChange={(val) =>
                  setFormData({ ...formData, type: val as "in" | "out" })
                }
              />
            </div>
          </div>
        </AppFormSection>

        {/* Section: Rincian Jumlah & Pemasok */}
        <AppFormSection
          title="Kuantitas & Keterangan"
          description="Jumlah unit mutasi fisik, rekanan pemasok (jika barang masuk), dan catatan keperluan audit"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppInput
                type="number"
                label="Jumlah Kuantitas *"
                placeholder="Contoh: 10"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                error={fieldErrors.quantity}
                required
              />
              {selectedProduct && formData.type === "out" && (
                <div className="text-muted small mt-1">
                  Maksimum pengeluaran: <strong>{selectedProduct.stock}</strong> unit
                </div>
              )}
            </div>

            {formData.type === "in" && (
              <div className="col-12 col-md-6">
                <label
                  className="form-label fw-semibold mb-1"
                  style={{ fontSize: "0.875rem", color: "var(--app-text)" }}
                >
                  Supplier Pengirim (Opsional)
                </label>
                <AppDropdown
                  options={[
                    { label: "-- Tanpa Supplier / Retur Internal --", value: "" },
                    ...suppliers.map((s) => ({
                      label: s.name,
                      value: String(s.id),
                    })),
                  ]}
                  value={formData.supplier_id}
                  onChange={(val) =>
                    setFormData({ ...formData, supplier_id: String(val) })
                  }
                />
              </div>
            )}

            <div className="col-12">
              <AppTextarea
                label="Catatan / Referensi Mutasi"
                placeholder="Contoh: Pengiriman batch 12 dari supplier, atau Penyesuaian stok rusak, dsb."
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                error={fieldErrors.notes}
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
            onClick={() => router.push("/stock-mutations")}
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
            Simpan Mutasi Stok
          </AppButton>
        </div>
      </form>
    </div>
  );
}
