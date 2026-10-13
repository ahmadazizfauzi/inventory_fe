"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppButton from "@/components/buttons/AppButton";
import { AppCard, AppCardHeader, AppCardBody } from "@/components/cards/AppCard";
import AppSkeleton, {
  AppSkeletonStatCard,
  AppSkeletonTableRow,
} from "@/components/feedback/AppSkeleton";
import { RefreshCw } from "lucide-react";

export default function SkeletonSection() {
  const [pulseMode, setPulseMode] = useState(false);

  return (
    <section id="skeleton" className="mb-5 pb-4">
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppSkeleton.tsx
        </AppTypography>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <AppTypography variant="h2" tone="primary" className="mb-2">
              Skeleton Loading States
            </AppTypography>
            <AppTypography variant="pageSubtitle" tone="secondary">
              Komponen placeholder berbasis shimmer dan pulse animation untuk transisi data loading tanpa spinner konvensional.
            </AppTypography>
          </div>
          <AppButton
            variant="outlineSecondary"
            size="sm"
            onClick={() => setPulseMode(!pulseMode)}
            icon={<RefreshCw size={14} />}
          >
            Mode: {pulseMode ? "Pulse Animation" : "Shimmer Wave"}
          </AppButton>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Basic Primitives */}
        <div className="col-12 col-md-6">
          <AppCard className="h-100">
            <AppCardHeader>
              <AppTypography variant="cardTitle" tone="primary" className="m-0">
                1. Bentuk Dasar (Primitives)
              </AppTypography>
            </AppCardHeader>
            <AppCardBody>
              <div className="d-flex flex-column gap-3">
                <div>
                  <span className="small text-muted d-block mb-1 font-mono">variant=&quot;text&quot; (Baris Teks):</span>
                  <div className="d-flex flex-column gap-2">
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} variant="text" width="100%" height={16} />
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} variant="text" width="85%" height={16} />
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} variant="text" width="60%" height={16} />
                  </div>
                </div>

                <div className="pt-2 border-top" style={{ borderColor: "var(--app-border)" }}>
                  <span className="small text-muted d-block mb-2 font-mono">variant=&quot;circular&quot; (Avatar / Icon):</span>
                  <div className="d-flex align-items-center gap-3">
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} variant="circular" width={48} height={48} />
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} variant="circular" width={36} height={36} />
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} variant="circular" width={28} height={28} />
                  </div>
                </div>

                <div className="pt-2 border-top" style={{ borderColor: "var(--app-border)" }}>
                  <span className="small text-muted d-block mb-2 font-mono">variant=&quot;rounded&quot; (Tombol / Badge):</span>
                  <div className="d-flex align-items-center gap-2">
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} width={110} height={34} borderRadius={8} />
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} width={80} height={34} borderRadius={8} />
                    <AppSkeleton animation={pulseMode ? "pulse" : "shimmer"} width={60} height={24} borderRadius={12} />
                  </div>
                </div>
              </div>
            </AppCardBody>
          </AppCard>
        </div>

        {/* Specialized Stat Card Skeleton */}
        <div className="col-12 col-md-6">
          <AppCard className="h-100">
            <AppCardHeader>
              <AppTypography variant="cardTitle" tone="primary" className="m-0">
                2. AppSkeletonStatCard
              </AppTypography>
            </AppCardHeader>
            <AppCardBody>
              <p className="small text-muted mb-3">
                Struktur skeleton khusus yang mereplikasi tata letak metrik finansial pada kartu dashboard.
              </p>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <AppSkeletonStatCard />
                </div>
                <div className="col-12 col-sm-6">
                  <AppSkeletonStatCard />
                </div>
              </div>
            </AppCardBody>
          </AppCard>
        </div>
      </div>

      {/* Table Row Skeletons */}
      <AppCard>
        <AppCardHeader>
          <AppTypography variant="cardTitle" tone="primary" className="m-0">
            3. AppSkeletonTableRow (Tabel Placeholder)
          </AppTypography>
        </AppCardHeader>
        <AppCardBody className="p-0">
          <div className="table-responsive">
            <table className="table app-table align-middle mb-0">
              <thead>
                <tr>
                  <th className="py-3 px-3">Produk</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3 text-center">Stok</th>
                  <th className="py-3 px-3 text-end">Harga Beli</th>
                  <th className="py-3 px-3 text-end">Harga Jual</th>
                </tr>
              </thead>
              <tbody>
                <AppSkeletonTableRow cols={5} height={20} />
                <AppSkeletonTableRow cols={5} height={20} />
                <AppSkeletonTableRow cols={5} height={20} />
              </tbody>
            </table>
          </div>
        </AppCardBody>
      </AppCard>
    </section>
  );
}
