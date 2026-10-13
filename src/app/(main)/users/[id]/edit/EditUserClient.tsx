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
import { getUserById, updateUser } from "@/modules/users/services/user.service";
import { IUpdateUserPayload } from "@/modules/users/types/user.types";

export default function EditUserClient() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ variant: "danger" | "success"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<IUpdateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
    if (!userId) return;

    getUserById(userId).then((res) => {
      if (res.status && res.data) {
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: "",
          role: res.data.role,
        });
      } else {
        setAlert({ variant: "danger", message: res.message || "Gagal memuat detail pengguna" });
      }
      setInitialLoading(false);
    });
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = "Nama lengkap wajib diisi";
    if (!formData.email?.trim()) errors.email = "Alamat email wajib diisi";
    if (formData.password && formData.password.length < 6) {
      errors.password = "Kata sandi minimal 6 karakter";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    const payload: IUpdateUserPayload = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };
    if (formData.password?.trim()) {
      payload.password = formData.password;
    }

    const res = await updateUser(Number(userId), payload);
    if (res.status) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Data pengguna berhasil diperbarui",
          })
        );
      }
      router.push("/users");
    } else {
      if (res.errors) {
        const mappedErrors: Record<string, string> = {};
        Object.entries(res.errors).forEach(([k, msgs]) => {
          mappedErrors[k] = msgs[0];
        });
        setFieldErrors(mappedErrors);
      }
      setAlert({
        variant: "danger",
        message: res.message || "Gagal memperbarui data pengguna",
      });
      setSubmitting(false);
    }
  };

  const isFormValid =
    (formData.name || "").trim() !== "" &&
    (formData.email || "").trim() !== "" &&
    (!formData.password || formData.password.length >= 6);

  if (initialLoading) {
    return (
      <div className="container-fluid p-0">
        <AppPageHeader title="Edit Akun Pengguna" subtitle="Memuat informasi akun..." />
        <div className="p-4 rounded-3 border" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
          <div className="d-flex flex-column gap-3">
            <AppSkeleton width="40%" height={24} />
            <AppSkeleton width="100%" height={45} />
            <AppSkeleton width="100%" height={45} />
            <AppSkeleton width="100%" height={45} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <AppPageHeader
        title="Edit Akun Pengguna"
        subtitle={`Perbarui profil dan wewenang pengguna ID #${userId}`}
        onBack={() => router.push("/users")}
      />

      {/* Floating Top-Right Alert Box */}
      {alert && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1090, maxWidth: 400, width: "100%" }}
        >
          <AppAlert
            variant={alert.variant}
            title={alert.variant === "success" ? "Berhasil" : "Kesalahan"}
            dismissible
            autoClose
            duration={5000}
            onDismiss={() => setAlert(null)}
          >
            {alert.message}
          </AppAlert>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <AppFormSection
          title="Informasi Profil & Wewenang"
          description="Ubah identitas staf, email masuk, kata sandi baru (opsional), dan hak akses."
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppInput
                label="NAMA LENGKAP *"
                placeholder="Contoh: Rian Gunawan"
                value={formData.name || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                error={fieldErrors.name}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <AppInput
                label="ALAMAT EMAIL LOGIN *"
                type="email"
                placeholder="name@company.com"
                value={formData.email || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                error={fieldErrors.email}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <AppInput
                label="KATA SANDI BARU (KOSONGKAN JIKA TIDAK DIUBAH)"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                error={fieldErrors.password}
                helperText="Isi hanya jika ingin mengganti kata sandi staf ini"
              />
            </div>

            <div className="col-12 col-md-6">
              <AppDropdown
                label="HAK AKSES (ROLE) *"
                value={formData.role || "staff"}
                onChange={(val) => setFormData((prev) => ({ ...prev, role: val as "superadmin" | "admin" | "staff" }))}
                options={[
                  { value: "staff", label: "Staff (Operator Gudang & Mutasi Stok)" },
                  { value: "admin", label: "Admin (Kelola Master Data & Mutasi)" },
                  { value: "superadmin", label: "Superadmin (Akses Penuh Seluruh Portal)" },
                ]}
                helperText="Pilih tingkat hak akses otoritas dalam sistem"
              />
            </div>
          </div>
        </AppFormSection>

        {/* Action Buttons Bottom-Right Only */}
        <div className="d-flex align-items-center justify-content-end gap-3 mt-4 pt-3 border-top">
          <AppButton
            variant="outlineSecondary"
            type="button"
            onClick={() => router.push("/users")}
            disabled={submitting}
          >
            Batal
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={!isFormValid || submitting}
          >
            Perbarui Akun
          </AppButton>
        </div>
      </form>
    </div>
  );
}
