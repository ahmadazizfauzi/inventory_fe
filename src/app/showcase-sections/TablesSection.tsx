"use client";

import React, { useState } from "react";
import AppTypography from "@/components/typography/AppTypography";
import AppTable, { ColumnDef } from "@/components/tables/AppTable";
import AppBadge from "@/components/badges/AppBadge";
import AppButton from "@/components/buttons/AppButton";
import AppPageHeader from "@/components/layout/AppPageHeader";
import AppFormSection from "@/components/layout/AppFormSection";
import AppInput from "@/components/inputs/AppInput";
import AppSelect from "@/components/inputs/AppSelect";
import AppPagination from "@/components/navigation/AppPagination";
import { Edit2, Trash2, Plus, Check, Barcode, DollarSign } from "lucide-react";

interface ProductRow {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
}

const initialProducts: ProductRow[] = [
  {
    id: 1,
    sku: "SKU-SRV-001",
    name: "Server Rack 42U Enterprise",
    category: "Hardware",
    stock: 14,
    minStock: 5,
    purchasePrice: 12500000,
    sellingPrice: 16800000,
  },
  {
    id: 2,
    sku: "SKU-NET-004",
    name: "Switch Cisco 24-Port Gigabit Managed",
    category: "Networking",
    stock: 4,
    minStock: 5,
    purchasePrice: 4200000,
    sellingPrice: 5900000,
  },
  {
    id: 3,
    sku: "SKU-CAB-012",
    name: "Kabel UTP Cat6 305m Belden",
    category: "Networking",
    stock: 0,
    minStock: 3,
    purchasePrice: 1850000,
    sellingPrice: 2400000,
  },
  {
    id: 4,
    sku: "SKU-ACC-088",
    name: "Patch Cord Cat6 2m Blue",
    category: "Accessories",
    stock: 85,
    minStock: 20,
    purchasePrice: 35000,
    sellingPrice: 55000,
  },
];

