"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  AppPageHeader,
  AppCard,
  AppCardBody,
  AppTable,
  AppButton,
  AppBadge,
  AppModal,
  AppAlert,
  AppSearchFilterBar,
  AppDropdown,
  AppPagination,
  AppTypography,
  AppDateRangePicker,
  DateRangeValue,
  ColumnDef,
} from "@/components";
import { getStockMutations } from "@/modules/stock-mutations/services/mutation.service";
import { IStockMutationItem } from "@/modules/stock-mutations/types/mutation.types";
import { IPaginationMeta } from "@/modules/products/types/product.types";
import { getProducts } from "@/modules/products/services/product.service";
import { Plus, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, User, Package, Truck } from "lucide-react";
import { formatDateTime } from "@/lib/formatters";

export default function StockMutationsPage() {
  const [mutations, setMutations] = useState<IStockMutationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<IPaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false,
  });

  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRangeValue>({ startDate: null, endDate: null });

  // Temporary state for filter modal
  const [tempProductId, setTempProductId] = useState<string>("all");
  const [tempType, setTempType] = useState<string>("all");
  const [tempDateRange, setTempDateRange] = useState<DateRangeValue>({ startDate: null, endDate: null });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Products for filter dropdown
  const [productsList, setProductsList] = useState<{ id: number; name: string; sku: string }[]>([]);

  const [alert, setAlert] = useState<{
    variant: "success" | "danger" | "warning";
    message: string;
  } | null>(null);

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

  // Fetch product list for filter modal
  useEffect(() => {
    getProducts({ per_page: 100 }).then((res) => {
      if (res.status && res.data) {
        setProductsList(
          res.data.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
          }))
        );
      }
    });
  }, []);

  const loadMutations = useCallback(
    async (page = 1, searchParam?: string) => {
      setLoading(true);
      const effectiveSearch = searchParam !== undefined ? searchParam : search;
      const res = await getStockMutations(
        page,
        10,
        selectedProductId,
        dateRange.startDate || undefined,
        dateRange.endDate || undefined,
        effectiveSearch,
        selectedType
      );
      if (res.status) {
        setMutations(res.data);
        setPagination(res.pagination);
      } else {
        setAlert({
          variant: "danger",
          message: res.message || "Gagal memuat riwayat mutasi stok",
        });
      }
      setLoading(false);
    },
    [selectedProductId, selectedType, dateRange, search]
  );

  useEffect(() => {
    loadMutations(1);
  }, [selectedProductId, selectedType, dateRange]);

  const handleOpenFilterDialog = () => {
    setTempProductId(selectedProductId);
    setTempType(selectedType);
    setTempDateRange(dateRange);
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = () => {
    setSelectedProductId(tempProductId);
    setSelectedType(tempType);
    setDateRange(tempDateRange);
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedProductId("all");
    setSelectedType("all");
    setDateRange({ startDate: null, endDate: null });
    setTempProductId("all");
    setTempType("all");
    setTempDateRange({ startDate: null, endDate: null });
    setSearch("");
    setIsFilterModalOpen(false);
  };

  const isFilterActive =
    selectedProductId !== "all" ||
    selectedType !== "all" ||
    dateRange.startDate !== null ||
    dateRange.endDate !== null;

  const columns: ColumnDef<IStockMutationItem>[] = [
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
      header: "Waktu Pencatatan",
      width: 170,
      render: (row) => {
        if (!row.created_at) return <AppTypography variant="bodySm" tone="muted" className="m-0">-</AppTypography>;
        const { date, time } = formatDateTime(row.created_at);
        return (
          <div className="d-flex flex-column">
            <AppTypography variant="bodySm" weight="medium" className="m-0">
              {date}
            </AppTypography>
            <AppTypography variant="meta" tone="muted" className="m-0">
              {time}
            </AppTypography>
          </div>
        );
      },
    },
    {
      key: "product",
      header: "Produk",
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="p-1 rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              color: "var(--app-primary)",
            }}
          >
            <Package size={14} />
          </div>
          <div className="d-flex flex-column text-truncate" style={{ maxWidth: 220 }}>
            <AppTypography variant="body" weight="semibold" className="text-truncate m-0">
              {row.product?.name || "Produk Tidak Ditemukan"}
            </AppTypography>
            <AppTypography variant="meta" tone="muted" className="m-0">
              SKU: {row.product?.sku || "-"}
            </AppTypography>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Jenis Mutasi",
      align: "center",
      render: (row) => (
        row.type === "in" ? (
          <AppBadge variant="softSuccess">
            <ArrowDownLeft size={12} className="me-1" />
            Barang Masuk
          </AppBadge>
        ) : (
          <AppBadge variant="softDanger">
            <ArrowUpRight size={12} className="me-1" />
            Barang Keluar
          </AppBadge>
        )
      ),
    },
    {
      key: "quantity",
      header: "Jumlah",
      align: "center",
      render: (row) => (
        <AppTypography
          variant="statValue"
          tone={row.type === "in" ? "success" : "danger"}
          className="m-0 text-center"
        >
          {row.type === "in" ? `+${row.quantity}` : `-${row.quantity}`}
        </AppTypography>
      ),
    },
    {
      key: "stock_change",
      header: "Perubahan Stok",
      align: "center",
      render: (row) => (
        <div className="d-flex align-items-center justify-content-center gap-1 font-mono">
          <AppTypography variant="meta" tone="muted" className="m-0">
            {row.stock_before}
          </AppTypography>
          <ArrowLeftRight size={12} className="text-muted" />
          <AppTypography variant="meta" weight="bold" className="m-0">
            {row.stock_after}
          </AppTypography>
        </div>
      ),
    },
    {
      key: "operator",
      header: "Operator",
      render: (row) => (
        <div className="d-flex align-items-center gap-1">
          <User size={13} className="text-muted flex-shrink-0" />
          <AppTypography variant="bodySm" weight="medium" className="m-0 text-truncate">
            {row.user?.name || "Staf Sistem"}
          </AppTypography>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      align: "center",
      width: 110,
      render: (row) => {
        if (!row.user?.role) return <span className="text-muted small">-</span>;
        const role = row.user.role;
        const variant =
          role === "superadmin"
            ? "softPrimary"
            : role === "admin"
            ? "softSecondary"
            : "softInfo";
        return (
          <AppBadge variant={variant} className="text-capitalize px-2 py-0.5">
            {role}
          </AppBadge>
        );
      },
    },
    {
      key: "supplier_notes",
      header: "Supplier & Catatan",
      render: (row) => (
        <div className="d-flex flex-column gap-1" style={{ maxWidth: 220 }}>
          {row.supplier?.name ? (
            <div className="d-flex align-items-center gap-1 text-primary small fw-medium">
              <Truck size={12} />
              <span className="text-truncate">{row.supplier.name}</span>
            </div>
          ) : null}
          {row.notes ? (
            <span className="text-muted small text-truncate" title={row.notes}>
              {row.notes}
            </span>
          ) : !row.supplier?.name ? (
            <span className="text-muted small">-</span>
          ) : null}
        </div>
      ),
    },
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
        title="Riwayat Mutasi Stok"
        subtitle="Log pencatatan barang masuk (IN) dan barang keluar (OUT) beserta rekam jejak operator inventaris"
        actions={
          <Link href="/stock-mutations/create">
            <AppButton variant="primary" size="md">
              <Plus size={16} className="me-2" />
              Catat Mutasi Stok
            </AppButton>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <AppSearchFilterBar
        searchValue={search}
        onSearchSubmit={(val) => {
          setSearch(val);
          loadMutations(1, val);
        }}
        searchPlaceholder="Cari produk, SKU, operator, supplier (Tekan Enter)..."
        onFilterClick={handleOpenFilterDialog}
        isFilterActive={isFilterActive}
        filterButtonText="Filter"
        onResetClick={() => {
          handleResetFilters();
          loadMutations(1, "");
        }}
      />

      {/* Main Table */}
      <AppCard>
        <AppCardBody className="p-0">
          <AppTable<IStockMutationItem>
            columns={columns}
            data={mutations}
            keyExtractor={(row) => row.id}
            isLoading={loading}
            minWidth={1050}
            emptyMessage={
              search || isFilterActive
                ? "Tidak ada data riwayat mutasi yang cocok dengan kriteria filter atau pencarian."
                : "Belum ada riwayat mutasi stok yang tercatat."
            }
          />

          {/* Pagination Footer */}
          <div
            className="p-3 border-top"
            style={{ borderColor: "var(--app-border)" }}
          >
            <AppPagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.per_page}
              onPageChange={(page) => loadMutations(page)}
            />
          </div>
        </AppCardBody>
      </AppCard>

      {/* Filter Modal Dialog */}
      <AppModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Riwayat Mutasi Stok"
        size="md"
        footer={
          <div className="d-flex align-items-center justify-content-between w-100">
            <AppButton
              variant="outlineSecondary"
              size="md"
              onClick={handleResetFilters}
            >
              Reset Filter
            </AppButton>
            <div className="d-flex gap-2">
              <AppButton
                variant="outlineSecondary"
                size="md"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Batal
              </AppButton>
              <AppButton
                variant="primary"
                size="md"
                onClick={handleApplyFilters}
              >
                Terapkan Filter
              </AppButton>
            </div>
          </div>
        }
      >
        <div className="d-flex flex-column gap-3 py-2">
          <div>
            <AppTypography variant="label" className="mb-1 d-block">
              Filter Berdasarkan Produk
            </AppTypography>
            <AppDropdown
              options={[
                { label: "Semua Produk", value: "all" },
                ...productsList.map((p) => ({
                  label: `${p.name} (${p.sku})`,
                  value: String(p.id),
                })),
              ]}
              value={tempProductId}
              onChange={(val) => setTempProductId(String(val))}
            />
          </div>

          <div>
            <AppTypography variant="label" className="mb-1 d-block">
              Jenis Alur Mutasi
            </AppTypography>
            <AppDropdown
              options={[
                { label: "Semua Jenis (IN & OUT)", value: "all" },
                { label: "Barang Masuk (IN)", value: "in" },
                { label: "Barang Keluar (OUT)", value: "out" },
              ]}
              value={tempType}
              onChange={(val) => setTempType(String(val))}
            />
          </div>

          <div>
            <AppTypography variant="label" className="mb-1 d-block">
              Rentang Tanggal Mutasi
            </AppTypography>
            <AppDateRangePicker
              value={tempDateRange}
              onChange={(val) => setTempDateRange(val)}
              placeholder="Pilih rentang tanggal mutasi..."
            />
          </div>
        </div>
      </AppModal>
    </div>
  );
}
