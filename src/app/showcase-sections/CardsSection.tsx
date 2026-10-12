"use client";

import React from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppStatCard from "@/components/cards/AppStatCard";
import { AppCard, AppCardHeader, AppCardBody, AppCardFooter } from "@/components/cards/AppCard";
import AppButton from "@/components/buttons/AppButton";
import AppBadge from "@/components/badges/AppBadge";
import { DollarSign, Package, AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react";

export default function CardsSection() {
  return (
    <section id="cards" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppStatCard.tsx & AppCard.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Cards & Dashboard Metrics
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Panel kartu representasi data keuangan dan operasional inventaris dengan ukuran lebar, leluasa, dan bersih.
        </AppTypography>
      </div>

      {/* Spacious 2-Column Wide Grid for Metric Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <AppStatCard
            label="Total Nilai Aset (Beli)"
            value="Rp 45.850.000"
            colorScheme="primary"
            icon={<DollarSign size={26} />}
          />
        </div>
        <div className="col-12 col-md-6">
          <AppStatCard
            label="Estimasi Nilai Pasar (Jual)"
            value="Rp 62.400.000"
            colorScheme="success"
            icon={<TrendingUp size={26} />}
          />
        </div>
        <div className="col-12 col-md-6">
          <AppStatCard
            label="Total Item Produk Terdaftar"
            value="150 SKU"
            colorScheme="info"
            icon={<Package size={26} />}
          />
        </div>
        <div className="col-12 col-md-6">
          <AppStatCard
            label="Stok Kritis / Menipis"
            value="5 Produk"
            colorScheme="warning"
            icon={<AlertTriangle size={26} />}
          />
        </div>
      </div>

      {/* Content Card Example */}
      <div className="p-0">
        <AppCard>
          <AppCardHeader className="d-flex align-items-center justify-content-between">
            <div>
              <AppTypography variant="cardTitle" tone="primary" className="m-0">
                Ringkasan Gudang & Audit Mutasi
              </AppTypography>
              <AppTypography variant="caption" tone="muted">
                Pembaruan otomatis dari database MySQL
              </AppTypography>
            </div>
            <AppBadge variant="softSuccess" dot>
              Database Connected
            </AppBadge>
          </AppCardHeader>
          <AppCardBody>
            <AppTypography variant="body" tone="secondary" className="mb-3">
              Modul ini mengkalkulasi selisih harga beli dan harga jual untuk menyajikan estimasi margin laba secara akurat pada setiap mutasi masuk dan keluar.
            </AppTypography>
            <div className="p-3 rounded-2 border" style={{ backgroundColor: "var(--app-surface-subtle)", borderColor: "var(--app-border)" }}>
              <AppTypography variant="meta" tone="accent">
                Formula: Potential Profit = SUM(stock * (selling_price - purchase_price))
              </AppTypography>
            </div>
          </AppCardBody>
          <AppCardFooter className="d-flex justify-content-between align-items-center">
            <AppTypography variant="caption" tone="muted">
              Diperbarui: Hari ini 23:00 WIB
            </AppTypography>
            <AppButton size="sm" variant="outlinePrimary" icon={<ArrowUpRight size={14} />}>
              Lihat Detail
            </AppButton>
          </AppCardFooter>
        </AppCard>
      </div>
    </section>
  );
}
