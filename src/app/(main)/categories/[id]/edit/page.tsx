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
  getCategoryById,
  updateCategory,
} from "@/modules/categories/services/category.service";
import { IUpdateCategoryPayload } from "@/modules/categories/types/category.types";

function EditCategorySkeleton() {
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
              <AppSkeleton height={100} borderRadius={8} />
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

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params?.id);

  const [initialLoading, setInitialLoading] = useState(true);
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

    if (!categoryId) return;

    getCategoryById(categoryId).then((res) => {
      if (res.status && res.data) {
        setFormData({
          name: res.data.name,
          description: res.data.description || "",
        });
      } else {
        setAlert({
          variant: "danger",
          message: res.message || "Kategori tidak ditemukan",
        });
      }
      setInitialLoading(false);
    });
  }, [categoryId, router]);

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
    const payload: IUpdateCategoryPayload = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    };

    const res = await updateCategory(categoryId, payload);
    setLoading(false);

    if (res.status) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Kategori berhasil diperbarui",
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
        message: res.message || "Gagal memperbarui kategori",
      });
    }
  };

  const isFormValid = formData.name.trim() !== "";

  if (initialLoading) {
    return <EditCategorySkeleton />;
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
        title="Edit Kategori"
        subtitle="Perbarui data kelompok klasifikasi kategori produk inventaris"
        onBack={() => router.push("/categories")}
      />

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
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
            type="button"
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
            disabled={!isFormValid || loading}
          >
            Simpan Perubahan
          </AppButton>
        </div>
      </form>
    </div>
  );
}
