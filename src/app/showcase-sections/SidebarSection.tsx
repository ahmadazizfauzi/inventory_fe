"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppSidebar, { SidebarMenuGroup } from "@/components/navigation/AppSidebar";
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ArrowLeftRight,
  Users,
  Settings,
} from "lucide-react";

export default function SidebarSection() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const sampleMenuGroups: SidebarMenuGroup[] = [
    {
      heading: "OVERVIEW",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={17} />,
          onClick: () => setActiveMenu("dashboard"),
        },
      ],
    },
    {
      heading: "INVENTORY",
      items: [
        {
          id: "products",
          label: "Produk & Stok",
          icon: <Package size={17} />,
          onClick: () => setActiveMenu("products"),
        },
        {
          id: "categories",
          label: "Kategori",
          icon: <Layers size={17} />,
          onClick: () => setActiveMenu("categories"),
        },
        {
          id: "suppliers",
          label: "Supplier",
          icon: <Truck size={17} />,
          onClick: () => setActiveMenu("suppliers"),
        },
        {
          id: "stock-mutations",
          label: "Mutasi Stok",
          icon: <ArrowLeftRight size={17} />,
          onClick: () => setActiveMenu("stock-mutations"),
        },
      ],
    },
    {
      heading: "SISTEM",
      items: [
        {
          id: "users",
          label: "Manajemen User",
          icon: <Users size={17} />,
          onClick: () => setActiveMenu("users"),
        },
        {
          id: "settings",
          label: "Pengaturan",
          icon: <Settings size={17} />,
          onClick: () => setActiveMenu("settings"),
        },
      ],
    },
  ];

  return (
    <section id="sidebar" className="mb-5 pb-4">
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppSidebar.tsx
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Sidebar Navigation
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Komponen sidebar backoffice berbasis Bootstrap dengan grup heading, item navigasi aktif, dan widget profil admin.
        </AppTypography>
      </div>

      <div
        className="rounded-3 border overflow-hidden p-0 shadow-sm"
        style={{
          backgroundColor: "var(--app-surface)",
          borderColor: "var(--app-border)",
          maxWidth: 320,
        }}
      >
        <AppSidebar
          brandTitle="Inventory System"
          brandSubtitle="Backoffice Panel"
          menuGroups={sampleMenuGroups}
          activeId={activeMenu}
          width="100%"
          user={{
            name: "Ahmad Aziz Fauzi",
            role: "Superadmin",
            onLogout: () => alert("Logout action triggered"),
          }}
        />
      </div>
    </section>
  );
}
