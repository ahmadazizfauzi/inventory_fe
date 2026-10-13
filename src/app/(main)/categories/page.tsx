"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppPageHeader,
  AppCard,
  AppCardBody,
  AppTable,
  AppPagination,
  AppButton,
  AppBadge,
  AppModal,
  AppAlert,
  AppSearchFilterBar,
  AppTypography,
  ColumnDef,
} from "@/components";
import {
  getCategories,
  deleteCategory,
} from "@/modules/categories/services/category.service";
import { ICategoryItem } from "@/modules/categories/types/category.types";
import { IUser } from "@/modules/auth/types/auth.types";
import { getMe } from "@/modules/auth/services/auth.service";
import { Plus, Pencil, Trash2, Layers, AlertCircle } from "lucide-react";

export default function CategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ICategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [alert, setAlert] = useState<{
    variant: "success" | "danger" | "warning";
    message: string;
  } | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategoryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("auth_user");
      if (cached) setCurrentUser(JSON.parse(cached));
    } catch {
      // ignore
    }

    getMe().then((res) => {
      if (res.status && res.user) {
        setCurrentUser(res.user);
      }
    });
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

  const canManageCategories =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const res = await getCategories();
    if (res.status) {
      setCategories(res.data);
    } else {
      setAlert({
        variant: "danger",
        message: res.message || "Gagal memuat daftar kategori",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenDeleteModal = (cat: ICategoryItem) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    const res = await deleteCategory(categoryToDelete.id);
    setDeleteLoading(false);

    if (res.status) {
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      setAlert({
        variant: "success",
        message: res.message || "Kategori berhasil dihapus",
      });
      loadCategories();
    } else {
      setAlert({
        variant: "danger",
        message: res.message || "Gagal menghapus kategori",
      });
      setIsDeleteModalOpen(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  const columns: ColumnDef<ICategoryItem>[] = [
    {
      key: "no",
      header: "No",
      width: 60,
      align: "center",
      render: (_, index) => (
        <AppTypography variant="meta" tone="muted" className="m-0 text-center">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </AppTypography>
      ),
    },
    {
      key: "created_at",
      header: "Tanggal Dibuat",
      align: "center",
      render: (row) => (
        <AppTypography variant="meta" tone="muted" className="m-0 text-center">
          {row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-"}
        </AppTypography>
      ),
    },
    {
      key: "name",
      header: "Nama Kategori",
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="p-1 rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              color: "var(--app-primary)",
            }}
          >
            <Layers size={14} />
          </div>
          <AppTypography variant="body" weight="semibold" className="text-truncate m-0">
            {row.name}
          </AppTypography>
        </div>
      ),
    },
    {
      key: "description",
      header: "Deskripsi",
      render: (row) => (
        <AppTypography variant="bodySm" tone="muted" className="text-truncate m-0 d-inline-block" style={{ maxWidth: 350 }}>
          {row.description || "-"}
        </AppTypography>
      ),
    },
    {
      key: "products_count",
      header: "Jumlah Produk",
      align: "center",
      render: (row) => (
        <AppBadge variant="softSecondary">
          {row.products_count ?? 0} Produk
        </AppBadge>
      ),
    },
    ...(canManageCategories
      ? [
          {
            key: "actions",
            header: "Aksi",
            align: "right" as const,
            render: (row: ICategoryItem) => (
              <div className="d-flex align-items-center justify-content-end gap-1">
                <Link
                  href={`/categories/${row.id}/edit`}
                  title="Edit Kategori"
                  className="btn btn-sm btn-link text-decoration-none p-1 text-primary d-inline-flex align-items-center justify-content-center"
                >
                  <Pencil size={15} />
                </Link>
                <AppButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDeleteModal(row)}
                  title="Hapus Kategori"
                  className="p-1 text-danger"
                >
                  <Trash2 size={15} />
                </AppButton>
              </div>
            ),
          },
        ]
      : []),
  ];

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <AppPageHeader
        title="Kategori Produk"
        subtitle="Kelola master kelompok dan klasifikasi barang inventaris gudang"
        actions={
          canManageCategories ? (
            <Link
              href="/categories/create"
              className="btn btn-primary shadow-sm px-3 py-2 rounded-3 d-inline-flex align-items-center justify-content-center gap-2 fw-medium text-decoration-none"
            >
              <Plus size={16} />
              Tambah Kategori
            </Link>
          ) : undefined
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
            title={alert.variant === "success" ? "Berhasil" : "Pemberitahuan"}
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
        onSearchChange={setSearch}
        searchPlaceholder="Cari kategori..."
      />

      {/* Main Table */}
      <AppCard>
        <AppCardBody className="p-0">
          <AppTable<ICategoryItem>
            columns={columns}
            data={paginatedCategories}
            keyExtractor={(row) => row.id}
            isLoading={loading}
            emptyMessage="Belum ada data kategori barang."
          />

          <div
            className="p-3 border-top"
            style={{ borderColor: "var(--app-border)" }}
          >
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCategories.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </AppCardBody>
      </AppCard>

      {/* Delete Confirmation Modal - UI Kit Design */}
      <AppModal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleteLoading && setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Kategori"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <AppButton
              variant="outlineSecondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Batal
            </AppButton>
            <AppButton
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={deleteLoading}
            >
              Ya, Hapus Kategori
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
              Apakah Anda yakin ingin menghapus kategori ini?
            </AppTypography>
            <AppTypography variant="bodySm" tone="muted">
              Kategori <strong className="text-body">{categoryToDelete?.name}</strong> akan dihapus dari sistem inventaris.
            </AppTypography>
            {categoryToDelete?.products_count && categoryToDelete.products_count > 0 ? (
              <AppTypography variant="bodySm" tone="warning" className="mt-2 mb-0">
                Peringatan: Kategori ini memiliki {categoryToDelete.products_count} produk terkait. Hapus atau pindahkan produk tersebut terlebih dahulu.
              </AppTypography>
            ) : null}
          </div>
        </div>
      </AppModal>
    </div>
  );
}
