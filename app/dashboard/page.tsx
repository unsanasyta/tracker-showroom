"use client";

import { useState } from "react";
import Menu from "./menu";

// ── helpers ──────────────────────────────────────────────────────────────────
const formatRp = (n: number) => {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
    return `Rp ${n.toLocaleString("id-ID")}`;
};

// ── mock data ─────────────────────────────────────────────────────────────────
const monthlyData = [
    { month: "Jan", profit: 3.8 },
    { month: "Feb", profit: 6.2 },
    { month: "Mar", profit: 5.5 },
    { month: "Apr", profit: 8.8 },
    { month: "May", profit: 7.9 },
    { month: "Jun", profit: 10.4 },
    { month: "Jul", profit: 14.2 },
];

const recentActivities = [
    {
        id: 1, icon: "sold", color: "#22c55e",
        title: "Porsche 911 GT3 RS", badge: "Sold", badgeBg: "#dcfce7", badgeColor: "#15803d",
        sub: "Invoice #INV-2023-089", time: "2 hours ago",
    },
    {
        id: 2, icon: "truck", color: "#3b82f6",
        title: "Mercedes-Benz G63 AMG", badge: "New Unit", badgeBg: "#dbeafe", badgeColor: "#1d4ed8",
        sub: "Added to Inventory (Showroom A)", time: "5 hours ago",
    },
    {
        id: 3, icon: "wrench", color: "#f59e0b",
        title: "Range Rover Autobiography", badge: "Maintenance", badgeBg: "#fef3c7", badgeColor: "#b45309",
        sub: "Sent to detailed inspection", time: "Yesterday",
    },
    {
        id: 4, icon: "sold", color: "#22c55e",
        title: "BMW M8 Competition", badge: "Sold", badgeBg: "#dcfce7", badgeColor: "#15803d",
        sub: "Invoice #INV-2023-088", time: "Yesterday",
    },
];

