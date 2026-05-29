"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        label: "Transactions",
        href: "/dashboard/transactions",
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1.5" y="3" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M1.5 7h15" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 11h3M5 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
];

export default function Menu() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: 240,
            minHeight: "100vh",
            background: "linear-gradient(180deg, #0d1b2e 0%, #0f2240 100%)",
            display: "flex",
            flexDirection: "column",
            padding: "0",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 100,
            boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
        }}>
            {/* Logo */}
            <div style={{
                padding: "28px 24px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                gap: 12,
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
                }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M4 16l4-8 4 5 2-3 4 6H4z" fill="white" opacity="0.9" />
                        <circle cx="17" cy="5" r="2.5" fill="white" opacity="0.7" />
                    </svg>
                </div>
                <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>Admin</div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 400 }}>Showroom Elite</div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ padding: "16px 12px", flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "10px 14px",
                                borderRadius: 10,
                                marginBottom: 4,
                                color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                                background: isActive ? "rgba(37,99,235,0.25)" : "transparent",
                                textDecoration: "none",
                                fontWeight: isActive ? 600 : 400,
                                fontSize: 14,
                                transition: "all 0.18s ease",
                                borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                            }}
                        >
                            <span style={{ color: isActive ? "#60a5fa" : "rgba(255,255,255,0.4)" }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        width: "100%",
                        borderRadius: 10,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 14,
                        fontWeight: 400,
                        transition: "all 0.18s ease",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.1)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M12 12l3-3-3-3M15 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
}
