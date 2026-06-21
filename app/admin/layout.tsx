"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    LayoutDashboard,
    ReceiptText,
    LogOut,
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    Menu, // Import icon Menu (Hamburger)
    X     // Import icon X (Close)
} from "lucide-react";
import ModalLogout from "@/app/components/ModalLogout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    // State Sidebar & Modal
    const [isCollapsed, setIsCollapsed] = useState(false); // Untuk Desktop
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Untuk Mobile
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const executeLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Gagal logout: " + error.message);
        } else {
            setIsLogoutModalOpen(false);
            router.push("/");
        }
    };

    return (
        <div className="flex h-screen bg-[#F5F6FA] overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white relative">
            
            {/* CSS Khusus Print */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { margin: 1cm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />

            {/* OVERLAY UNTUK MOBILE (Layar gelap saat menu terbuka) */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* SIDEBAR (Responsive: Fixed & Slide-in di Mobile, Relative di Desktop) */}
            <aside className={`fixed inset-y-0 left-0 z-50 md:relative transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                ${isCollapsed ? "md:w-[80px]" : "md:w-[240px]"} w-[240px] bg-[#1B263B] text-white flex flex-col shrink-0 print:hidden`}
            >
                {/* Tombol Toggle Collapse (Hanya Desktop) */}
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-8 bg-[#1B263B] text-white border border-[#2D3B58] rounded-full p-1.5 hover:bg-[#24324D] transition-colors z-10 hidden md:block">
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Tombol Close Menu (Hanya Mobile) */}
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white md:hidden">
                    <X size={24} />
                </button>

                <div className={`pt-8 pb-6 flex items-center h-[88px] ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                    {isCollapsed ? (
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg"><User size={20} /></div>
                    ) : (
                        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap transition-opacity duration-300 mt-2 md:mt-0">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg"><User size={20} /></div>
                            <div>
                                <h2 className="font-bold text-base leading-tight">Admin</h2>
                                <p className="text-xs text-[#C9D3E1]">Amanah Mobilindo</p>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="px-3 flex-1 flex flex-col gap-1 overflow-hidden mt-4 md:mt-0">
                    <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center py-2.5 rounded-lg transition text-sm font-medium ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"} ${pathname === "/admin/dashboard" || pathname === "/admin" ? "bg-[#AFC4E2] text-[#415A77]" : "text-white hover:bg-[#24324D]"}`}>
                        <LayoutDashboard size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
                    </Link>

                    <Link href="/admin/transactions" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center py-2.5 rounded-lg transition text-sm font-medium ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"} ${pathname.includes("/admin/transactions") ? "bg-[#AFC4E2] text-[#415A77]" : "text-white hover:bg-[#24324D]"}`}>
                        <ReceiptText size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Transactions</span>}
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#2D3B58]">
                    <button onClick={() => setIsLogoutModalOpen(true)} className={`w-full flex items-center py-2.5 rounded-lg hover:bg-[#24324D] text-sm font-medium transition-colors ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}`}>
                        <LogOut size={18} className="shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 print:block print:w-full">
                
                {/* HEADER */}
                <header className="h-[72px] bg-[#F5F6FA] flex items-center justify-between px-4 md:px-8 border-b border-[#E5E7EB] shrink-0 print:hidden">
                    <div className="flex items-center gap-3">
                        {/* Tombol Hamburger (Hanya Mobile) */}
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-[#1B263B] hover:bg-gray-200 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg md:text-xl font-bold text-[#1B263B] truncate max-w-[150px] md:max-w-none">
                            {pathname.includes("/transactions") ? "Dashboard Admin" : "Dashboard Admin"}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Search bar disembunyikan di layar HP yang terlalu kecil, muncul di layar menengah (md) */}
                        <div className="relative hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input placeholder="Search..." className="w-[240px] h-9 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#415A77] transition-colors shadow-sm" />
                        </div>
                        <img src="/logo.png" alt="Amanah Mobilindo" className="h-10 md:h-24 w-auto object-contain" />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto print:block print:overflow-visible print:h-auto">
                    {/* Padding dikurangi di mobile (p-4) dan standar di desktop (md:p-8) */}
                    <div className="max-w-[1400px] mx-auto p-4 md:p-8 print:p-0 print:max-w-none print:w-full">
                        {children}
                    </div>
                </main>
            </div>

            <ModalLogout 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={executeLogout} 
            />
        </div>
    );
}