// ── sub-components ────────────────────────────────────────────────────────────
function ActivityIcon({ type, color }: { type: string; color: string }) {
    return (
        <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: `${color}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
        }}>
            {type === "sold" && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7.5" stroke={color} strokeWidth="1.4" />
                    <path d="M5.5 9.5l2.5 2.5 5-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            {type === "truck" && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="5" width="11" height="8" rx="1" stroke={color} strokeWidth="1.4" />
                    <path d="M12 7l4 2v4h-4V7z" stroke={color} strokeWidth="1.4" />
                    <circle cx="4.5" cy="13.5" r="1.5" stroke={color} strokeWidth="1.4" />
                    <circle cx="13.5" cy="13.5" r="1.5" stroke={color} strokeWidth="1.4" />
                </svg>
            )}
            {type === "wrench" && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M10.5 3.5a4 4 0 00-5.3 5.3L2 12l1.5 1.5 1.5 1.5 3.2-3.2a4 4 0 005.3-5.3l-2.5 2.5-1.5-1.5L12 5l-1.5-1.5z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    );
}

// ── main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [chartYear, setChartYear] = useState<"This Year" | "Last Year">("This Year");
    const maxVal = Math.max(...monthlyData.map((d) => d.profit));

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
            <Menu />

            {/* Main content */}
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
                    <h1 style={{ fontSize: 18, fontWeight: 700, color: "#0d1b2e", letterSpacing: "-0.3px" }}>
                        Financial Trackers
                    </h1>
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
                            <span style={{ color: "#94a3b8", fontSize: 13 }}>Search inventory...</span>
                        </div>
                        <img
                            src="/avatar.png"
                            alt="Admin"
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }}
                        />
                    </div>
                </header>

                {/* Page body */}
                <div style={{ padding: "32px", flex: 1 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0d1b2e", letterSpacing: "-0.4px", marginBottom: 4 }}>
                        Financial Overview
                    </h2>
                    <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Real-time metrics for current month.</p>

                    {/* KPI Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
                        {/* Pemasukan */}
                        <div style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: "24px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            border: "1px solid #f1f5f9",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", color: "#94a3b8", textTransform: "uppercase" }}>
                                    Total Pemasukan
                                </span>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, background: "#eff6ff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <rect x="1.5" y="4" width="15" height="11" rx="2" stroke="#3b82f6" strokeWidth="1.4" />
                                        <path d="M1.5 8h15" stroke="#3b82f6" strokeWidth="1.4" />
                                        <circle cx="5" cy="12" r="1" fill="#3b82f6" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "#0d1b2e", marginTop: 12, letterSpacing: "-0.8px" }}>
                                Rp 12.4B
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 10L7 5l5 5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>+8.2%</span>
                                <span style={{ fontSize: 12, color: "#94a3b8" }}>vs last month</span>
                            </div>
                        </div>

                        {/* Pengeluaran */}
                        <div style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: "24px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            border: "1px solid #f1f5f9",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", color: "#94a3b8", textTransform: "uppercase" }}>
                                    Total Pengeluaran
                                </span>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, background: "#fff7ed",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <rect x="1.5" y="4" width="15" height="11" rx="2" stroke="#f97316" strokeWidth="1.4" />
                                        <path d="M1.5 8h15" stroke="#f97316" strokeWidth="1.4" />
                                        <path d="M5 12h8" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "#0d1b2e", marginTop: 12, letterSpacing: "-0.8px" }}>
                                Rp 8.1B
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 5L7 10l5-5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>-2.4%</span>
                                <span style={{ fontSize: 12, color: "#94a3b8" }}>vs last month</span>
                            </div>
                        </div>

                        {/* Keuntungan */}
                        <div style={{
                            background: "linear-gradient(135deg, #0d1b2e 0%, #1a3a6e 100%)",
                            borderRadius: 16,
                            padding: "24px",
                            boxShadow: "0 4px 20px rgba(13,27,46,0.25)",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                                    Keuntungan
                                </span>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M2 13l4-6 3 3 3-4 4-3" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 4h2v2" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginTop: 12, letterSpacing: "-0.8px" }}>
                                Rp 4.3B
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 10L7 5l5 5" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>+12.5%</span>
                                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>vs last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
                        {/* Chart */}
                        <div style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: "28px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            border: "1px solid #f1f5f9",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0d1b2e", letterSpacing: "-0.3px" }}>
                                    Tren Keuntungan Bulanan
                                </h3>
                                <div style={{
                                    display: "flex",
                                    background: "#f1f5f9",
                                    borderRadius: 8,
                                    padding: 3,
                                }}>
                                    {(["This Year", "Last Year"] as const).map((y) => (
                                        <button
                                            key={y}
                                            onClick={() => setChartYear(y)}
                                            style={{
                                                padding: "5px 12px",
                                                borderRadius: 6,
                                                border: "none",
                                                background: chartYear === y ? "#fff" : "transparent",
                                                color: chartYear === y ? "#0d1b2e" : "#94a3b8",
                                                fontWeight: chartYear === y ? 600 : 400,
                                                fontSize: 12,
                                                cursor: "pointer",
                                                boxShadow: chartYear === y ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, paddingBottom: 28, position: "relative" }}>
                                {/* Y-axis labels */}
                                <div style={{
                                    position: "absolute", left: 0, top: 0, bottom: 28,
                                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                                    paddingRight: 8,
                                }}>
                                    {["15B", "10B", "5B", "0"].map((l) => (
                                        <span key={l} style={{ fontSize: 11, color: "#cbd5e1", textAlign: "right" }}>{l}</span>
                                    ))}
                                </div>

                                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 10, paddingLeft: 32, height: "100%" }}>
                                    {monthlyData.map((d, i) => {
                                        const isLast = i === monthlyData.length - 1;
                                        const heightPct = (d.profit / 15) * 100;
                                        return (
                                            <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: `${heightPct}%`,
                                                        borderRadius: "6px 6px 0 0",
                                                        background: isLast
                                                            ? "linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 100%)"
                                                            : "linear-gradient(180deg, #bfdbfe 0%, #93c5fd 100%)",
                                                        transition: "height 0.3s ease",
                                                    }}
                                                />
                                                <span style={{ fontSize: 11, fontWeight: isLast ? 700 : 400, color: isLast ? "#1d4ed8" : "#94a3b8" }}>
                                                    {d.month}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: "28px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            border: "1px solid #f1f5f9",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0d1b2e", letterSpacing: "-0.3px" }}>
                                    Aktivitas Terakhir
                                </h3>
                                <a href="#" style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>
                                    View All
                                </a>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                {recentActivities.map((act, idx) => (
                                    <div
                                        key={act.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 12,
                                            padding: "14px 0",
                                            borderBottom: idx < recentActivities.length - 1 ? "1px solid #f1f5f9" : "none",
                                        }}
                                    >
                                        <ActivityIcon type={act.icon} color={act.color} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: "#0d1b2e" }}>{act.title}</span>
                                                <span style={{
                                                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                                                    background: act.badgeBg, color: act.badgeColor,
                                                }}>
                                                    {act.badge}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{act.sub}</div>
                                            <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 3 }}>{act.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
