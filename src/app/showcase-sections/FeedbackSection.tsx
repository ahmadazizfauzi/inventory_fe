"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppAlert from "@/components/feedback/AppAlert";
import AppModal from "@/components/feedback/AppModal";
import AppButton from "@/components/buttons/AppButton";
import { AlertCircle, Bell, CheckCircle2, AlertTriangle } from "lucide-react";

export default function FeedbackSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [topRightAlert, setTopRightAlert] = useState<{
    show: boolean;
    variant: "success" | "warning" | "danger" | "info";
    title: string;
    message: string;
  } | null>(null);

  const triggerTopRightAlert = (
    variant: "success" | "warning" | "danger" | "info",
    title: string,
    message: string
  ) => {
    setTopRightAlert({ show: true, variant, title, message });
  };

  return (
    <section id="feedback" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppAlert.tsx & AppModal.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Feedback, Alerts & Dialogs
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Komponen notifikasi pesan responsif dan dialog modal Bootstrap untuk konfirmasi aksi penting.
        </AppTypography>
      </div>

      {/* Floating Top-Right Alert Box with 5s Countdown Progress Bar */}
      {topRightAlert?.show && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1090, maxWidth: 400, width: "100%" }}
        >
          <AppAlert
            key={Date.now()}
            variant={topRightAlert.variant}
            title={topRightAlert.title}
            dismissible
            autoClose
            duration={5000}
            onDismiss={() => setTopRightAlert(null)}
          >
            {topRightAlert.message}
          </AppAlert>
        </div>
      )}

      {/* Interactive Trigger Buttons */}
      <div
        className="p-4 rounded-3 border mb-4"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <AppTypography variant="cardTitle" tone="primary" className="mb-2 d-block">
          Uji Coba Alert Notifikasi & Modal
        </AppTypography>
        <AppTypography variant="bodySm" tone="secondary" className="mb-3 d-block">
          Klik tombol di bawah untuk memunculkan alert notifikasi atau membuka dialog modal:
        </AppTypography>
        <div className="d-flex flex-wrap gap-2">
          <AppButton
            variant="success"
            icon={<CheckCircle2 size={16} />}
            onClick={() =>
              triggerTopRightAlert(
                "success",
                "Otentikasi Berhasil",
                "Token JWT berhasil diverifikasi dan tersimpan dengan aman."
              )
            }
          >
            Alert Sukses
          </AppButton>
          <AppButton
            variant="danger"
            icon={<AlertCircle size={16} />}
            onClick={() =>
              triggerTopRightAlert(
                "danger",
                "Stok Habis!",
                "Produk dengan kode SKU-SRV-001 telah mencapai 0 unit."
              )
            }
          >
            Alert Danger
          </AppButton>
          <AppButton
            variant="warning"
            icon={<AlertTriangle size={16} />}
            onClick={() =>
              triggerTopRightAlert(
                "warning",
                "Peringatan Restock",
                "5 barang terdeteksi berada di bawah batas minimum stok."
              )
            }
          >
            Alert Warning
          </AppButton>
          <AppButton variant="outlinePrimary" onClick={() => setModalOpen(true)}>
            Buka Dialog Konfirmasi
          </AppButton>
        </div>
      </div>

      {/* Static Alerts Preview */}
      <div className="d-flex flex-column gap-3">
        <AppAlert variant="success" title="Otentikasi Berhasil" dismissible>
          Token JWT berhasil diterbitkan. Akses ke seluruh endpoint inventaris telah diaktifkan.
        </AppAlert>

        <AppAlert variant="warning" title="Peringatan Restock Barang" dismissible>
          Terdapat 5 produk yang telah menyentuh batas minimum stok. Segera lakukan pengadaan.
        </AppAlert>

        <AppAlert variant="danger" title="Kesalahan Validasi Data" dismissible>
          Gagal menyimpan mutasi: Kuantitas keluar melebihi stok fisik yang tersedia di gudang.
        </AppAlert>

        <AppAlert variant="info" title="Informasi Sinkronisasi Database" dismissible>
          Seluruh log mutasi stok tersimpan dengan timestamp presisi pada tabel <code>stock_mutations</code>.
        </AppAlert>
      </div>

      {/* Modal Instance */}
      <AppModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Konfirmasi Mutasi Stok"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <AppButton variant="outlineSecondary" onClick={() => setModalOpen(false)}>
              Batal
            </AppButton>
            <AppButton variant="danger" onClick={() => setModalOpen(false)}>
              Ya, Proses Mutasi
            </AppButton>
          </div>
        }
      >
        <div className="d-flex align-items-start gap-3">
          <div className="p-2 rounded-circle bg-danger-subtle text-danger border border-danger-subtle">
            <AlertCircle size={24} />
          </div>
          <div>
            <AppTypography variant="cardTitle" tone="primary" className="mb-1 d-block">
              Apakah Anda yakin ingin memproses pengurangan stok?
            </AppTypography>
            <AppTypography variant="bodySm" tone="secondary">
              Aksi ini akan mencatat log mutasi stok tipe <strong>OUT</strong> dan mengurangi jumlah stok fisik di gudang secara permanen.
            </AppTypography>
          </div>
        </div>
      </AppModal>
    </section>
  );
}
