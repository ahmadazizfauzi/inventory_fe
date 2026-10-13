"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AppSidebar,
  SidebarMenuGroup,
  AppSkeleton,
  AppBreadcrumb,
  AppModal,
  AppButton,
  AppTypography,
} from "@/components";
import ThemeToggle from "@/components/buttons/ThemeToggle";
import { getMe, logout } from "@/modules/auth/services/auth.service";
import { IUser } from "@/modules/auth/types/auth.types";
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ArrowLeftRight,
  Users,
  AlertCircle,
} from "lucide-react";

function MainSidebar({
  currentUser,
  onRequestLogout,
}: {
  currentUser: IUser | null;
  onRequestLogout: () => void;
}) {
  const pathname = usePathname();
  const isSuperAdmin = currentUser?.role === "superadmin";
  const isAdmin = currentUser?.role === "admin";

  const menuGroups: SidebarMenuGroup[] = [
    {
      heading: "OVERVIEW",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={17} />,
          href: "/dashboard",
          active: pathname === "/dashboard",
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
          href: "/products",
          active: pathname.startsWith("/products"),
        },
        {
          id: "categories",
          label: "Kategori",
          icon: <Layers size={17} />,
          href: "/categories",
          active: pathname.startsWith("/categories"),
        },
        {
          id: "suppliers",
          label: "Supplier",
          icon: <Truck size={17} />,
          href: "/suppliers",
          active: pathname.startsWith("/suppliers"),
        },
        {
          id: "stock-mutations",
          label: "Mutasi Stok",
          icon: <ArrowLeftRight size={17} />,
          href: "/stock-mutations",
          active: pathname.startsWith("/stock-mutations"),
        },
      ],
    },
  ];

  if (isSuperAdmin || isAdmin) {
    menuGroups.push({
      heading: "PENGGUNA & AKSES",
      items: [
        {
          id: "users",
          label: isSuperAdmin ? "Manajemen User & Staff" : "Manajemen Staff",
          icon: <Users size={17} />,
          href: "/users",
          active: pathname.startsWith("/users"),
        },
      ],
    });
  }

  return (
    <AppSidebar
      brandTitle="Inventory System"
      brandSubtitle="Backoffice Panel"
      menuGroups={menuGroups}
      width={250}
      user={{
        name: currentUser?.name || "Operator",
        role: currentUser?.role || "staff",
        onLogout: onRequestLogout,
      }}
    />
  );
}

