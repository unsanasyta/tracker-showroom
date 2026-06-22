"use client";

import Link from "next/link";
import {
    Wallet, Banknote, TrendingUp, CarFront,
    PlusCircle, ArrowRightLeft, History
} from "lucide-react";
import { useDashboardController } from "./useDashboardController";

function StatCard({
    title,
    value,
    icon,
    dark = false,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    dark?: boolean;
}) {
    return (
        <div className={`rounded-xl border p-4 ${dark ? "bg-gradient-to-r from-[#1B263B] via-[#0F172A] to-[#1B263B] text-white border-transparent shadow-md" : "bg-white border-[#E5E7EB] shadow-sm"}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-[11px] font-semibold tracking-wider uppercase ${dark ? "text-[#D0D9E6]" : "text-gray-500"}`}>
                        {title}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold mt-2 truncate max-w-[150px] md:max-w-[200px]">
                        {value}
                    </h3>
                </div>
                <div className={`p-2 rounded-lg shrink-0 ${dark ? "bg-[#415A77]" : "bg-[#EEF2F7] text-[#415A77]"}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { stats, activities, chartData, isLoading } = useDashboardController();

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const currentMonthIndex = new Date().getMonth();
    const maxProfit = Math.max(...chartData, 1);

    const hour = new Date().getHours();
    let greeting = "Pagi";
    if (hour >= 11 && hour < 15) greeting = "Siang";
    else if (hour >= 15 && hour < 19) greeting = "Sore";
    else if (hour >= 19 || hour < 4) greeting = "Malam";

    const today = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

    return (
        <div className="flex flex-col gap-6 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#1B263B]">
                        Selamat {greeting}, Admin!
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                        Overview ringkasan keuangan showroom Anda.
                    </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-xs md:text-sm font-semibold text-[#415A77]">
                    {today}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Stok Tersedia" value={`${stats.stokMobil} Unit`} icon={<CarFront size={18} />} />
                <StatCard title="Total Pemasukan (Thn Ini)" value={`Rp ${stats.pemasukan.toLocaleString('id-ID')}`} icon={<Wallet size={18} />} />
                <StatCard title="Total Pengeluaran (Thn Ini)" value={`Rp ${stats.pengeluaran.toLocaleString('id-ID')}`} icon={<Banknote size={18} />} />
                <StatCard dark title="Total Keuntungan (Thn Ini)" value={`Rp ${stats.keuntungan.toLocaleString('id-ID')}`} icon={<TrendingUp size={18} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 md:p-5 shadow-sm flex flex-col flex-1 overflow-x-auto">
                        <div className="flex items-center justify-between mb-6 min-w-[400px]">
                            <h3 className="text-lg font-bold text-[#1B263B]">Tren Keuntungan Bulanan</h3>
                            <button className="px-3 py-1.5 border rounded-lg text-[#415A77] text-xs font-semibold bg-gray-50 transition-colors">
                                Tahun Ini
                            </button>
                        </div>
                        <div className="flex-1 min-h-[220px] flex items-end justify-between gap-1 md:gap-4 px-1 md:px-2 min-w-[400px]">
                            {chartData.map((value, index) => {
                                const heightPercentage = (value / maxProfit) * 100;
                                return (
                                    <div key={index} className="flex flex-col items-center flex-1 gap-2 h-full justify-end group relative">
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-[10px] py-1 px-2 rounded transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            Rp {value.toLocaleString('id-ID')}
                                        </div>
                                        <div className={`w-full rounded-t-sm transition-all duration-500 ${index === currentMonthIndex ? "bg-[#1B263B]" : "bg-[#AFC4E2] hover:bg-[#7F93AE]"}`} style={{ height: `${heightPercentage}%`, minHeight: value > 0 ? '4px' : '2px' }} />
                                        <span className={`text-[9px] md:text-[10px] font-medium mt-1 ${index === currentMonthIndex ? 'text-[#1B263B] font-bold' : 'text-gray-400'}`}>
                                            {months[index]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/admin/transactions/create" className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><PlusCircle size={20} /></div>
                            <div>
                                <h4 className="font-bold text-[#1B263B] text-sm">Catat Transaksi Baru</h4>
                                <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">Input pembelian / penjualan mobil</p>
                            </div>
                        </Link>
                        <Link href="/admin/transactions" className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform"><ArrowRightLeft size={20} /></div>
                            <div>
                                <h4 className="font-bold text-[#1B263B] text-sm">Kelola Riwayat Transaksi</h4>
                                <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">Lihat tabel dan laporan keuangan</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] flex flex-col shadow-sm flex-1">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-bold text-[#1B263B]">Aktivitas Terbaru</h3>
                        </div>
                        <div className="flex-1 flex flex-col">
                            {isLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
                                    <div className="w-6 h-6 border-2 border-gray-300 border-t-[#415A77] rounded-full animate-spin mb-3"></div>
                                    <span className="text-sm font-semibold">Memuat aktivitas...</span>
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300"><History size={32} /></div>
                                    <h4 className="font-bold text-[#1B263B] text-sm mb-1">Belum Ada Riwayat</h4>
                                    <p className="text-xs text-gray-500 mb-4 max-w-[200px]">Data transaksi terbaru akan otomatis muncul di sini.</p>
                                    <Link href="/admin/transactions/create" className="text-xs font-bold text-white bg-[#415A77] px-4 py-2 rounded-lg hover:bg-[#2D4055] transition-colors">
                                        Mulai Transaksi
                                    </Link>
                                </div>
                            ) : (
                                activities.map((activity, index) => (
                                    <div key={index} className="flex gap-3 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                                        <div className="w-9 h-9 rounded-lg bg-[#F3F5F8] flex items-center justify-center text-[#415A77] shrink-0">{activity.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-semibold text-sm text-[#1B263B] truncate">{activity.title}</h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${activity.badgeClass}`}>{activity.badge}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{activity.description}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}