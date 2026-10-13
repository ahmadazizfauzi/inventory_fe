/**
 * Helper Khusus Format Rupiah (Standar Indonesia dengan Pemisah Titik)
 * Contoh:
 * - formatRupiah(100000) => "Rp 100.000"
 * - formatRupiah(100000, false) => "100.000"
 * - formatRupiah("12500000") => "Rp 12.500.000"
 */
export function formatRupiah(
  amount: number | string | null | undefined,
  withPrefix = true
): string {
  if (amount === null || amount === undefined || amount === "") {
    return withPrefix ? "Rp 0" : "0";
  }

  const num =
    typeof amount === "number"
      ? amount
      : parseFloat(String(amount).replace(/[^0-9.-]+/g, "")) || 0;

  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(num);

  return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Mengubah string format angka berpemisah titik kembali ke nomor murni
 * Contoh: parseRupiah("100.000") => 100000
 */
export function parseRupiah(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}
