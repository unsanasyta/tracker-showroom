// File: app/admin/dashboard/useDashboardController.ts
import { useState, useEffect } from 'react';
import { dashboardModel } from './dashboardModel';
import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

export function useDashboardController() {
    const [stats, setStats] = useState({
        pemasukan: 0,
        pengeluaran: 0,
        keuntungan: 0,
        stokMobil: 0,
        modalMengendap: 0,
        mobilTerjual: 0 // STATE BARU: Untuk menyimpan jumlah unit terjual
    });
    const [activities, setActivities] = useState<any[]>([]);
    const [chartData, setChartData] = useState<number[]>(new Array(12).fill(0));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const purchases = await dashboardModel.getAllPurchases();
                const sales = await dashboardModel.getAllSales();

                const currentYear = new Date().getFullYear();

                const getPurchaseDate = (p: any) => new Date(p.tanggal_pembelian || p.tanggal || p.created_at);
                const getSaleDate = (s: any) => new Date(s.tanggal_penjualan || s.tanggal || s.created_at);

                const purchasesThisYear = purchases.filter((p: any) => getPurchaseDate(p).getFullYear() === currentYear);
                const salesThisYear = sales.filter((s: any) => getSaleDate(s).getFullYear() === currentYear);

                const totalPengeluaran = purchasesThisYear.reduce((sum, item) => sum + Number(item.total_acquisition_cost), 0);
                const totalPemasukan = salesThisYear.reduce((sum, item) => sum + Number(item.sell_price), 0);
                const totalKeuntungan = salesThisYear.reduce((sum, item) => sum + Number(item.net_profit), 0);

                const unsoldPurchases = purchases.filter((p: any) => p.is_sold === false);
                const sisaStok = unsoldPurchases.length;
                const totalModalMengendap = unsoldPurchases.reduce((sum, item) => sum + Number(item.total_acquisition_cost), 0);

                setStats({
                    pemasukan: totalPemasukan,
                    pengeluaran: totalPengeluaran,
                    keuntungan: totalKeuntungan,
                    stokMobil: sisaStok,
                    modalMengendap: totalModalMengendap,
                    mobilTerjual: salesThisYear.length // Memasukkan total unit terjual tahun ini
                });

                const monthlyProfits = new Array(12).fill(0);
                salesThisYear.forEach((s: any) => {
                    const monthIndex = getSaleDate(s).getMonth();
                    monthlyProfits[monthIndex] += Number(s.net_profit);
                });
                setChartData(monthlyProfits);

                const formattedPurchases = purchases.map((p: any) => ({
                    id: p.id,
                    date: getPurchaseDate(p),
                    title: `Beli: ${p.car_brand} (${p.car_year})`,
                    description: `Sumber: ${p.source_name}`,
                    time: getPurchaseDate(p).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                    badge: 'Unit Masuk',
                    badgeClass: 'bg-blue-100 text-[#415A77]',
                    icon: React.createElement(ArrowDown, { size: 16 })
                }));

                const formattedSales = sales.map((s: any) => ({
                    id: s.id,
                    date: getSaleDate(s),
                    title: `Jual: ${s.purchases?.car_brand || 'Mobil'}`,
                    description: `Pembeli: ${s.buyer_name}`,
                    time: getSaleDate(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                    badge: 'Terjual',
                    badgeClass: 'bg-green-100 text-green-700',
                    icon: React.createElement(ArrowUp, { size: 16 })
                }));

                const combinedActivities = [...formattedPurchases, ...formattedSales]
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 4);

                setActivities(combinedActivities);

            } catch (error) {
                console.error("Gagal load dashboard", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { stats, activities, chartData, isLoading };
}