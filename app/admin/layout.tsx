"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    LayoutDashboard,
    ReceiptText,
    LogOut,
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    Menu,
    X,
    CarFront
} from "lucide-react";
import ModalLogout from "@/app/components/ModalLogout";

// --- KOMPONEN LIVE SEARCH BAR ---
function GlobalSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Menutup dropdown jika user klik di luar area search bar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Logika Live Search dengan Debounce (Jeda 300ms agar tidak spam database)
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const query = searchQuery.trim().toLowerCase();
            if (query.length >= 2) { 
                setIsSearching(true);
                setShowDropdown(true);
                
                try {
                    const [purchasesRes, salesRes] = await Promise.all([
                        supabase.from('purchases').select('id, car_brand, car_year, license_plate, source_name').order('created_at', { ascending: false }).limit(200),
                        supabase.from('sales').select('id, buyer_name, purchases(car_brand, car_year, license_plate)').order('created_at', { ascending: false }).limit(200)
                    ]);

                    const pData = purchasesRes.data || [];
                    const sData = salesRes.data || [];

                    let combined: any[] = [];

                    // Filter Pembelian
                    pData.forEach((p: any) => {
                        const searchString = `${p.car_brand} ${p.car_year} ${p.license_plate} ${p.source_name} pur-${p.id}`.toLowerCase();
                        if (searchString.includes(query)) {
                            combined.push({
                                type: 'pembelian',
                                id: p.id,
                                title: `Beli: ${p.car_brand || 'Mobil'} (${p.car_year || ''})`,
                                subtitle: `Nopol: ${p.license_plate?.toUpperCase() || '-'} | Sumber: ${p.source_name || '-'}`,
                                displayId: `PUR-${p.id.substring(0,6).toUpperCase()}`
                            });
                        }
                    });

                    // Filter Penjualan
                    sData.forEach((s: any) => {
                        // PERBAIKAN TypeScript: Ditambahkan ": any" di sini
                        const p: any = s.purchases || {}; 
                        
                        const searchString = `${p.car_brand} ${p.car_year} ${p.license_plate} ${s.buyer_name} sal-${s.id}`.toLowerCase();
                        if (searchString.includes(query)) {
                            combined.push({
                                type: 'penjualan',
                                id: s.id,
                                title: `Jual: ${p.car_brand || 'Mobil'} (${p.car_year || ''})`,
                                subtitle: `Nopol: ${p.license_plate?.toUpperCase() || '-'} | Pembeli: ${s.buyer_name || '-'}`,
                                displayId: `SAL-${s.id.substring(0,6).toUpperCase()}`
                            });
                        }
                    });

                    setResults(combined.slice(0, 8));

                } catch (error) {
                    console.error("Gagal melakukan pencarian:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSelectResult = (type: string, id: string) => {
        setShowDropdown(false);
        setSearchQuery(""); // Bersihkan input setelah diklik
        router.push(`/admin/transactions/detail/${type}/${id}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowDropdown(false);
        if (searchQuery.trim()) {
            router.push(`/admin/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push(`/admin/transactions`);
        }
    };

    return (
        <div className="relative hidden md:block" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit}>
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0 || isSearching) setShowDropdown(true);
                    }}
                    placeholder="Ketik plat, merk, pembeli..." 
                    className="w-[280px] h-9 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#415A77] transition-all shadow-sm focus:w-[320px]" 
                />
            </form>

            {/* DROPDOWN HASIL LIVE SEARCH */}
            {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-[350px] bg-white border border-[#E5E7EB] shadow-xl rounded-xl overflow-hidden z-50 flex flex-col">
                    {isSearching ? (
                        <div className="px-4 py-4 text-sm text-gray-500 flex items-center justify-center gap-3">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#415A77] rounded-full animate-spin"></div>
                            Mencari data...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="flex flex-col max-h-[350px] overflow-y-auto divide-y divide-gray-100">
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                Hasil Pencarian ({results.length})
                            </div>
                            {results.map((res, idx) => (
                                <button 
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectResult(res.type, res.id)}
                                    className="flex flex-col px-4 py-3 text-left hover:bg-blue-50 transition-colors focus:bg-blue-50 outline-none group"
                                >
                                    <div className="flex justify-between items-start w-full mb-1">
                                        <div className="flex items-center gap-2">
                                            <CarFront size={14} className={res.type === 'pembelian' ? 'text-red-500' : 'text-green-500'} />
                                            <span className="text-sm font-bold text-[#1B263B] group-hover:text-blue-700 transition-colors">{res.title}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 font-mono shrink-0">{res.displayId}</span>
                                    </div>
                                    <span className="text-[11px] text-gray-500 truncate w-full pl-6">{res.subtitle}</span>
                                </button>
                            ))}
                            <button 
                                type="button"
                                onClick={handleSearchSubmit}
                                className="px-4 py-3 bg-gray-50 text-xs font-bold text-center text-[#415A77] hover:bg-gray-100 transition-colors"
                            >
                                Lihat semua hasil filter di tabel &rarr;
                            </button>
                        </div>
                    ) : (
                        <div className="px-4 py-6 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                            <Search size={24} className="text-gray-300" />
                            <span>Tidak ada transaksi dengan kata kunci <br/><b className="text-gray-700">"{searchQuery}"</b></span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// --- LAYOUT UTAMA ---
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { margin: 1cm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />

            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 md:relative transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                ${isCollapsed ? "md:w-[80px]" : "md:w-[240px]"} w-[240px] bg-[#1B263B] text-white flex flex-col shrink-0 print:hidden`}
            >
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-8 bg-[#1B263B] text-white border border-[#2D3B58] rounded-full p-1.5 hover:bg-[#24324D] transition-colors z-10 hidden md:block">
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

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

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 print:block print:w-full">
                
                <header className="h-[72px] bg-[#F5F6FA] flex items-center justify-between px-4 md:px-8 border-b border-[#E5E7EB] shrink-0 print:hidden z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-[#1B263B] hover:bg-gray-200 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg md:text-xl font-bold text-[#1B263B] truncate max-w-[150px] md:max-w-none">
                            {pathname.includes("/transactions") ? "Dashboard Admin" : "Dashboard Admin"}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                        <Suspense fallback={<div className="w-[280px] h-9 bg-gray-200 animate-pulse rounded-lg hidden md:block"></div>}>
                            <GlobalSearchBar />
                        </Suspense>
                        <img src="/logo.png" alt="Amanah Mobilindo" className="h-10 md:h-24 w-auto object-contain" />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto print:block print:overflow-visible print:h-auto z-0">
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