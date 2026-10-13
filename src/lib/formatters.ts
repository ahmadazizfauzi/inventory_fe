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

/**
 * Helper Format Tanggal Saja (Standar Indonesia DD/MM/YYYY)
 * Contoh: formatDate("2026-10-13T04:17:59.000000Z") => "13/10/2026"
 */
export function formatDate(
  value: string | Date | null | undefined,
  fallback = "-"
): string {
  if (!value) return fallback;
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString("id-ID");
}

/**
 * Helper Format Tanggal & Jam Lengkap (Dengan Waktu WIB)
 * Berguna untuk log audit trail / mutasi stok.
 *
 * Contoh pemakaian:
 * 1. Objek terpisah: const { date, time } = formatDateTime(row.created_at);
 * 2. String lengkap: formatDateTime(row.created_at).full => "13 Okt 2026, 11:17:59 WIB"
 */
export function formatDateTime(
  value: string | Date | null | undefined,
  fallback = "-"
): { date: string; time: string; full: string } {
  if (!value) return { date: fallback, time: "", full: fallback };
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return { date: fallback, time: "", full: fallback };

  const date = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const time = `${d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })} WIB`;

  return {
    date,
    time,
    full: `${date}, ${time}`,
  };
}
