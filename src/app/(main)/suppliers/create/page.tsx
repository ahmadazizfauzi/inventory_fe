"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppPageHeader,
  AppFormSection,
  AppInput,
  AppTextarea,
  AppButton,
  AppAlert,
} from "@/components";
import { createSupplier } from "@/modules/suppliers/services/supplier.service";
import { ICreateSupplierPayload } from "@/modules/suppliers/types/supplier.types";

export default function CreateSupplierPage() {
  const router = useRouter();
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
  }, [router]);

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
    const payload: ICreateSupplierPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
    };

    const res = await createSupplier(payload);
    setLoading(false);

    if (res.status) {
      setFormData({ name: "", phone: "", email: "", address: "" });
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Supplier berhasil ditambahkan",
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
        message: res.message || "Gagal menambahkan supplier baru",
      });
    }
  };

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
        title="Tambah Supplier"
        subtitle="Daftarkan mitra pemasok atau distributor baru untuk pengadaan stok barang"
        onBack={() => router.push("/suppliers")}
      />

      <form onSubmit={handleSubmit}>
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
          >
            Tambah Supplier
          </AppButton>
        </div>
      </form>
    </div>
  );
}
