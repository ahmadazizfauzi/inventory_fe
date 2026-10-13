"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AppPageHeader,
  AppCard,
  AppCardBody,
  AppTable,
  AppPagination,
  AppBadge,
  AppButton,
  AppModal,
  AppAlert,
  AppSkeleton,
  AppTypography,
  AppSearchFilterBar,
  ColumnDef,
} from "@/components";
import { Plus, Pencil, Trash2, ShieldCheck, UserCheck, Shield, AlertCircle } from "lucide-react";
import { getUsers, deleteUser } from "@/modules/users/services/user.service";
import { IUserItem } from "@/modules/users/types/user.types";
import { formatDate } from "@/lib/formatters";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<IUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");

  const [alert, setAlert] = useState<{ variant: "success" | "danger"; message: string } | null>(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async (page = 1, searchParam?: string) => {
    setLoading(true);
    const effectiveSearch = searchParam !== undefined ? searchParam : search;
    const res = await getUsers(page, 10, effectiveSearch);
    if (res.status) {
      setUsers(res.data);
      const pag = (res as any).pagination || res.meta;
      if (pag) {
        setCurrentPage(pag.current_page || page);
        setTotalPages(pag.total_pages || pag.last_page || 1);
        setTotalItems(pag.total || res.data.length);
      }
    } else {
      setAlert({ variant: "danger", message: res.message || "Gagal memuat data staf/pengguna" });
    }
    setLoading(false);
  }, []);

  // Flash alert detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const flash = sessionStorage.getItem("flash_alert");
      if (flash) {
        try {
          setAlert(JSON.parse(flash));
        } catch {
          // ignore
        }
        sessionStorage.removeItem("flash_alert");
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  const handleOpenDeleteModal = (user: IUserItem) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    const res = await deleteUser(userToDelete.id);
    if (res.status) {
      setAlert({ variant: "success", message: "Akun berhasil dihapus dari sistem" });
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers(currentPage);
    } else {
      setAlert({ variant: "danger", message: res.message || "Gagal menghapus akun" });
    }
    setDeleting(false);
  };

  const columns: ColumnDef<IUserItem>[] = [
    {
      key: "no",
      header: "No",
      width: 60,
      align: "center",
      render: (_, index) => (
        <span className="font-mono text-muted">
          {(currentPage - 1) * 10 + index + 1}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Tanggal Registrasi",
      align: "center",
      render: (row) => (
        <AppTypography variant="meta" tone="muted" className="m-0 text-center">
          {formatDate(row.created_at)}
        </AppTypography>
      ),
    },
    {
      key: "name",
      header: "Nama Lengkap",
      render: (row) => (
        <div className="d-flex flex-column">
          <AppTypography variant="body" weight="semibold" className="text-truncate m-0">
            {row.name}
          </AppTypography>
          <AppTypography variant="meta" tone="muted" className="m-0">
            {row.email}
          </AppTypography>
        </div>
      ),
    },
    {
      key: "role",
      header: "Hak Akses (Role)",
      align: "center",
      render: (row) => {
        if (row.role === "superadmin") {
          return (
            <AppBadge variant="softDanger" dot icon={<ShieldCheck size={12} />}>
              Superadmin
            </AppBadge>
          );
        }
        if (row.role === "admin") {
          return (
            <AppBadge variant="softPrimary" dot icon={<Shield size={12} />}>
              Admin
            </AppBadge>
          );
        }
        return (
          <AppBadge variant="softSecondary" dot icon={<UserCheck size={12} />}>
            Staff
          </AppBadge>
        );
      },
    },
    {
      key: "actions",
      header: "Aksi",
      align: "right",
      render: (row) => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          <AppButton
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/users/${row.id}/edit`)}
            title="Edit Pengguna"
            className="p-1 text-primary"
          >
            <Pencil size={15} />
          </AppButton>
          <AppButton
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDeleteModal(row)}
            title="Hapus Pengguna"
            className="p-1 text-danger"
          >
            <Trash2 size={15} />
          </AppButton>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid p-0">
      <AppPageHeader
        title="Manajemen Staff & Pengguna"
        subtitle="Kelola akun operator, administrator, dan hak akses otentikasi portal inventaris"
        actions={
          <AppButton
            variant="primary"
            size="md"
            icon={<Plus size={16} />}
            onClick={() => router.push("/users/create")}
          >
            Tambah Staf Baru
          </AppButton>
        }
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
            duration={4000}
            onDismiss={() => setAlert(null)}
          >
            {alert.message}
          </AppAlert>
        </div>
      )}

      {/* UI Kit Search Bar */}
      <AppSearchFilterBar
        searchValue={search}
        onSearchSubmit={(val) => {
          setSearch(val);
          setCurrentPage(1);
          fetchUsers(1, val);
        }}
        searchPlaceholder="Cari nama atau email pengguna..."
      />

      {/* Main Content Card with Table and Pagination */}
      <AppCard>
        <AppCardBody className="p-0">
          <AppTable<IUserItem>
            columns={columns}
            data={users}
            keyExtractor={(row) => row.id}
            isLoading={loading}
            emptyMessage="Belum ada data staf atau pengguna terdaftar."
          />

          <div
            className="p-3 border-top"
            style={{ borderColor: "var(--app-border)" }}
          >
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={10}
              onPageChange={(p) => {
                setCurrentPage(p);
                fetchUsers(p);
              }}
            />
          </div>
        </AppCardBody>
      </AppCard>

      {/* Delete Confirmation Modal - UI Kit Design */}
      <AppModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus Akun"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <AppButton
              variant="outlineSecondary"
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Batal
            </AppButton>
            <AppButton
              variant="danger"
              type="button"
              isLoading={deleting}
              onClick={handleConfirmDelete}
            >
              Ya, Hapus Akun
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
              Apakah Anda yakin ingin menghapus akun ini?
            </AppTypography>
            <AppTypography variant="bodySm" tone="muted">
              Akun <strong className="text-body">{userToDelete?.name}</strong> ({userToDelete?.email}) akan dihapus secara permanen dari sistem.
            </AppTypography>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