function MainBreadcrumb() {
  const pathname = usePathname();

  if (pathname === "/products/create" || pathname === "/products/add") {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Produk & Stok", href: "/products" },
          { label: "Tambah Produk" },
        ]}
      />
    );
  }

  if (pathname.startsWith("/products/") && pathname.endsWith("/edit")) {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Produk & Stok", href: "/products" },
          { label: "Edit Produk" },
        ]}
      />
    );
  }

  if (pathname === "/categories/create" || pathname === "/categories/add") {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Kategori", href: "/categories" },
          { label: "Tambah Kategori" },
        ]}
      />
    );
  }

  if (pathname.startsWith("/categories/") && pathname.endsWith("/edit")) {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Kategori", href: "/categories" },
          { label: "Edit Kategori" },
        ]}
      />
    );
  }

  if (pathname === "/suppliers/create" || pathname === "/suppliers/add") {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Supplier", href: "/suppliers" },
          { label: "Tambah Supplier" },
        ]}
      />
    );
  }

  if (pathname.startsWith("/suppliers/") && pathname.endsWith("/edit")) {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Supplier", href: "/suppliers" },
          { label: "Edit Supplier" },
        ]}
      />
    );
  }

  if (pathname === "/stock-mutations/create" || pathname === "/stock-mutations/add") {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Mutasi Stok", href: "/stock-mutations" },
          { label: "Catat Mutasi Stok" },
        ]}
      />
    );
  }

  if (pathname === "/users/create" || pathname === "/users/add") {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Manajemen Staff", href: "/users" },
          { label: "Tambah Staf" },
        ]}
      />
    );
  }

  if (pathname.startsWith("/users/") && pathname.endsWith("/edit")) {
    return (
      <AppBreadcrumb
        showHomeIcon
        homeHref="/dashboard"
        separator="slash"
        items={[
          { label: "Manajemen Staff", href: "/users" },
          { label: "Edit Staf" },
        ]}
      />
    );
  }

  let group = "Overview";
  let page = "Dashboard";

  if (pathname.startsWith("/products")) {
    group = "Inventory";
    page = "Produk & Stok";
  } else if (pathname.startsWith("/categories")) {
    group = "Inventory";
    page = "Kategori";
  } else if (pathname.startsWith("/suppliers")) {
    group = "Inventory";
    page = "Supplier";
  } else if (pathname.startsWith("/stock-mutations")) {
    group = "Inventory";
    page = "Mutasi Stok";
  } else if (pathname.startsWith("/users")) {
    group = "Pengguna & Akses";
    page = "Manajemen Staff";
  }

  return (
    <AppBreadcrumb
      showHomeIcon
      homeHref="/dashboard"
      separator="slash"
      items={[
        { label: group },
        { label: page },
      ]}
    />
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const cached = localStorage.getItem("auth_user");
      if (cached) setCurrentUser(JSON.parse(cached));
    } catch {
      // ignore
    }

    getMe().then((res) => {
      if (res.status && res.user) {
        setCurrentUser(res.user);
        setLoading(false);
      } else {
        router.replace("/login");
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: "var(--app-bg)" }}>
        {/* Sidebar Skeleton */}
        <div
          className="d-flex flex-column border-end p-3 flex-shrink-0"
          style={{ width: 250, borderColor: "var(--app-border)", backgroundColor: "var(--app-surface)" }}
        >
          <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom" style={{ borderColor: "var(--app-border)" }}>
            <AppSkeleton width={10} height={10} variant="circular" />
            <AppSkeleton width="70%" height={18} />
          </div>
          <div className="d-flex flex-column gap-2 flex-grow-1">
            <AppSkeleton width="40%" height={12} className="mb-2" />
            <AppSkeleton width="100%" height={36} borderRadius={6} />
            <AppSkeleton width="40%" height={12} className="mt-3 mb-2" />
            <AppSkeleton width="100%" height={36} borderRadius={6} />
            <AppSkeleton width="100%" height={36} borderRadius={6} />
            <AppSkeleton width="100%" height={36} borderRadius={6} />
            <AppSkeleton width="100%" height={36} borderRadius={6} />
          </div>
          <div className="pt-3 border-top d-flex align-items-center gap-2" style={{ borderColor: "var(--app-border)" }}>
            <AppSkeleton width={32} height={32} variant="circular" />
            <div className="flex-grow-1">
              <AppSkeleton width="60%" height={14} className="mb-1" />
              <AppSkeleton width="40%" height={10} />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-grow-1 d-flex flex-column min-w-0 h-100">
          <header className="d-flex align-items-center justify-content-between px-4 border-bottom" style={{ height: 56, borderColor: "var(--app-border)", backgroundColor: "var(--app-surface)" }}>
            <AppSkeleton width={180} height={16} />
            <AppSkeleton width={40} height={24} borderRadius={12} />
          </header>
          <main className="flex-grow-1 p-4">
            <AppSkeleton width="30%" height={28} className="mb-2" />
            <AppSkeleton width="50%" height={16} className="mb-4" />
            <div className="row g-3 mb-4">
              <div className="col-3"><AppSkeleton height={100} borderRadius={10} /></div>
              <div className="col-3"><AppSkeleton height={100} borderRadius={10} /></div>
              <div className="col-3"><AppSkeleton height={100} borderRadius={10} /></div>
              <div className="col-3"><AppSkeleton height={100} borderRadius={10} /></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: "var(--app-bg)" }}>
      {/* Sidebar with Suspended Pathname */}
      <Suspense
        fallback={
          <div
            style={{ width: 250, borderColor: "var(--app-border)", backgroundColor: "var(--app-surface)" }}
            className="border-end h-100"
          />
        }
      >
        <MainSidebar
          currentUser={currentUser}
          onRequestLogout={() => setShowLogoutModal(true)}
        />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column min-w-0 h-100 overflow-hidden">
        <header
          className="d-flex align-items-center justify-content-between px-4 border-bottom flex-shrink-0"
          style={{
            backgroundColor: "var(--app-surface)",
            borderColor: "var(--app-border)",
            height: 56,
          }}
        >
          {/* Left: UI Kit AppBreadcrumb with Suspended Pathname */}
          <Suspense
            fallback={
              <AppBreadcrumb
                showHomeIcon
                homeHref="/dashboard"
                separator="slash"
                items={[{ label: "Overview" }, { label: "Dashboard" }]}
              />
            }
          >
            <MainBreadcrumb />
          </Suspense>

          {/* Right: Theme Toggle */}
          <div className="d-flex align-items-center">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-grow-1 p-4 overflow-y-auto">{children}</main>
      </div>

      {/* Logout Confirmation Modal - UI Kit Design */}
      <AppModal
        isOpen={showLogoutModal}
        onClose={() => !loggingOut && setShowLogoutModal(false)}
        title="Konfirmasi Keluar"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <AppButton
              variant="outlineSecondary"
              onClick={() => setShowLogoutModal(false)}
              disabled={loggingOut}
            >
              Batal
            </AppButton>
            <AppButton
              variant="danger"
              onClick={handleConfirmLogout}
              isLoading={loggingOut}
            >
              Ya, Keluar
            </AppButton>
          </div>
        }
      >
        <div className="d-flex align-items-start gap-3">
          <div className="p-2 rounded-circle bg-danger-subtle text-danger border border-danger-subtle flex-shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <AppTypography variant="cardTitle" tone="primary" className="mb-1 d-block">
              Apakah Anda yakin ingin keluar dari sistem inventaris?
            </AppTypography>
            <AppTypography variant="bodySm" tone="muted">
              Sesi autentikasi Anda akan diakhiri dan Anda harus login kembali untuk mengakses data portal inventaris.
            </AppTypography>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
