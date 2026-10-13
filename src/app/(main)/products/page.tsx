"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AppPageHeader,
  AppCard,
  AppCardBody,
  AppTable,
  AppButton,
  AppBadge,
  AppInput,
  AppDropdown,
  AppModal,
  AppAlert,
  AppPagination,
  AppTypography,
  AppSearchFilterBar,
  AppDateRangePicker,
  DateRangeValue,
  ColumnDef,
} from "@/components";
import {
  getProducts,
  getCategories,
  deleteProduct,
} from "@/modules/products/services/product.service";
import {
  IProduct,
  ICategory,
  IPaginationMeta,
} from "@/modules/products/types/product.types";
import { formatRupiah, formatDate } from "@/lib/formatters";
import { IUser } from "@/modules/auth/types/auth.types";
import { getMe } from "@/modules/auth/services/auth.service";
import {
  Plus,
  Search,
  Filter,
  RotateCcw,
  Pencil,
  Trash2,
} from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();

  // Data states
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<IPaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false,
  });

  // Query filter states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockStatus, setStockStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<DateRangeValue>({ startDate: null, endDate: null });

  // Filter Modal Dialog State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Temporary filter modal states
  const [tempCategory, setTempCategory] = useState<string>("all");
  const [tempStockStatus, setTempStockStatus] = useState<string>("all");
  const [tempSortBy, setTempSortBy] = useState<string>("created_at");
  const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">("desc");
  const [tempDateRange, setTempDateRange] = useState<DateRangeValue>({ startDate: null, endDate: null });

  // Feedback Alert State
  const [alert, setAlert] = useState<{
    variant: "success" | "danger" | "warning";
    message: string;
  } | null>(null);

  // User role state
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

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

  // Flash alert from Create/Edit redirection
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

  const canManageProducts = currentUser?.role === "superadmin" || currentUser?.role === "admin";

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check if any non-default filter is active
  const isFilterActive =
    selectedCategory !== "all" ||
    stockStatus !== "all" ||
    sortBy !== "created_at" ||
    sortOrder !== "desc" ||
    dateRange.startDate !== null ||
    dateRange.endDate !== null;

  // Fetch Categories
  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  // Fetch Products
  const loadProducts = useCallback(
    async (pageToLoad = 1, searchParam?: string) => {
      setLoading(true);
      const effectiveSearch = searchParam !== undefined ? searchParam : search;
      const res = await getProducts({
        page: pageToLoad,
        per_page: pagination.per_page,
        search: effectiveSearch,
        category_id: selectedCategory === "all" ? undefined : selectedCategory,
        stock_status: stockStatus as any,
        sort_by: sortBy as any,
        sort_order: sortOrder,
        start_date: dateRange.startDate || undefined,
        end_date: dateRange.endDate || undefined,
      });

      if (res.status) {
        setProducts(res.data);
        setPagination(res.pagination);
      } else {
        setAlert({
          variant: "danger",
          message: res.message || "Gagal memuat data produk",
        });
      }
      setLoading(false);
    },
    [pagination.per_page, search, selectedCategory, stockStatus, sortBy, sortOrder, dateRange]
  );

  // Trigger load on initial mount and when dialog filters change (Enter triggers search explicitly)
  useEffect(() => {
    loadProducts(1);
  }, [selectedCategory, stockStatus, sortBy, sortOrder, dateRange]);

  // Open Filter Dialog
  const handleOpenFilterDialog = () => {
    setTempCategory(selectedCategory);
    setTempStockStatus(stockStatus);
    setTempSortBy(sortBy);
    setTempSortOrder(sortOrder);
    setTempDateRange(dateRange);
    setIsFilterModalOpen(true);
  };

  // Apply Filter from Dialog
  const handleApplyFilter = () => {
    setSelectedCategory(tempCategory);
    setStockStatus(tempStockStatus);
    setSortBy(tempSortBy);
    setSortOrder(tempSortOrder);
    setDateRange(tempDateRange);
    setIsFilterModalOpen(false);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setStockStatus("all");
    setSortBy("created_at");
    setSortOrder("desc");
    setDateRange({ startDate: null, endDate: null });
    setTempCategory("all");
    setTempStockStatus("all");
    setTempSortBy("created_at");
    setTempSortOrder("desc");
    setTempDateRange({ startDate: null, endDate: null });
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (product: IProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    const res = await deleteProduct(productToDelete.id);
    setDeleteLoading(false);

    if (res.status) {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      setAlert({ variant: "success", message: res.message });
      loadProducts(pagination.current_page);
    } else {
      setAlert({ variant: "danger", message: res.message });
    }
  };

  // Table Columns Definition
  const columns: ColumnDef<IProduct>[] = [
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
      key: "sku",
      header: "SKU",
      render: (row) => (
        <AppBadge variant="softPrimary" className="font-mono">
          {row.sku}
        </AppBadge>
      ),
    },
    {
      key: "name",
      header: "Nama Produk",
      render: (row) => (
        <div className="d-flex flex-column" style={{ minWidth: 200 }}>
          <AppTypography variant="body" weight="semibold" className="text-truncate m-0">
            {row.name}
          </AppTypography>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (row) => (
        <AppBadge variant="softSecondary">
          {row.category?.name || "Tanpa Kategori"}
        </AppBadge>
      ),
    },
    {
      key: "purchase_price",
      header: "HPP (Beli)",
      align: "right",
      render: (row) => (
        <AppTypography variant="meta" tone="muted" className="m-0 text-end">
          {formatRupiah(row.purchase_price)}
        </AppTypography>
      ),
    },
    {
      key: "selling_price",
      header: "Harga Jual",
      align: "right",
      render: (row) => (
        <AppTypography variant="meta" tone="success" weight="semibold" className="m-0 text-end">
          {formatRupiah(row.selling_price)}
        </AppTypography>
      ),
    },
    {
      key: "stock",
      header: "Stok Gudang",
      align: "center",
      render: (row) => (
        <AppTypography variant="meta" weight="bold" className="m-0 text-center">
          {row.stock}
        </AppTypography>
      ),
    },
    {
      key: "min_stock",
      header: "Min. Stok",
      align: "center",
      render: (row) => (
        <AppTypography variant="meta" tone="muted" className="m-0 text-center">
          {row.min_stock}
        </AppTypography>
      ),
    },
    {
      key: "stock_status",
      header: "Persediaan",
      align: "center",
      render: (row) => {
        if (row.stock_status === "out_of_stock") {
          return (
            <AppBadge variant="softDanger" dot>
              Habis
            </AppBadge>
          );
        }
        if (row.stock_status === "low_stock") {
          return (
            <AppBadge variant="softWarning" dot>
              Kritis
            </AppBadge>
          );
        }
        return (
          <AppBadge variant="softSuccess" dot>
            Aman
          </AppBadge>
        );
      },
    },
    ...(canManageProducts
      ? [
          {
            key: "actions",
            header: "Aksi",
            align: "right" as const,
            render: (row: IProduct) => (
              <div className="d-flex align-items-center justify-content-end gap-1">
                <Link
                  href={`/products/${row.id}/edit`}
                  title="Edit Produk"
                  className="btn btn-sm btn-link text-decoration-none p-1 text-primary d-inline-flex align-items-center justify-content-center"
                >
                  <Pencil size={15} />
                </Link>
                <AppButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDeleteModal(row)}
                  title="Hapus Produk"
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
      {/* Page Header */}
      <AppPageHeader
        title="Produk & Stok"
        subtitle="Katalog inventaris barang, kuantitas stok gudang, dan status valuasi produk"
        actions={
          canManageProducts ? (
            <Link
              href="/products/create"
              className="btn btn-primary shadow-sm px-3 py-2 rounded-3 d-inline-flex align-items-center justify-content-center gap-2 fw-medium text-decoration-none"
            >
              <Plus size={16} />
              Tambah Produk
            </Link>
          ) : undefined
        }
      />

      {/* Floating Top-Right Alert Box (Sesuai UI Kit AppAlert) */}
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

      {/* UI Kit Search & Filter Bar (1 baris rapi dan presisi) */}
      <AppSearchFilterBar
        searchValue={search}
        onSearchSubmit={(val) => {
          setSearch(val);
          loadProducts(1, val);
        }}
        searchPlaceholder="Cari nama atau SKU produk (Tekan Enter)..."
        onFilterClick={handleOpenFilterDialog}
        isFilterActive={isFilterActive}
        filterButtonText="Filter"
        onResetClick={() => {
          handleResetFilters();
          loadProducts(1, "");
        }}
      />

      {/* Main Table using UI Kit AppTable with horizontal scroll support */}
      <AppCard>
        <AppCardBody className="p-0">
          <AppTable<IProduct>
            columns={columns}
            data={products}
            keyExtractor={(row) => row.id}
            isLoading={loading}
            minWidth={920}
            emptyMessage="Tidak ada produk yang sesuai dengan kriteria pencarian atau filter."
          />

          {/* Pagination Footer using UI Kit AppPagination */}
          <div
            className="p-3 border-top"
            style={{ borderColor: "var(--app-border)" }}
          >
            <AppPagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.per_page}
              onPageChange={(page) => loadProducts(page)}
            />
          </div>
        </AppCardBody>
      </AppCard>

      {/* Filter Modal Dialog (Muncul saat tombol Filter diklik) */}
      <AppModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Spesifik Produk"
        size="md"
        footer={
          <div className="d-flex align-items-center justify-content-between w-100">
            <AppButton
              variant="outlineSecondary"
              size="md"
              onClick={() => {
                handleResetFilters();
                setIsFilterModalOpen(false);
              }}
            >
              Reset Filter
            </AppButton>
            <AppButton
              variant="primary"
              size="md"
              onClick={handleApplyFilter}
            >
              Terapkan Filter
            </AppButton>
          </div>
        }
      >
        <div className="d-flex flex-column gap-3">
          {/* Dropdown Kategori Searchable */}
          <div>
            <label className="form-label mb-1">
              <AppTypography variant="label" tone="secondary">
                Kategori Produk
              </AppTypography>
            </label>
            <AppDropdown
              searchable
              searchPlaceholder="Cari kategori..."
              value={tempCategory}
              onChange={(val) => setTempCategory(String(val))}
              options={[
                { value: "all", label: "Semua Kategori" },
                ...categories.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                  description: c.description || undefined,
                })),
              ]}
            />
          </div>

          {/* Dropdown Status Stok */}
          <div>
            <label className="form-label mb-1">
              <AppTypography variant="label" tone="secondary">
                Status Stok Gudang
              </AppTypography>
            </label>
            <AppDropdown
              value={tempStockStatus}
              onChange={(val) => setTempStockStatus(String(val))}
              options={[
                { value: "all", label: "Semua Status" },
                { value: "in_stock", label: "Aman (Tersedia)" },
                { value: "low_stock", label: "Kritis (Menipis)" },
                { value: "out_of_stock", label: "Habis (Kosong)" },
              ]}
            />
          </div>

          {/* Dropdown Urutkan Berdasarkan */}
          <div>
            <label className="form-label mb-1">
              <AppTypography variant="label" tone="secondary">
                Urutkan Berdasarkan
              </AppTypography>
            </label>
            <AppDropdown
              value={`${tempSortBy}:${tempSortOrder}`}
              onChange={(val) => {
                const [sb, so] = String(val).split(":");
                setTempSortBy(sb);
                setTempSortOrder(so as "asc" | "desc");
              }}
              options={[
                { value: "created_at:desc", label: "Terbaru Ditambahkan" },
                { value: "name:asc", label: "Nama Produk (A - Z)" },
                { value: "stock:desc", label: "Stok Terbanyak" },
                { value: "stock:asc", label: "Stok Tersedikit" },
                { value: "selling_price:desc", label: "Harga Tertinggi" },
                { value: "selling_price:asc", label: "Harga Terendah" },
              ]}
            />
          </div>

          {/* Filter Rentang Tanggal Dibuat */}
          <div>
            <label className="form-label mb-1">
              <AppTypography variant="label" tone="secondary">
                Rentang Tanggal Dibuat (Created At)
              </AppTypography>
            </label>
            <AppDateRangePicker
              value={tempDateRange}
              onChange={(val) => setTempDateRange(val)}
              placeholder="Pilih rentang tanggal produk..."
            />
          </div>
        </div>
      </AppModal>

      {/* Delete Confirmation Modal */}
      <AppModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Produk"
        size="md"
        footer={
          <div className="d-flex align-items-center justify-content-end gap-2 w-100">
            <AppButton
              variant="outlineSecondary"
              size="md"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Batal
            </AppButton>
            <AppButton
              variant="danger"
              size="md"
              isLoading={deleteLoading}
              onClick={handleConfirmDelete}
            >
              Ya, Hapus Produk
            </AppButton>
          </div>
        }
      >
        <div className="d-flex align-items-start gap-3">
          <div
            className="p-3 rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 48, height: 48 }}
          >
            <Trash2 size={24} />
          </div>
          <div>
            <AppTypography variant="body" tone="primary" className="fw-semibold">
              Apakah Anda yakin ingin menghapus produk ini?
            </AppTypography>
            <AppTypography variant="bodySm" tone="secondary" className="mt-1">
              Produk <strong>{productToDelete?.name}</strong> (SKU: {productToDelete?.sku}) akan dihapus dari sistem inventaris. Riwayat mutasi tetap tersimpan untuk audit.
            </AppTypography>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
