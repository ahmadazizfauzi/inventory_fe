"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  AppPageHeader,
  AppStatCard,
  AppButton,
  AppSkeletonStatCard,
} from "@/components";
import axiosInstance from "@/lib/axiosInstance";
import { formatRupiah } from "@/lib/formatters";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Package,
} from "lucide-react";

interface DashboardSummary {
  total_items: number;
  total_asset_value: number;
  total_market_value: number;
  potential_profit: number;
  low_stock_count: number;
  out_of_stock_count: number;
  today_mutations: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const res = await axiosInstance.get("/dashboard/summary");
      if (res.data?.data) setSummary(res.data.data);
    } catch (err) {
      console.error("Dashboard summary error:", err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Page Header */}
      <AppPageHeader
        title="Dashboard"
        subtitle="Ringkasan valuasi aset inventaris dan monitoring stok gudang."
        actions={
          <AppButton
            variant="outlineSecondary"
            size="sm"
            onClick={fetchSummary}
            isLoading={loadingSummary}
            icon={<RefreshCw size={13} />}
          >
            Segarkan
          </AppButton>
        }
      />

      {/* 4 Clean Stat Cards */}
      <div className="row g-3">
        {loadingSummary ? (
          <>
            <div className="col-12 col-sm-6 col-xl-3"><AppSkeletonStatCard /></div>
            <div className="col-12 col-sm-6 col-xl-3"><AppSkeletonStatCard /></div>
            <div className="col-12 col-sm-6 col-xl-3"><AppSkeletonStatCard /></div>
            <div className="col-12 col-sm-6 col-xl-3"><AppSkeletonStatCard /></div>
          </>
        ) : (
          <>
            <div className="col-12 col-sm-6 col-xl-3">
              <AppStatCard
                label="NILAI MODAL ASET (HPP)"
                value={summary ? formatRupiah(summary.total_asset_value) : "Rp 0"}
                subtitle="Total valuasi modal gudang"
                icon={<DollarSign size={16} />}
                colorScheme="primary"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <AppStatCard
                label="ESTIMASI NILAI JUAL"
                value={summary ? formatRupiah(summary.total_market_value) : "Rp 0"}
                subtitle="Potensi omzet seluruh stok"
                icon={<TrendingUp size={16} />}
                colorScheme="success"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <AppStatCard
                label="PROYEKSI MARGIN"
                value={summary ? formatRupiah(summary.potential_profit) : "Rp 0"}
                subtitle="Potensi laba kotor berjalan"
                icon={<Package size={16} />}
                colorScheme="info"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <AppStatCard
                label="STOK PERLU PERHATIAN"
                value={summary ? `${summary.low_stock_count} SKU` : "0 SKU"}
                subtitle={`${summary?.out_of_stock_count ?? 0} SKU habis total`}
                icon={<AlertTriangle size={16} />}
                colorScheme="warning"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
