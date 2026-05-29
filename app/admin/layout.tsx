"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ReceiptText,
    LogOut,
    Search,
    ChevronLeft,
    ChevronRight,
    User
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // State untuk mengatur buka/tutup sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[#F5F6FA] overflow-hidden">

            {/* Sidebar (Fixed di kiri, lebar dinamis) */}
            <aside
                className={`${isCollapsed ? "w-[80px]" : "w-[240px]"
                    } bg-[#1B263B] text-white flex flex-col shrink-0 transition-all duration-300 relative`}
            >
                {/* Tombol Toggle Collapse */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-8 bg-[#1B263B] text-white border border-[#2D3B58] rounded-full p-1.5 hover:bg-[#24324D] transition-colors z-10 hidden md:block"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <div className={`pt-8 pb-6 flex items-center h-[88px] ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                    {isCollapsed ? (
                        // Tampilan saat ditutup (Hanya Inisial/Ikon)
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
                            <User size={20} />
                        </div>
                    ) : (
                        // Tampilan saat terbuka
                        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap transition-opacity duration-300">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
                                <User size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-base leading-tight">
                                    Admin
                                </h2>
                                <p className="text-xs text-[#C9D3E1]">
                                    Amanah Mobilindo
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="px-3 flex-1 flex flex-col gap-1 overflow-hidden">
                    <Link
                        href="/admin/dashboard"
                        title="Dashboard"
                        className={`flex items-center py-2.5 rounded-lg transition text-sm font-medium ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"
                            } ${pathname === "/admin/dashboard" || pathname === "/admin"
                                ? "bg-[#AFC4E2] text-[#415A77]"
                                : "text-white hover:bg-[#24324D]"
                            }`}
                    >
                        <LayoutDashboard size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
                    </Link>

                    <Link
                        href="/admin/transactions"
                        title="Transactions"
                        className={`flex items-center py-2.5 rounded-lg transition text-sm font-medium ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"
                            } ${pathname.includes("/admin/transactions")
                                ? "bg-[#AFC4E2] text-[#415A77]"
                                : "text-white hover:bg-[#24324D]"
                            }`}
                    >
                        <ReceiptText size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Transactions</span>}
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#2D3B58]">
                    <button
                        title="Logout"
                        className={`w-full flex items-center py-2.5 rounded-lg hover:bg-[#24324D] text-sm font-medium transition-colors ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"
                            }`}
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

                {/* Header (Fixed di atas konten) */}
                <header className="h-[72px] bg-[#F5F6FA] flex items-center justify-between px-8 border-b border-[#E5E7EB] shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-[#1B263B]">
                            {/* Judul dinamis berdasarkan halaman */}
                            {pathname.includes("/transactions") ? "Dashboard Admin" : "Dashboard Admin"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                placeholder="Search..."
                                className="w-[240px] h-9 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#415A77] transition-colors shadow-sm"
                            />
                        </div>

                        {/* Logo Perusahaan */}
                        <img
                            src="/logo.png"
                            alt="Amanah Mobilindo"
                            className="h-24 w-auto object-contain"
                        />
                    </div>
                </header>

                {/* Content Area (Bisa di-scroll) */}
                <main className="flex-1 overflow-y-auto">
                    {/* Pembungkus agar konten tidak terlalu lebar di layar besar */}
                    <div className="max-w-[1400px] mx-auto p-8">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}