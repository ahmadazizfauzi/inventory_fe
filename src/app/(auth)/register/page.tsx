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
} from "@/components";
import ThemeToggle from "@/components/buttons/ThemeToggle";
import { register } from "@/modules/auth/services/auth.service";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    variant: "danger" | "success" | "warning";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Nama lengkap wajib diisi";
    if (!email.trim()) errors.email = "Alamat email wajib diisi";
    if (password.length < 6) errors.password = "Kata sandi minimal 6 karakter";
    if (password !== passwordConfirmation) {
      errors.password_confirmation = "Konfirmasi kata sandi tidak cocok";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    setLoading(false);

    if (result.status) {
      setAlertInfo({
        variant: "success",
        message: `Akun atas nama "${result.data?.user.name}" berhasil didaftarkan! Mengalihkan ke sistem...`,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
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
        message: result.message || "Pendaftaran gagal. Silakan periksa formulir kembali.",
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
            title={alertInfo.variant === "danger" ? "Pendaftaran Gagal" : "Pendaftaran Berhasil"}
            dismissible
            autoClose
            duration={alertInfo.variant === "danger" ? 5000 : 2000}
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

      <div className="w-100 position-relative" style={{ maxWidth: 460, zIndex: 5 }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <h1
            className="m-0 fw-bold tracking-tight"
            style={{
              fontSize: "1.75rem",
              letterSpacing: "-0.03em",
              color: "var(--app-text)",
            }}
          >
            Registrasi Operator
          </h1>
          <p
            className="mt-2 mb-0"
            style={{
              fontSize: "0.875rem",
              color: "var(--app-text-muted)",
            }}
          >
            Daftarkan akun staf baru ke portal manajemen inventaris
          </p>
        </div>

        {/* Main Card */}
        <AppCard
          className="rounded-4 border shadow-lg"
          style={{
            backgroundColor: "var(--app-surface)",
            borderColor: "var(--app-border-subtle)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.35)",
          }}
        >
          <AppCardBody className="p-4 p-sm-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <AppInput
                  label="Nama Lengkap"
                  type="text"
                  placeholder="Contoh: Rian Gunawan"
                  icon={<User size={16} />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={fieldErrors.name}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="mb-3">
                <AppInput
                  label="Alamat Email"
                  type="email"
                  placeholder="name@company.com"
                  icon={<Mail size={16} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mb-3">
                <AppInput
                  label="Kata Sandi (Minimal 6 karakter)"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="mb-4">
                <AppInput
                  label="Ulangi Kata Sandi"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  error={fieldErrors.password_confirmation}
                  autoComplete="new-password"
                  required
                />
              </div>

              <AppButton
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                isLoading={loading}
                icon={<UserPlus size={18} />}
                className="py-2 fw-semibold"
              >
                Daftar Akun Baru
              </AppButton>
            </form>
          </AppCardBody>
        </AppCard>

        {/* Back to Login */}
        <div className="text-center mt-4 d-flex align-items-center justify-content-center gap-1">
          <span style={{ fontSize: "0.875rem", color: "var(--app-text-muted)" }}>
            Sudah memiliki akun?
          </span>
          <Link
            href="/login"
            className="d-inline-flex align-items-center gap-1 text-decoration-none fw-semibold"
            style={{ color: "var(--app-primary)", fontSize: "0.875rem", lineHeight: 1 }}
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
}