export default function TablesSection() {
  const [data, setData] = useState<ProductRow[]>(initialProducts);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
  const [demoPage, setDemoPage] = useState<number>(1);

  // Form fields state
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formCategory, setFormCategory] = useState("Hardware");
  const [formPurchasePrice, setFormPurchasePrice] = useState("");
  const [formSellingPrice, setFormSellingPrice] = useState("");
  const [formStock, setFormStock] = useState("");

  const handleStartCreate = () => {
    setSelectedProduct(null);
    setFormName("");
    setFormSku("SKU-NEW-" + Math.floor(100 + Math.random() * 900));
    setFormCategory("Hardware");
    setFormPurchasePrice("");
    setFormSellingPrice("");
    setFormStock("");
    setMode("create");
  };

  const handleStartEdit = (item: ProductRow) => {
    setSelectedProduct(item);
    setFormName(item.name);
    setFormSku(item.sku);
    setFormCategory(item.category);
    setFormPurchasePrice(item.purchasePrice.toString());
    setFormSellingPrice(item.sellingPrice.toString());
    setFormStock(item.stock.toString());
    setMode("edit");
  };

  const handleSave = () => {
    if (mode === "create") {
      const newItem: ProductRow = {
        id: Date.now(),
        sku: formSku || "SKU-INV-999",
        name: formName || "Produk Baru",
        category: formCategory,
        stock: Number(formStock) || 10,
        minStock: 5,
        purchasePrice: Number(formPurchasePrice) || 500000,
        sellingPrice: Number(formSellingPrice) || 750000,
      };
      setData([newItem, ...data]);
    } else if (mode === "edit" && selectedProduct) {
      setData(
        data.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                name: formName,
                sku: formSku,
                category: formCategory,
                purchasePrice: Number(formPurchasePrice) || p.purchasePrice,
                sellingPrice: Number(formSellingPrice) || p.sellingPrice,
                stock: Number(formStock) || p.stock,
              }
            : p
        )
      );
    }
    setMode("list");
  };

  const columns: ColumnDef<ProductRow>[] = [
    {
      key: "sku",
      header: "KODE SKU",
      render: (row) => (
        <AppTypography variant="meta" tone="accent">
          {row.sku}
        </AppTypography>
      ),
    },
    {
      key: "name",
      header: "NAMA PRODUK",
      render: (row) => (
        <div>
          <AppTypography variant="body" tone="primary" className="fw-semibold d-block">
            {row.name}
          </AppTypography>
          <AppTypography variant="caption" tone="muted">
            Kategori: {row.category}
          </AppTypography>
        </div>
      ),
    },
    {
      key: "stock",
      header: "STOK",
      align: "center",
      render: (row) => {
        let badgeVariant: "softSuccess" | "softWarning" | "softDanger" = "softSuccess";
        let label = `${row.stock} Unit`;

        if (row.stock === 0) {
          badgeVariant = "softDanger";
          label = "Habis (0)";
        } else if (row.stock <= row.minStock) {
          badgeVariant = "softWarning";
          label = `Kritis (${row.stock})`;
        }

        return <AppBadge variant={badgeVariant}>{label}</AppBadge>;
      },
    },
    {
      key: "purchasePrice",
      header: "HARGA BELI",
      align: "right",
      render: (row) => (
        <AppTypography variant="meta" tone="secondary">
          Rp {row.purchasePrice.toLocaleString("id-ID")}
        </AppTypography>
      ),
    },
    {
      key: "sellingPrice",
      header: "HARGA JUAL",
      align: "right",
      render: (row) => (
        <AppTypography variant="meta" tone="primary" className="fw-semibold">
          Rp {row.sellingPrice.toLocaleString("id-ID")}
        </AppTypography>
      ),
    },
    {
      key: "actions",
      header: "AKSI",
      align: "center",
      render: (row) => (
        <div className="d-flex justify-content-center gap-1">
          <AppButton
            size="sm"
            variant="outlinePrimary"
            className="p-1"
            title="Edit Produk"
            onClick={() => handleStartEdit(row)}
          >
            <Edit2 size={13} />
          </AppButton>
          <AppButton
            size="sm"
            variant="outlineDanger"
            className="p-1"
            title="Hapus"
            onClick={() => setData(data.filter((d) => d.id !== row.id))}
          >
            <Trash2 size={13} />
          </AppButton>
        </div>
      ),
    },
  ];

  return (
    <section id="tables" className="mb-5 pb-4 border-bottom" style={{ borderColor: "var(--app-border)" }}>
      <div className="mb-4">
        <AppTypography variant="eyebrow" tone="accent" className="d-block mb-1">
          AppTable.tsx & Inline CRUD Flow
        </AppTypography>
        <AppTypography variant="h2" tone="primary" className="mb-2">
          Single-Page CRUD Flow (Tanpa Modal / Tanpa Reload)
        </AppTypography>
        <AppTypography variant="pageSubtitle" tone="secondary">
          Alur CRUD instan di satu halaman ala backoffice. Menggunakan sub-navbar penanda dan form split 2-kolom tanpa pop-up modal.
        </AppTypography>
      </div>

      {mode === "list" ? (
        <>
          <AppPageHeader
            title="Daftar Produk & Inventaris"
            subtitle="Menampilkan data master barang dan status ketersediaan di gudang"
            breadcrumbItems={[
              { label: "Home", href: "#" },
              { label: "Master Data" },
              { label: "Produk" },
            ]}
            actions={
              <AppButton variant="primary" icon={<Plus size={16} />} onClick={handleStartCreate}>
                Tambah Produk
              </AppButton>
            }
          />

          <AppTable
            columns={columns}
            data={data}
            keyExtractor={(row) => row.id}
          />

          {/* AppPagination Component Showcase */}
          <div className="mt-3 p-3 rounded-3 border" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-surface)" }}>
            <AppPagination
              currentPage={demoPage}
              totalPages={11}
              totalItems={108}
              itemsPerPage={10}
              onPageChange={(p) => setDemoPage(p)}
            />
          </div>
        </>
      ) : (
        <div>
          {/* Sub-Navbar Penanda Mode Create / Edit */}
          <AppPageHeader
            title={mode === "create" ? "Tambah Produk" : `Edit Produk: ${selectedProduct?.name}`}
            subtitle={mode === "create" ? "Isi formulir di bawah untuk mendaftarkan barang baru ke sistem" : "Perbarui informasi produk dan stok fisik"}
            onBack={() => setMode("list")}
            breadcrumbItems={[
              { label: "Home", href: "#" },
              { label: "Produk", href: "#" },
              { label: mode === "create" ? "Tambah Produk" : "Edit Produk" },
            ]}
            actions={
              <div className="d-flex align-items-center gap-2">
                <AppButton variant="outlineSecondary" onClick={() => setMode("list")}>
                  Batal
                </AppButton>
                <AppButton variant="success" icon={<Check size={16} />} onClick={handleSave}>
                  {mode === "create" ? "Simpan Produk" : "Perbarui Data"}
                </AppButton>
              </div>
            }
          />

          {/* Form Section 1: Informasi Dasar */}
          <AppFormSection
            title="Informasi Dasar"
            description="Isi informasi identifikasi produk, nama barang, dan pengelompokan kategori."
          >
            <AppInput
              label="Nama Produk *"
              placeholder="Contoh: Server Rack 42U Enterprise"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              helperText="Nama resmi barang yang ditampilkan di katalog"
            />
            <AppInput
              label="Kode SKU Produk *"
              placeholder="SKU-XXX-000"
              icon={<Barcode size={18} />}
              value={formSku}
              onChange={(e) => setFormSku(e.target.value)}
              helperText="Kode unik produk untuk sinkronisasi mutasi"
            />
            <AppSelect
              label="Kategori Barang"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              options={[
                { value: "Hardware", label: "Hardware & Server" },
                { value: "Networking", label: "Networking & Cabling" },
                { value: "Accessories", label: "Accessories & Peripherals" },
              ]}
            />
          </AppFormSection>

          {/* Form Section 2: Finansial & Stok */}
          <AppFormSection
            title="Harga & Ketersediaan Stok"
            description="Pengaturan harga modal, harga jual pasar, dan kuantitas fisik di gudang."
          >
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <AppInput
                  label="Harga Beli (Modal Rp)"
                  placeholder="0"
                  icon={<DollarSign size={18} />}
                  value={formPurchasePrice}
                  onChange={(e) => setFormPurchasePrice(e.target.value)}
                  helperText="Nilai aset inventaris sebelum margin"
                />
              </div>
              <div className="col-12 col-md-6">
                <AppInput
                  label="Harga Jual (Pasar Rp)"
                  placeholder="0"
                  icon={<DollarSign size={18} />}
                  value={formSellingPrice}
                  onChange={(e) => setFormSellingPrice(e.target.value)}
                  helperText="Estimasi harga penjualan barang"
                />
              </div>
            </div>
            <AppInput
              label="Jumlah Stok Fisik *"
              placeholder="Contoh: 10"
              type="number"
              value={formStock}
              onChange={(e) => setFormStock(e.target.value)}
              helperText="Kuantitas unit fisik awal di gudang"
            />
          </AppFormSection>
        </div>
      )}
    </section>
  );
}
