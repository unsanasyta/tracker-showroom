// File: app/admin/transactions/useTransactionsController.ts
import { useState, useEffect } from 'react';
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { transactionModel } from './transactionModel';

export interface TransactionUI {
    dbId: string;
    id: string;
    rawDate: string;
    date: string;
    title: string;
    client: string;
    descType: string;
    descIcon: React.ReactNode;
    descColor: string;
    amount: string;
    amountColor: string;
}

export function useTransactionsController() {
    const [activeTab, setActiveTab] = useState<'pembelian' | 'penjualan'>('pembelian');
    const [transactions, setTransactions] = useState<TransactionUI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [stats, setStats] = useState({
        pemasukan: 0,
        pengeluaran: 0,
        keuntungan: 0
    });

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day},\n${year}`;
    };

    // 1. Kita keluarkan fetchStats dari useEffect agar bisa dipanggil kapan saja
    const fetchStats = async () => {
        try {
            const purchases = await transactionModel.getPurchasesForStats();
            const sales = await transactionModel.getSalesForStats();

            const totalPengeluaran = purchases.reduce((sum, item) => sum + Number(item.total_acquisition_cost), 0);
            const totalPemasukan = sales.reduce((sum, item) => sum + Number(item.sell_price), 0);
            const totalKeuntungan = sales.reduce((sum, item) => sum + Number(item.net_profit), 0);

            setStats({
                pemasukan: totalPemasukan,
                pengeluaran: totalPengeluaran,
                keuntungan: totalKeuntungan
            });
        } catch (error) {
            console.error("Gagal mengambil statistik:", error);
        }
    };

    // 2. Panggil fetchStats saat halaman pertama kali dimuat
    useEffect(() => {
        fetchStats();
    }, []);

    // Ambil Daftar Transaksi
    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'pembelian') {
                    const data = await transactionModel.getPurchasesList();
                    const formattedData: TransactionUI[] = data.map((item: any) => ({
                        dbId: item.id,
                        id: `PUR-${item.id.substring(0, 6).toUpperCase()}`,
                        rawDate: item.created_at,
                        date: formatDate(item.created_at),
                        title: `Beli: ${item.car_brand} (${item.car_year})`,
                        client: `Sumber: ${item.source_name}`,
                        descType: 'Pembelian Unit',
                        descIcon: React.createElement(ArrowDown, { size: 14, className: "text-red-600" }),
                        descColor: 'text-red-700',
                        amount: `-Rp ${Number(item.total_acquisition_cost).toLocaleString('id-ID')}`,
                        amountColor: 'text-[#1B263B]'
                    }));
                    setTransactions(formattedData);
                } else {
                    const data = await transactionModel.getSalesList();
                    const formattedData: TransactionUI[] = data.map((item: any) => ({
                        dbId: item.id,
                        id: `SAL-${item.id.substring(0, 6).toUpperCase()}`,
                        rawDate: item.created_at,
                        date: formatDate(item.created_at),
                        title: `Jual: ${item.purchases?.car_brand || 'Mobil'} (${item.purchases?.car_year || ''})`,
                        client: `Pembeli: ${item.buyer_name}`,
                        descType: 'Penjualan Unit',
                        descIcon: React.createElement(ArrowUp, { size: 14, className: "text-green-600" }),
                        descColor: 'text-green-700',
                        amount: `+Rp ${Number(item.net_profit).toLocaleString('id-ID')}`,
                        amountColor: 'text-green-600'
                    }));
                    setTransactions(formattedData);
                }
            } catch (error) {
                console.error("Gagal mengambil transaksi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, [activeTab]);

    // Hapus Data
    const handleDelete = async (id: string, type: 'pembelian' | 'penjualan') => {
        if (!confirm(`Yakin ingin menghapus data ${type} ini? Data akan terhapus permanen.`)) return;

        try {
            if (type === 'penjualan') {
                const saleData = await transactionModel.getSaleById(id);
                if (saleData) {
                    await transactionModel.updatePurchaseStatus(saleData.purchase_id, false);
                }
            }

            await transactionModel.deleteRecord(type === 'pembelian' ? 'purchases' : 'sales', id);

            // Hapus dari tabel UI
            setTransactions(transactions.filter(t => t.dbId !== id));

            // 3. PANGGIL ULANG fetchStats() di sini agar kartu di atas ikut ter-update!
            await fetchStats();

            alert("Data berhasil dihapus!");
        } catch (error: any) {
            alert("Gagal menghapus data: " + error.message);
        }
    };

    return {
        activeTab, setActiveTab,
        transactions, isLoading,
        openDropdown, setOpenDropdown,
        stats, handleDelete
    };
}