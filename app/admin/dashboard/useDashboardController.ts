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
        stokMobil: 0 // State baru untuk stok
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

                // Hitung Statistik Utama
                const totalPengeluaran = purchases.reduce((sum, item) => sum + Number(item.total_acquisition_cost), 0);
                const totalPemasukan = sales.reduce((sum, item) => sum + Number(item.sell_price), 0);
                const totalKeuntungan = sales.reduce((sum, item) => sum + Number(item.net_profit), 0);

                // Hitung Stok: Mobil yang is_sold nya masih false
                const sisaStok = purchases.filter((p: any) => p.is_sold === false).length;

                setStats({
                    pemasukan: totalPemasukan,
                    pengeluaran: totalPengeluaran,
                    keuntungan: totalKeuntungan,
                    stokMobil: sisaStok
                });

                const currentYear = new Date().getFullYear();
                const monthlyProfits = new Array(12).fill(0);

                sales.forEach((s: any) => {
                    const saleDate = new Date(s.created_at);
                    if (saleDate.getFullYear() === currentYear) {
                        const monthIndex = saleDate.getMonth();
                        monthlyProfits[monthIndex] += Number(s.net_profit);
                    }
                });

                setChartData(monthlyProfits);

                const formattedPurchases = purchases.map((p: any) => ({
                    id: p.id,
                    date: new Date(p.created_at),
                    title: `Beli: ${p.car_brand} (${p.car_year})`,
                    description: `Sumber: ${p.source_name}`,
                    time: new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                    badge: 'Unit Masuk',
                    badgeClass: 'bg-blue-100 text-[#415A77]',
                    icon: React.createElement(ArrowDown, { size: 16 })
                }));

                const formattedSales = sales.map((s: any) => ({
                    id: s.id,
                    date: new Date(s.created_at),
                    title: `Jual: ${s.purchases?.car_brand || 'Mobil'}`,
                    description: `Pembeli: ${s.buyer_name}`,
                    time: new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
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