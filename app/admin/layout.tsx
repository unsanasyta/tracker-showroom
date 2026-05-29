"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ReceiptText,
    LogOut,
    UserCircle2,
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#F5F6FA]">
            {/* Sidebar */}

            <aside className="fixed left-0 top-0 h-screen w-[255px] bg-[#1B263B] text-white flex flex-col">
                <div className="px-8 pt-10 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white text-[#1B263B] flex items-center justify-center">
                            <UserCircle2 size={28} />
                        </div>

                        <div>
                            <h2 className="font-bold text-[18px]">
                                Admin
                            </h2>

                            <p className="text-sm text-[#C9D3E1]">
                                Showroom Elite
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="px-4">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === "/dashboard"
                            ? "bg-[#AFC4E2] text-[#415A77]"
                            : "text-white hover:bg-[#24324D]"
                            }`}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <Link
                        href="/transactions"
                        className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === "/transactions"
                            ? "bg-[#AFC4E2] text-[#415A77]"
                            : "text-white hover:bg-[#24324D]"
                            }`}
                    >
                        <ReceiptText size={18} />
                        Transactions
                    </Link>
                </nav>

                <div className="mt-auto p-4 border-t border-[#2D3B58]">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#24324D]">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content */}

            <main className="ml-[255px] min-h-screen">
                {children}
            </main>
        </div>
    );
}