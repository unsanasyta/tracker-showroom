// File: app/admin/transactions/useTransactionsController.ts
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { transactionModel } from './transactionModel';

export interface TransactionUI {
    dbId: string;
    id: string;
    rawDate: string;
    date: string;
    title: string;
    carBrand: string;
    client: string;
    licensePlate: string;
    color: string;
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
    
    // State untuk filter pengurutan
    const [sortOrder, setSortOrder] = useState<'newest' | 'asc' | 'desc'>('newest');

    // State untuk filter rentang tanggal
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [appliedStartDate, setAppliedStartDate] = useState('');
    const [appliedEndDate, setAppliedEndDate] = useState('');

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

    useEffect(() => {
        fetchStats();
    }, []);

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
                        carBrand: item.car_brand || '',
                        client: `Sumber: ${item.source_name}`,
                        licensePlate: item.license_plate || '-',
                        color: item.car_color || '-',
                        descType: 'Pembelian Unit',
                        descIcon: React.createElement(ArrowDown, { size: 14, className: "text-red-600" }),
                        descColor: 'text-red-700',
                        amount: `-Rp ${Number(item.total_acquisition_cost).toLocaleString('id-ID')}`,
                        amountColor: 'text-[#1B263B]'
                    }));
                    setTransactions(formattedData);
                } else {
                    const data = await transactionModel.getSalesList();
                    const formattedData: TransactionUI[] = data.map((item: any) => {
                        const netProfit = Number(item.net_profit);
                        const isProfit = netProfit >= 0;

                        return {
                            dbId: item.id,
                            id: `SAL-${item.id.substring(0, 6).toUpperCase()}`,
                            rawDate: item.created_at,
                            date: formatDate(item.created_at),
                            title: `Jual: ${item.purchases?.car_brand || 'Mobil'} (${item.purchases?.car_year || ''})`,
                            carBrand: item.purchases?.car_brand || 'Mobil',
                            client: `Pembeli: ${item.buyer_name}`,
                            licensePlate: item.purchases?.license_plate || '-',
                            color: item.purchases?.car_color || '-',
                            descType: 'Penjualan Unit',
                            descIcon: React.createElement(ArrowUp, { size: 14, className: "text-green-600" }),
                            descColor: 'text-green-700',
                            amountColor: isProfit ? 'text-green-600' : 'text-red-600',
                            amount: isProfit 
                                ? `+Rp ${netProfit.toLocaleString('id-ID')}` 
                                : `-Rp ${Math.abs(netProfit).toLocaleString('id-ID')}`
                        };
                    });
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

    const handleApplyFilter = () => {
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
    };

    const handleResetFilter = () => {
        setStartDate('');
        setEndDate('');
        setAppliedStartDate('');
        setAppliedEndDate('');
        setSortOrder('newest'); 
    };

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];

        if (appliedStartDate) {
            const start = new Date(appliedStartDate);
            start.setHours(0, 0, 0, 0);
            result = result.filter(t => new Date(t.rawDate) >= start);
        }
        if (appliedEndDate) {
            const end = new Date(appliedEndDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(t => new Date(t.rawDate) <= end);
        }

        if (sortOrder === 'asc') {
            result.sort((a, b) => a.carBrand.localeCompare(b.carBrand));
        } else if (sortOrder === 'desc') {
            result.sort((a, b) => b.carBrand.localeCompare(a.carBrand));
        } else {
            result.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
        }

        return result;
    }, [transactions, sortOrder, appliedStartDate, appliedEndDate]);

    const handleDownloadExcel = () => {
        if (filteredAndSortedTransactions.length === 0) {
            alert("Tidak ada data untuk diunduh pada rentang waktu/filter ini.");
            return;
        }

        let csvContent = "";
        
        if (activeTab === 'pembelian') {
            csvContent += "Tanggal,ID Transaksi,Identitas Mobil,Sumber,No Polisi,Warna,Harga Jadi\n";
            filteredAndSortedTransactions.forEach(row => {
                const cleanTitle = row.title.replace('Beli: ', '').replace(/,/g, '');
                const cleanClient = row.client.replace('Sumber: ', '').replace(/,/g, '');
                const cleanAmount = row.amount.replace('-Rp ', '').replace(/\./g, '');
                const cleanDate = row.date.replace('\n', ' ');
                csvContent += `"${cleanDate}","${row.id}","${cleanTitle}","${cleanClient}","${row.licensePlate}","${row.color}","${cleanAmount}"\n`;
            });
        } else {
            csvContent += "Tanggal,ID Transaksi,Identitas Mobil,Pembeli,No Polisi,Warna,Keuntungan Bersih\n";
            filteredAndSortedTransactions.forEach(row => {
                const cleanTitle = row.title.replace('Jual: ', '').replace(/,/g, '');
                const cleanClient = row.client.replace('Pembeli: ', '').replace(/,/g, '');
                const isNegative = row.amount.includes('-Rp');
                const rawAmount = row.amount.replace(/\+Rp |-Rp /g, '').replace(/\./g, '');
                const finalAmount = isNegative ? `-${rawAmount}` : rawAmount;
                const cleanDate = row.date.replace('\n', ' ');
                csvContent += `"${cleanDate}","${row.id}","${cleanTitle}","${cleanClient}","${row.licensePlate}","${row.color}","${finalAmount}"\n`;
            });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Laporan_${activeTab}_AmanahMobilindo_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // PERBAIKAN: Fungsi confirm() dan alert() sukses dihapus agar langsung terhubung mulus dengan modal buatanmu
    const handleDelete = async (id: string, type: 'pembelian' | 'penjualan') => {
        try {
            if (type === 'penjualan') {
                const saleData = await transactionModel.getSaleById(id);
                if (saleData) {
                    await transactionModel.updatePurchaseStatus(saleData.purchase_id, false);
                }
            }

            await transactionModel.deleteRecord(type === 'pembelian' ? 'purchases' : 'sales', id);
            setTransactions(transactions.filter(t => t.dbId !== id));
            await fetchStats();
        } catch (error: any) {
            alert("Gagal menghapus data: " + error.message);
        }
    };

    return {
        activeTab, setActiveTab,
        transactions: filteredAndSortedTransactions,
        isLoading, openDropdown, setOpenDropdown,
        stats, handleDelete,
        sortOrder, setSortOrder,
        startDate, setStartDate,
        endDate, setEndDate,
        handleApplyFilter,
        handleResetFilter, 
        handleDownloadExcel
    };
}