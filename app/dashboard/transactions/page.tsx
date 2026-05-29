"use client";

import { useState } from "react";
import Menu from "../../dashboard/menu";

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "list" | "add";
type TransactionType = "Pembelian Mobil" | "Penjualan Mobil";
type ListTab = "Pembelian Produk" | "Penjualan Produk";

interface Transaction {
    date: string;
    id: string;
    status: "Completed" | "Pending";
    identity: string;
    client: string;
    description: string;
    category: string;
    amount: number;
    isIncome: boolean;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const purchaseTransactions: Transaction[] = [
    { date: "Oct 24, 2023", id: "TRX-9928A", status: "Completed", identity: "Porsche 911 GT3", client: "M. Sterling", description: "Unit Purchase", category: "Unit Buy", amount: 185000, isIncome: false },
    { date: "Oct 23, 2023", id: "TRX-9927B", status: "Completed", identity: "Facility Lease", client: "Prime Real Estate", description: "Facility Lease", category: "Rent", amount: 12500, isIncome: false },
    { date: "Oct 22, 2023", id: "TRX-9926C", status: "Pending", identity: "Detailing Services", client: "Shine Elite Auto", description: "Detailing Services", category: "Maintenance", amount: 850, isIncome: false },
    { date: "Oct 21, 2023", id: "TRX-9925D", status: "Completed", identity: "BMW M8 Competition", client: "Showroom A", description: "Unit Purchase", category: "Unit Buy", amount: 142000, isIncome: false },
    { date: "Oct 20, 2023", id: "TRX-9924E", status: "Completed", identity: "Mercedes G63 AMG", client: "Vendor EE", description: "Engine Service", category: "Maintenance", amount: 3200, isIncome: false },
];

const saleTransactions: Transaction[] = [
    { date: "Oct 24, 2023", id: "TRX-9928A", status: "Completed", identity: "Porsche 911 GT3", client: "M. Sterling", description: "Unit Sale", category: "Unit Sale", amount: 185000, isIncome: true },
    { date: "Oct 22, 2023", id: "TRX-9926C", status: "Pending", identity: "Range Rover Autobiography", client: "T. Anderson", description: "Unit Sale", category: "Unit Sale", amount: 220000, isIncome: true },
    { date: "Oct 21, 2023", id: "TRX-9925D", status: "Completed", identity: "BMW M8 Competition", client: "J. Willis", description: "Unit Sale", category: "Unit Sale", amount: 178000, isIncome: true },
];

const categoryOptions = ["All Categories", "Unit Buy", "Unit Sale", "Maintenance", "Rent", "Other"];
const ownershipOptions = ["Amanah / Berlian", "Showroom A", "Showroom B", "Personal"];
const yearOptions = ["2024", "2023", "2022", "2021", "2020"];

// ── Sub Components ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "Completed" | "Pending" }) {
    return (
        <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
            background: status === "Completed" ? "#dcfce7" : "#fef9c3",
            color: status === "Completed" ? "#15803d" : "#a16207",
        }}>
            {status}
        </span>
    );
}

function CategoryBadge({ category }: { category: string }) {
    const map: Record<string, { bg: string; color: string; icon: string }> = {
        "Unit Sale": { bg: "#dcfce7", color: "#15803d", icon: "↑" },
        "Unit Buy": { bg: "#dbeafe", color: "#1d4ed8", icon: "↓" },
        "Maintenance": { bg: "#fef3c7", color: "#b45309", icon: "🔧" },
        "Rent": { bg: "#fce7f3", color: "#9d174d", icon: "↓" },
    };
    const style = map[category] || { bg: "#f1f5f9", color: "#475569", icon: "•" };
    return (
        <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
            background: style.bg, color: style.color, display: "inline-flex", alignItems: "center", gap: 3,
        }}>
            <span>{style.icon}</span> {category}
        </span>
    );
}

