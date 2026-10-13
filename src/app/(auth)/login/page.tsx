"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppCard,
  AppCardBody,
  AppInput,
  AppButton,
  AppAlert,
  AppTypography,
} from "@/components";
import ThemeToggle from "@/components/buttons/ThemeToggle";
import { login } from "@/modules/auth/services/auth.service";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<{
    variant: "danger" | "success" | "warning";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fillDemo = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword("password");
    setSelectedDemo(roleName);
    setAlertInfo(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email wajib diisi";
    if (!password) errors.password = "Password wajib diisi";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (result.status) {
      router.replace("/dashboard");
    } else {
      if (result.errors) {
        const mappedErrors: Record<string, string> = {};
        Object.entries(result.errors).forEach(([field, msgs]) => {
          mappedErrors[field] = msgs[0];
        });
        setFieldErrors(mappedErrors);
      }
      setAlertInfo({
        variant: "danger",
        message: result.message || "Gagal masuk. Periksa kembali email dan password.",
      });
    }
  };

  return (
    <div
      className="auth-page-container p-3 p-md-4"
      suppressHydrationWarning
    >
      {/* Floating Top-Right Alert Box */}
      {alertInfo && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1090, maxWidth: 400, width: "100%" }}
        >
          <AppAlert
            variant={alertInfo.variant}
            title={alertInfo.variant === "danger" ? "Autentikasi Gagal" : "Berhasil"}
            dismissible
            autoClose
            duration={5000}
            onDismiss={() => setAlertInfo(null)}
          >
            {alertInfo.message}
          </AppAlert>
        </div>
      )}

      {/* Top Header Controls */}
      <div className="position-absolute top-0 end-0 p-3 p-md-4" style={{ zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div className="w-100 position-relative" style={{ maxWidth: 440, zIndex: 5 }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <AppTypography variant="h1" className="m-0">
            Enterprise Inventory
          </AppTypography>
          <AppTypography variant="bodySm" tone="muted" className="mt-2 mb-0">
            Masuk ke portal manajemen inventaris & audit stok gudang
          </AppTypography>
        </div>

        {/* Main Card with UI Kit Surface */}
        <AppCard
          className="rounded-4 border shadow-lg"
          style={{
            backgroundColor: "var(--app-surface)",
            borderColor: "var(--app-border-subtle)",
          }}
        >
          <AppCardBody className="p-4 p-sm-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <AppInput
                  label="Alamat Email"
                  type="email"
                  placeholder="name@company.com"
                  icon={<Mail size={16} />}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedDemo(null);
                  }}
                  error={fieldErrors.email}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mb-4">
                <AppInput
                  label="Kata Sandi"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSelectedDemo(null);
                  }}
                  error={fieldErrors.password}
                  autoComplete="current-password"
                  required
                />
              </div>

              <AppButton
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                isLoading={loading}
                className="py-2 fw-semibold"
              >
                Login
              </AppButton>
            </form>

            {/* Quick Demo Segmented Row */}
            <div className="pt-3 mt-4 border-top" style={{ borderColor: "var(--app-border)" }}>
              <div className="row g-2">
                <div className="col-4">
                  <AppButton
                    type="button"
                    size="sm"
                    variant={selectedDemo === "Superadmin" ? "primary" : "secondary"}
                    fullWidth
                    onClick={() => fillDemo("superadmin@demo.com", "Superadmin")}
                  >
                    Superadmin
                  </AppButton>
                </div>
                <div className="col-4">
                  <AppButton
                    type="button"
                    size="sm"
                    variant={selectedDemo === "Admin" ? "primary" : "secondary"}
                    fullWidth
                    onClick={() => fillDemo("admin@demo.com", "Admin")}
                  >
                    Admin
                  </AppButton>
                </div>
                <div className="col-4">
                  <AppButton
                    type="button"
                    size="sm"
                    variant={selectedDemo === "Staff" ? "primary" : "secondary"}
                    fullWidth
                    onClick={() => fillDemo("staff@demo.com", "Staff")}
                  >
                    Staff
                  </AppButton>
                </div>
              </div>
            </div>
          </AppCardBody>
        </AppCard>

        {/* Footer Navigation */}
        <div className="text-center mt-4 d-flex align-items-center justify-content-center gap-1">
          <AppTypography variant="bodySm" tone="muted" className="m-0">
            Belum memiliki akun operator?
          </AppTypography>
          <Link
            href="/register"
            className="d-inline-flex align-items-center gap-1 text-decoration-none fw-semibold small text-primary"
          >
            Daftar Baru <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
