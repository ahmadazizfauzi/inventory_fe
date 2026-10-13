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
import { createCategory } from "@/modules/categories/services/category.service";
import { ICreateCategoryPayload } from "@/modules/categories/types/category.types";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "danger" | "success";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Role guard: redirect if staff
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("auth_user");
      if (cached) {
        try {
          const user = JSON.parse(cached);
          if (user.role === "staff") {
            router.replace("/categories");
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
    if (!formData.name.trim()) errors.name = "Nama kategori wajib diisi";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setAlert({
        variant: "danger",
        message: "Silakan lengkapi semua bidang isian wajib dengan benar.",
      });
      return;
    }

    setLoading(true);
    const payload: ICreateCategoryPayload = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    };

    const res = await createCategory(payload);
    setLoading(false);

    if (res.status) {
      setFormData({ name: "", description: "" });
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Kategori berhasil ditambahkan",
          })
        );
      }
      router.push("/categories");
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
        message: res.message || "Gagal menambahkan kategori baru",
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
        title="Tambah Kategori"
        subtitle="Daftarkan kelompok klasifikasi baru untuk pengelompokan produk inventaris"
        onBack={() => router.push("/categories")}
      />

      <form onSubmit={handleSubmit}>
        {/* Section: Informasi Kategori */}
        <AppFormSection
          title="Informasi Kategori"
          description="Nama klasifikasi kategori unik dan rincian cakupan jenis produk"
        >
          <div className="row g-3">
            <div className="col-12">
              <AppInput
                label="Nama Kategori *"
                placeholder="Contoh: Sembako & Bahan Pokok"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={fieldErrors.name}
                required
              />
            </div>

            <div className="col-12">
              <AppTextarea
                label="Deskripsi Kategori"
                placeholder="Tuliskan keterangan detail atau ruang lingkup kategori produk ini..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={fieldErrors.description}
              />
            </div>
          </div>
        </AppFormSection>

        {/* Bottom Form Actions */}
        <div className="d-flex align-items-center justify-content-end gap-3 pt-4 mt-2">
          <AppButton
            variant="outlineSecondary"
            size="md"
            onClick={() => router.push("/categories")}
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
            Tambah Kategori
          </AppButton>
        </div>
      </form>
    </div>
  );
}
