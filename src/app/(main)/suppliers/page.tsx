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
  AppModal,
  AppAlert,
  AppSearchFilterBar,
  AppTypography,
  ColumnDef,
} from "@/components";
import {
  getSuppliers,
  deleteSupplier,
} from "@/modules/suppliers/services/supplier.service";
import { ISupplierItem } from "@/modules/suppliers/types/supplier.types";
import { IUser } from "@/modules/auth/types/auth.types";
import { getMe } from "@/modules/auth/services/auth.service";
import { Plus, Pencil, Trash2, Truck, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/formatters";

export default function SuppliersPage() {
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<ISupplierItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total: 0,
    per_page: 10,
  });

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [alert, setAlert] = useState<{
    variant: "success" | "danger" | "warning";
    message: string;
  } | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<ISupplierItem | null>(null);
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

  const canManageSuppliers =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";

  const loadSuppliers = useCallback(
    async (page = 1, searchParam?: string) => {
      setLoading(true);
      const effectiveSearch = searchParam !== undefined ? searchParam : search;
      const res = await getSuppliers({ page, per_page: 10, search: effectiveSearch });
      if (res.status) {
        setSuppliers(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        setAlert({
          variant: "danger",
          message: res.message || "Gagal memuat daftar supplier",
        });
      }
      setLoading(false);
    },
    [search]
  );

  useEffect(() => {
    loadSuppliers(1);
  }, []);

  const handleOpenDeleteModal = (sup: ISupplierItem) => {
    setSupplierToDelete(sup);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;
    setDeleteLoading(true);
    const res = await deleteSupplier(supplierToDelete.id);
    setDeleteLoading(false);

    if (res.status) {
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
      setAlert({
        variant: "success",
        message: res.message || "Supplier berhasil dihapus",
      });
      loadSuppliers(pagination.current_page);
    } else {
      setAlert({
        variant: "danger",
        message: res.message || "Gagal menghapus supplier",
      });
      setIsDeleteModalOpen(false);
    }
  };

  const columns: ColumnDef<ISupplierItem>[] = [
    {
      key: "no",
      header: "No",
      width: 60,
      align: "center",
      render: (_, index) => (
        <AppTypography variant="meta" tone="muted" className="m-0 text-center">
          {(pagination.current_page - 1) * pagination.per_page + index + 1}
        </AppTypography>
      ),
    },
    {
      key: "created_at",
      header: "Tanggal Dibuat",
      align: "center",
      render: (row) => (
        <AppTypography variant="meta" tone="muted" className="m-0 text-center">
          {formatDate(row.created_at)}
        </AppTypography>
      ),
    },
    {
      key: "name",
      header: "Nama Supplier",
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="p-1 rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "var(--app-success)",
            }}
          >
            <Truck size={14} />
          </div>
          <AppTypography variant="body" weight="semibold" className="text-truncate m-0">
            {row.name}
          </AppTypography>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Kontak",
      render: (row) => (
        <div className="d-flex flex-column gap-1">
          {row.phone ? (
            <div className="d-flex align-items-center gap-1">
              <Phone size={12} className="text-muted" />
              <AppTypography variant="meta" tone="muted" className="m-0">
                {row.phone}
              </AppTypography>
            </div>
          ) : null}
          {row.email ? (
            <div className="d-flex align-items-center gap-1">
              <Mail size={12} className="text-muted" />
              <AppTypography variant="bodySm" tone="muted" className="m-0">
                {row.email}
              </AppTypography>
            </div>
          ) : null}
          {!row.phone && !row.email && (
            <AppTypography variant="bodySm" tone="muted" className="m-0">
              -
            </AppTypography>
          )}
        </div>
      ),
    },
    {
      key: "address",
      header: "Alamat",
      render: (row) => (
        row.address ? (
          <div className="d-flex align-items-center gap-1 text-truncate" style={{ maxWidth: 300 }}>
            <MapPin size={12} className="flex-shrink-0 text-muted" />
            <AppTypography variant="bodySm" tone="muted" className="text-truncate m-0">
              {row.address}
            </AppTypography>
          </div>
        ) : (
          <AppTypography variant="bodySm" tone="muted" className="m-0">
            -
          </AppTypography>
        )
      ),
    },
    ...(canManageSuppliers
      ? [
          {
            key: "actions",
            header: "Aksi",
            align: "right" as const,
            render: (row: ISupplierItem) => (
              <div className="d-flex align-items-center justify-content-end gap-1">
                <AppButton
                  variant="ghost"
                  size="sm"
                  title="Edit Supplier"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/suppliers/${row.id}/edit`);
                  }}
                  className="p-1 text-muted"
                >
                  <Pencil size={15} />
                </AppButton>
                <AppButton
                  variant="ghost"
                  size="sm"
                  title="Hapus Supplier"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeleteModal(row);
                  }}
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

  return (
    <div className="container-fluid p-0">
      {/* Floating Top-Right Alert Box */}
      {alert && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1090, maxWidth: 400, width: "100%" }}
        >
          <AppAlert
            variant={alert.variant}
            title={
              alert.variant === "success"
                ? "Berhasil"
                : alert.variant === "danger"
                ? "Kesalahan"
                : "Pemberitahuan"
            }
            dismissible
            autoClose
            duration={5000}
            onDismiss={() => setAlert(null)}
          >
            {alert.message}
          </AppAlert>
        </div>
      )}

      {/* Page Header */}
      <AppPageHeader
        title="Daftar Supplier"
        subtitle="Kelola mitra pemasok, informasi kontak, dan alamat pengiriman barang inventaris"
        actions={
          canManageSuppliers ? (
            <Link href="/suppliers/create">
              <AppButton variant="primary" size="md">
                <Plus size={16} className="me-2" />
                Tambah Supplier
              </AppButton>
            </Link>
          ) : undefined
        }
      />

      {/* Filter & Search Bar */}
      <AppSearchFilterBar
        searchPlaceholder="Cari nama supplier, telepon, email, alamat..."
        searchValue={search}
        onSearchSubmit={(val) => {
          setSearch(val);
          loadSuppliers(1, val);
        }}
      />

      {/* Main Content Card */}
      <AppCard>
        <AppCardBody className="p-0">
          <AppTable<ISupplierItem>
            columns={columns}
            data={suppliers}
            isLoading={loading}
            emptyMessage={
              search
                ? "Tidak ada data supplier yang cocok dengan kata kunci."
                : "Belum ada data supplier yang terdaftar."
            }
            keyExtractor={(row) => row.id}
          />

          <div
            className="p-3 border-top"
            style={{ borderColor: "var(--app-border)" }}
          >
            <AppPagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.per_page}
              onPageChange={(p) => loadSuppliers(p)}
            />
          </div>
        </AppCardBody>
      </AppCard>

      {/* Delete Confirmation Modal - UI Kit Design */}
      <AppModal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleteLoading && setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Supplier"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <AppButton
              variant="outlineSecondary"
              disabled={deleteLoading}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </AppButton>
            <AppButton
              variant="danger"
              isLoading={deleteLoading}
              onClick={handleConfirmDelete}
            >
              Ya, Hapus Supplier
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
              Apakah Anda yakin ingin menghapus supplier ini?
            </AppTypography>
            <AppTypography variant="bodySm" tone="muted">
              Supplier <strong className="text-body">{supplierToDelete?.name}</strong> akan dihapus dari sistem inventaris. Pastikan tidak ada data mutasi yang terdampak.
            </AppTypography>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
