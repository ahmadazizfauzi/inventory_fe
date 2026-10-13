"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  AppPageHeader,
  AppFormSection,
  AppInput,
  AppTextarea,
  AppButton,
  AppAlert,
  AppSkeleton,
} from "@/components";
import {
  getSupplierById,
  updateSupplier,
} from "@/modules/suppliers/services/supplier.service";
import { IUpdateSupplierPayload } from "@/modules/suppliers/types/supplier.types";

function EditSupplierSkeleton() {
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

      {/* Section 1 Skeleton */}
      <div
        className="row g-4 py-4 border-bottom"
        style={{ borderColor: "var(--app-border)" }}
      >
        <div className="col-12 col-md-4">
          <AppSkeleton width={140} height={20} className="mb-2" />
          <AppSkeleton width={230} height={14} />
        </div>
        <div className="col-12 col-md-8">
          <AppSkeleton width={110} height={16} className="mb-2" />
          <AppSkeleton height={42} borderRadius={8} />
        </div>
      </div>

      {/* Section 2 Skeleton */}
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
              <AppSkeleton width={110} height={16} className="mb-2" />
              <AppSkeleton height={42} borderRadius={8} />
            </div>
            <div className="col-12">
              <AppSkeleton width={110} height={16} className="mb-2" />
              <AppSkeleton height={80} borderRadius={8} />
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

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = Number(params?.id);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "danger" | "success";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Role guard: redirect if staff
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("auth_user");
      if (cached) {
        try {
          const user = JSON.parse(cached);
          if (user.role === "staff") {
            router.replace("/suppliers");
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    if (!supplierId) return;

    getSupplierById(supplierId).then((res) => {
      if (res.status && res.data) {
        setFormData({
          name: res.data.name,
          phone: res.data.phone || "",
          email: res.data.email || "",
          address: res.data.address || "",
        });
      } else {
        setAlert({
          variant: "danger",
          message: res.message || "Supplier tidak ditemukan",
        });
      }
      setInitialLoading(false);
    });
  }, [supplierId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama supplier wajib diisi";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setAlert({
        variant: "danger",
        message: "Silakan lengkapi semua bidang isian wajib dengan benar.",
      });
      return;
    }

    setLoading(true);
    const payload: IUpdateSupplierPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
    };

    const res = await updateSupplier(supplierId, payload);
    setLoading(false);

    if (res.status) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Supplier berhasil diperbarui",
          })
        );
      }
      router.push("/suppliers");
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
        message: res.message || "Gagal memperbarui data supplier",
      });
    }
  };

  const isFormValid = formData.name.trim() !== "";

  if (initialLoading) {
    return <EditSupplierSkeleton />;
  }

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
        title="Edit Supplier"
        subtitle="Perbarui data kontak dan rincian informasi mitra supplier"
        onBack={() => router.push("/suppliers")}
      />

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        {/* Section: Informasi Supplier */}
        <AppFormSection
          title="Informasi Supplier"
          description="Nama resmi badan usaha atau penyedia pasokan barang inventaris"
        >
          <div className="row g-3">
            <div className="col-12">
              <AppInput
                label="Nama Supplier *"
                placeholder="Contoh: PT Sumber Pangan Makmur"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={fieldErrors.name}
                required
              />
            </div>
          </div>
        </AppFormSection>

        {/* Section: Kontak & Alamat */}
        <AppFormSection
          title="Kontak & Alamat"
          description="Nomor telepon, email korespondensi, dan alamat kantor/gudang supplier"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppInput
                label="Nomor Telepon"
                placeholder="Contoh: 081234567890 atau 021-5551234"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={fieldErrors.phone}
              />
            </div>

            <div className="col-12 col-md-6">
              <AppInput
                type="email"
                label="Alamat Email"
                placeholder="Contoh: kontak@supplier.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={fieldErrors.email}
              />
            </div>

            <div className="col-12">
              <AppTextarea
                label="Alamat Lengkap"
                placeholder="Tuliskan jalan, kelurahan, kecamatan, kota atau rincian lokasi gudang..."
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={fieldErrors.address}
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
            onClick={() => router.push("/suppliers")}
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
            Simpan Perubahan
          </AppButton>
        </div>
      </form>
    </div>
  );
}
