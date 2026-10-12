"use client";

import React from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppBadge from "@/components/badges/AppBadge";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, UserCheck } from "lucide-react";

export default function BadgesSection() {
  return (
    <section id="badges" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppBadge.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Badges & Status Indicators
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Label visual untuk penanda role pengguna (Admin/Staff), status ketersediaan stok, dan mutasi barang.
        </AppTypography>
      </div>

      {/* Inventory Status Badges */}
      <div className="p-4 rounded-3 border mb-3" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
        <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
          Inventory Status Badges
        </AppTypography>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <AppBadge variant="softSuccess" icon={<CheckCircle2 size={13} className="me-1" />}>
            In Stock (Aman)
          </AppBadge>
          <AppBadge variant="softWarning" icon={<AlertTriangle size={13} className="me-1" />}>
            Low Stock (Menipis)
          </AppBadge>
          <AppBadge variant="softDanger" icon={<XCircle size={13} className="me-1" />}>
            Out of Stock (Habis)
          </AppBadge>
          <AppBadge variant="softInfo" dot>
            Incoming Shipment
          </AppBadge>
          <AppBadge variant="softSecondary">
            Archived Item
          </AppBadge>
        </div>
      </div>

      {/* Role & Permission Badges */}
      <div className="p-4 rounded-3 border mb-3" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
        <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
          User Role Badges
        </AppTypography>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <AppBadge variant="softPrimary" icon={<ShieldCheck size={13} className="me-1" />} pill>
            Superadmin
          </AppBadge>
          <AppBadge variant="softInfo" icon={<UserCheck size={13} className="me-1" />} pill>
            Admin Gudang
          </AppBadge>
          <AppBadge variant="softSecondary" pill>
            Staff Operator
          </AppBadge>
        </div>
      </div>

      {/* Solid Badges */}
      <div className="p-4 rounded-3 border" style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}>
        <AppTypography variant="cardTitle" tone="primary" className="mb-3 d-block">
          Solid Badges
        </AppTypography>
        <div className="d-flex flex-wrap gap-2">
          <AppBadge variant="primary">Primary</AppBadge>
          <AppBadge variant="success">Success</AppBadge>
          <AppBadge variant="danger">Danger</AppBadge>
          <AppBadge variant="warning">Warning</AppBadge>
          <AppBadge variant="info">Info</AppBadge>
          <AppBadge variant="dark">Dark</AppBadge>
        </div>
      </div>
    </section>
  );
}