// ── Form: Pembelian ───────────────────────────────────────────────────────────
function FormPembelian({ onCancel }: { onCancel: () => void }) {
    const [hargaBeli, setHargaBeli] = useState(0);
    const [cat, setCat] = useState(0);
    const [mesin, setMesin] = useState(0);
    const [onderdil, setOnderdil] = useState(0);
    const [pajak, setPajak] = useState(0);
    const hargaJadi = hargaBeli + cat + mesin + onderdil + pajak;

    const inputStyle = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1.5px solid #e2e8f0",
        background: "#fff",
        fontSize: 14,
        color: "#0d1b2e",
        outline: "none",
        boxSizing: "border-box" as const,
        fontFamily: "'DM Sans', sans-serif",
    };

    const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 } as const;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
            {/* Left side */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Identitas Mobil */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0d1b2e", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
                        Identitas Mobil
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Kepemilikan</label>
                            <select style={{ ...inputStyle, cursor: "pointer" }}>
                                {ownershipOptions.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Nama Sumber</label>
                                <input type="text" placeholder="Nama pemilik sebelumnya..." style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Harga Beli</label>
                                <input
                                    type="number"
                                    value={hargaBeli || ""}
                                    onChange={e => setHargaBeli(Number(e.target.value))}
                                    placeholder="Rp 0"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Merk Mobil</label>
                                <input type="text" placeholder="Toyota, BMW, Porsche..." style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Tahun</label>
                                <select style={{ ...inputStyle, cursor: "pointer" }}>
                                    <option value="">Pilih tahun...</option>
                                    {yearOptions.map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Warna</label>
                                <input type="text" placeholder="Warna kendaraan..." style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>No Polisi</label>
                                <input type="text" placeholder="B 1234 CD..." style={inputStyle} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pengeluaran & Service */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0d1b2e", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
                        Pengeluaran & Service
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                            { label: "Cat", val: cat, set: setCat },
                            { label: "Mesin", val: mesin, set: setMesin },
                            { label: "Onderdil", val: onderdil, set: setOnderdil },
                            { label: "Pajak", val: pajak, set: setPajak },
                        ].map(({ label, val, set }) => (
                            <div key={label}>
                                <label style={labelStyle}>{label}</label>
                                <input
                                    type="number"
                                    value={val || ""}
                                    onChange={e => set(Number(e.target.value))}
                                    placeholder="Rp 0"
                                    style={inputStyle}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Dokumentasi */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0d1b2e", marginBottom: 16 }}>Dokumentasi</h3>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Unggah Dokumen Pendukung</p>
                    <div style={{
                        border: "2px dashed #e2e8f0", borderRadius: 12, padding: "28px 20px",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        background: "#f8fafc", cursor: "pointer",
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12, background: "#eff6ff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M11 14V4M7 8l4-4 4 4" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 16v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6" }}>Tarik dan lepas file di sini</span>
                        <span style={{ fontSize: 12, color: "#94a3b8", textAlign: "center" }}>atau klik untuk menelusuri (PDF, JPG, PNG)</span>
                    </div>
                </div>

                {/* Harga Jadi */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ ...labelStyle, color: "#0d1b2e" }}>Harga Jadi</label>
                        <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>(Otomatis: Harga Beli + Service + Pajak)</p>
                        <div style={{
                            padding: "12px 16px",
                            borderRadius: 10,
                            background: "#eff6ff",
                            border: "1.5px solid #bfdbfe",
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#1d4ed8",
                        }}>
                            Rp {hargaJadi.toLocaleString("id-ID")}
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Deskripsi Tambahan</label>
                        <textarea
                            placeholder="Tambahkan catatan pembelian..."
                            rows={4}
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                                lineHeight: 1.6,
                            }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button style={{
                        padding: "13px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #0d1b2e, #1a3a6e)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: "0 4px 16px rgba(13,27,46,0.3)",
                    }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" />
                            <path d="M5 8l2.5 2.5L11 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Simpan Transaksi
                    </button>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: "12px",
                            borderRadius: 10,
                            background: "#fff",
                            color: "#374151",
                            fontWeight: 600,
                            fontSize: 14,
                            border: "1.5px solid #e2e8f0",
                            cursor: "pointer",
                        }}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Form: Penjualan ───────────────────────────────────────────────────────────
function FormPenjualan({ onCancel }: { onCancel: () => void }) {
    const [hargaJual, setHargaJual] = useState(0);

    const inputStyle = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1.5px solid #e2e8f0",
        background: "#fff",
        fontSize: 14,
        color: "#0d1b2e",
        outline: "none",
        boxSizing: "border-box" as const,
        fontFamily: "'DM Sans', sans-serif",
    };
    const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 } as const;

    return (
        <div style={{ maxWidth: 800 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0d1b2e", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                    Informasi Penjualan
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                        <label style={labelStyle}>Kepemilikan</label>
                        <select style={{ ...inputStyle, cursor: "pointer" }}>
                            {ownershipOptions.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Mobil <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Dari Inventaris)</span></label>
                        <select style={{ ...inputStyle, cursor: "pointer" }}>
                            <option value="">Cari/Pilih Mobil...</option>
                            <option>Porsche 911 GT3 RS – 2022 – Putih</option>
                            <option>BMW M8 Competition – 2023 – Hitam</option>
                            <option>Mercedes-Benz G63 AMG – 2023 – Silver</option>
                        </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                        <div>
                            <label style={labelStyle}>Nama Pembeli</label>
                            <input type="text" placeholder="Nama lengkap pembeli..." style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Nama Makelar</label>
                            <input type="text" placeholder="Nama makelar (jika ada)..." style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                        <div>
                            <label style={labelStyle}>Harga Jual</label>
                            <input
                                type="number"
                                value={hargaJual || ""}
                                onChange={e => setHargaJual(Number(e.target.value))}
                                placeholder="Rp 0"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>
                                Keuntungan Bersih{" "}
                                <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>(Otomatis)</span>
                            </label>
                            <div style={{
                                padding: "10px 14px",
                                borderRadius: 10,
                                background: "#eff6ff",
                                border: "1.5px solid #bfdbfe",
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#1d4ed8",
                            }}>
                                Rp {hargaJual.toLocaleString("id-ID")}
                            </div>
                            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                                Harga Jual – Harga Jadi (Acquisition Cost)
                            </p>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Deskripsi Tambahan</label>
                        <textarea
                            placeholder="Catatan penjualan..."
                            rows={4}
                            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 28, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                    <button style={{
                        flex: 1, padding: "12px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #0d1b2e, #1a3a6e)",
                        color: "#fff", fontWeight: 700, fontSize: 14,
                        border: "none", cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(13,27,46,0.3)",
                    }}>
                        Simpan Transaksi
                    </button>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1, padding: "12px",
                            borderRadius: 10,
                            background: "#fff", color: "#374151",
                            fontWeight: 600, fontSize: 14,
                            border: "1.5px solid #e2e8f0", cursor: "pointer",
                        }}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Transactions() {
    const [tab, setTab] = useState<Tab>("list");
    const [transType, setTransType] = useState<TransactionType>("Pembelian Mobil");
    const [listTab, setListTab] = useState<ListTab>("Pembelian Produk");
    const [category, setCategory] = useState("All Categories");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [page, setPage] = useState(1);

    const rows = listTab === "Pembelian Produk" ? purchaseTransactions : saleTransactions;
    const total = { income: 3245500, expense: 1842800, profit: 1402700 };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
            <Menu />

            <main style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Top bar */}
                <header style={{
                    background: "#fff",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "0 32px",
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "#f8fafc", border: "1px solid #e2e8f0",
                            borderRadius: 10, padding: "8px 14px", minWidth: 220,
                        }}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <circle cx="6.5" cy="6.5" r="5.5" stroke="#94a3b8" strokeWidth="1.4" />
                                <path d="M10.5 10.5l3 3" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                            <span style={{ color: "#94a3b8", fontSize: 13 }}>Search transactions...</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <button style={{
                            width: 36, height: 36, borderRadius: 10, background: "#f8fafc",
                            border: "1px solid #e2e8f0", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 2a6 6 0 016 6c0 1.5-0.5 3-1.5 4L14 14" stroke="#64748b" strokeWidth="1.5" />
                                <path d="M8 2a6 6 0 00-6 6c0 1.5.5 3 1.5 4L2 14" stroke="#64748b" strokeWidth="1.5" />
                                <path d="M6 14a2 2 0 004 0" stroke="#64748b" strokeWidth="1.5" />
                            </svg>
                        </button>
                        <button style={{
                            width: 36, height: 36, borderRadius: 10, background: "#f8fafc",
                            border: "1px solid #e2e8f0", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="#64748b" strokeWidth="1.5" />
                                <path d="M8 5v3l2 2" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <img
                            src="/avatar.png"
                            alt="Admin"
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }}
                        />
                    </div>
                </header>

                <div style={{ padding: "32px", flex: 1 }}>
                    {/* Title row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                        <div>
                            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0d1b2e", letterSpacing: "-0.4px", marginBottom: 4 }}>
                                Transaction Tracker
                            </h2>
                            <p style={{ color: "#64748b", fontSize: 14 }}>Monitor and manage all financial inflows and outflows.</p>
                        </div>
                        {tab === "list" && (
                            <button
                                onClick={() => setTab("add")}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "11px 20px",
                                    borderRadius: 10,
                                    background: "linear-gradient(135deg, #0d1b2e, #1a3a6e)",
                                    color: "#fff",
                                    fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                                    boxShadow: "0 4px 16px rgba(13,27,46,0.3)",
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Tambah Transaksi Baru
                            </button>
                        )}
                    </div>

                    {tab === "list" ? (
                        <>
                            {/* KPI */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
                                <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>TOTAL PEMASUKAN</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2 10L7 5l5 5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: 22, fontWeight: 800, color: "#0d1b2e", letterSpacing: "-0.5px" }}>
                                            ${total.income.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>TOTAL PENGELUARAN</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2 5L7 10l5-5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: 22, fontWeight: 800, color: "#0d1b2e", letterSpacing: "-0.5px" }}>
                                            ${total.expense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1a3a6e 100%)", borderRadius: 16, padding: 24, boxShadow: "0 4px 16px rgba(13,27,46,0.2)" }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>KEUNTUNGAN</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <rect x="2" y="4" width="10" height="7" rx="1" stroke="#60a5fa" strokeWidth="1.4" />
                                                <path d="M5 4V3a2 2 0 014 0v1" stroke="#60a5fa" strokeWidth="1.4" />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
                                            ${total.profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                                <div>
                                    <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 4 }}>Category Filter</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        style={{ padding: "8px 32px 8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, background: "#fff", cursor: "pointer", color: "#374151", outline: "none" }}
                                    >
                                        {categoryOptions.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 4 }}>Date Range</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#374151", outline: "none" }} />
                                        <span style={{ color: "#94a3b8" }}>-</span>
                                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#374151", outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                                    <button style={{
                                        padding: "8px 16px", borderRadius: 8,
                                        background: "#0d1b2e", color: "#fff",
                                        border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: 6,
                                    }}>
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <path d="M1 3h11M3 6.5h7M5 10h3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                                        </svg>
                                        Apply Filters
                                    </button>
                                    <button style={{
                                        padding: "8px 14px", borderRadius: 8,
                                        background: "#fff", color: "#64748b",
                                        border: "1.5px solid #e2e8f0", fontSize: 13, fontWeight: 500, cursor: "pointer",
                                    }}>
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                                {/* Tabs */}
                                <div style={{ borderBottom: "1px solid #f1f5f9", display: "flex" }}>
                                    {(["Pembelian Produk", "Penjualan Produk"] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setListTab(t)}
                                            style={{
                                                flex: 1, padding: "16px 24px",
                                                border: "none", background: "transparent",
                                                fontWeight: listTab === t ? 700 : 500,
                                                color: listTab === t ? "#0d1b2e" : "#94a3b8",
                                                fontSize: 14, cursor: "pointer",
                                                borderBottom: listTab === t ? "2px solid #1d4ed8" : "2px solid transparent",
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f8fafc" }}>
                                            {["DATE", "ID", "KEPEMILIKAN", "IDENTITAS MOBIL", "DESKRIPSI", listTab === "Pembelian Produk" ? "HARGA JADI" : "KEUNTUNGAN"].map(h => (
                                                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.8px" }}>
                                                    {h}
                                                </th>
                                            ))}
                                            <th style={{ width: 40 }} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, i) => (
                                            <tr
                                                key={row.id + i}
                                                style={{
                                                    borderTop: "1px solid #f1f5f9",
                                                    transition: "background 0.12s",
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                            >
                                                <td style={{ padding: "16px", fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}>{row.date}</td>
                                                <td style={{ padding: "16px", fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{row.id}</td>
                                                <td style={{ padding: "16px" }}>
                                                    <StatusBadge status={row.status} />
                                                </td>
                                                <td style={{ padding: "16px" }}>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0d1b2e" }}>{row.identity}</div>
                                                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Client: {row.client}</div>
                                                </td>
                                                <td style={{ padding: "16px" }}>
                                                    <CategoryBadge category={row.category} />
                                                </td>
                                                <td style={{ padding: "16px", fontSize: 14, fontWeight: 700, color: row.isIncome ? "#16a34a" : "#dc2626" }}>
                                                    {row.isIncome ? "+" : "-"}${row.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                </td>
                                                <td style={{ padding: "16px" }}>
                                                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <circle cx="8" cy="3" r="1" fill="currentColor" />
                                                            <circle cx="8" cy="8" r="1" fill="currentColor" />
                                                            <circle cx="8" cy="13" r="1" fill="currentColor" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div style={{
                                    padding: "14px 20px",
                                    borderTop: "1px solid #f1f5f9",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                    <span style={{ fontSize: 13, color: "#64748b" }}>
                                        Showing {(page - 1) * 5 + 1} to {Math.min(page * 5, 45)} of 45 transactions
                                    </span>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                            style={{
                                                padding: "7px 16px", borderRadius: 8,
                                                border: "1.5px solid #e2e8f0",
                                                background: page === 1 ? "#f8fafc" : "#fff",
                                                color: page === 1 ? "#cbd5e1" : "#374151",
                                                fontSize: 13, fontWeight: 500, cursor: page === 1 ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            style={{
                                                padding: "7px 16px", borderRadius: 8,
                                                border: "none",
                                                background: "#0d1b2e",
                                                color: "#fff",
                                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Add Transaction Form */
                        <div>
                            {/* Breadcrumb */}
                            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>
                                <span style={{ cursor: "pointer", color: "#3b82f6" }} onClick={() => setTab("list")}>Transaksi</span>
                                {" › "}
                                <span style={{ color: "#0d1b2e", fontWeight: 600 }}>Tambah Transaksi Baru</span>
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0d1b2e", letterSpacing: "-0.4px", marginBottom: 24 }}>
                                Tambah Transaksi Baru
                            </h2>

                            {/* Type Toggle */}
                            <div style={{
                                background: "#fff", borderRadius: 16, padding: "16px 20px",
                                border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: 24,
                            }}>
                                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>Pilih Jenis Transaksi</p>
                                <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 10, padding: 3 }}>
                                    {(["Pembelian Mobil", "Penjualan Mobil"] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTransType(t)}
                                            style={{
                                                flex: 1, padding: "10px 20px", borderRadius: 8,
                                                border: "none",
                                                background: transType === t ? "#fff" : "transparent",
                                                color: transType === t ? "#0d1b2e" : "#94a3b8",
                                                fontWeight: transType === t ? 700 : 400,
                                                fontSize: 14, cursor: "pointer",
                                                boxShadow: transType === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {transType === "Pembelian Mobil"
                                ? <FormPembelian onCancel={() => setTab("list")} />
                                : <FormPenjualan onCancel={() => setTab("list")} />
                            }
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
