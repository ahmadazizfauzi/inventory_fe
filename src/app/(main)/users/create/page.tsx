"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppPageHeader,
  AppFormSection,
  AppInput,
  AppDropdown,
  AppButton,
  AppAlert,
} from "@/components";
import { createUser } from "@/modules/users/services/user.service";
import { ICreateUserPayload } from "@/modules/users/types/user.types";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ variant: "danger" | "success"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ICreateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama lengkap wajib diisi";
    if (!formData.email.trim()) errors.email = "Alamat email wajib diisi";
    if (!formData.password || formData.password.length < 6) {
      errors.password = "Kata sandi minimal 6 karakter";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const res = await createUser(formData);
    if (res.status) {
      setFormData({ name: "", email: "", password: "", role: "staff" });
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "flash_alert",
          JSON.stringify({
            variant: "success",
            message: res.message || "Pengguna baru berhasil ditambahkan",
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
        message: res.message || "Gagal mendaftarkan akun staf/pengguna",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <AppPageHeader
        title="Tambah Staf / Pengguna"
        subtitle="Daftarkan akun staf baru dan tentukan tingkat hak akses otentikasi di sistem"
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

      <form onSubmit={handleSubmit}>
        <AppFormSection
          title="Informasi Profil & Akses"
          description="Lengkapi identitas staf, alamat email untuk login, kata sandi, serta hak akses."
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <AppInput
                label="NAMA LENGKAP *"
                placeholder="Contoh: Rian Gunawan"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                error={fieldErrors.name}
                helperText="Nama lengkap resmi operator atau administrator"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <AppInput
                label="ALAMAT EMAIL LOGIN *"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                error={fieldErrors.email}
                helperText="Digunakan sebagai username saat masuk ke portal"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <AppInput
                label="KATA SANDI *"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                error={fieldErrors.password}
                helperText="Kombinasi sandi pengaman akun minimal 6 karakter"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <AppDropdown
                label="HAK AKSES (ROLE) *"
                value={formData.role}
                onChange={(val) => setFormData((prev) => ({ ...prev, role: val as "superadmin" | "admin" | "staff" }))}
                options={[
                  { value: "staff", label: "Staff (Operator Gudang & Mutasi Stok)" },
                  { value: "admin", label: "Admin (Kelola Master Data & Mutasi)" },
                  { value: "superadmin", label: "Superadmin (Akses Penuh Seluruh Portal)" },
                ]}
                helperText="Pilih tingkat wewenang operasional pengguna"
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
            disabled={loading}
          >
            Batal
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={loading}
          >
            Simpan Pengguna
          </AppButton>
        </div>
      </form>
    </div>
  );
}
