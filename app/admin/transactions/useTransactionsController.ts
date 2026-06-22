import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
    coverUrl: string | null;
    status: 'Tersedia' | 'Terjual'; // BARU: Status Mobil
}

export function useTransactionsController() {
    const searchParams = useSearchParams();
    const globalSearchQuery = searchParams.get('search')?.toLowerCase() || '';

    const [activeTab, setActiveTab] = useState<'pembelian' | 'penjualan'>('pembelian');
    const [transactions, setTransactions] = useState<TransactionUI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    
    // STATES FILTER
    const [sortOrder, setSortOrder] = useState<'newest' | 'asc' | 'desc'>('newest');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Tersedia' | 'Terjual'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // STATES APPLIED FILTER (diterapkan setelah klik tombol Filter)
    const [appliedStatusFilter, setAppliedStatusFilter] = useState<'all' | 'Tersedia' | 'Terjual'>('all');
    const [appliedStartDate, setAppliedStartDate] = useState('');
    const [appliedEndDate, setAppliedEndDate] = useState('');

    // STATE PAGINATION (Halaman)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [stats, setStats] = useState({ pemasukan: 0, pengeluaran: 0, keuntungan: 0 });

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()},\n${date.getFullYear()}`;
    };

    const fetchStats = async () => {
        try {
            const purchases = await transactionModel.getPurchasesForStats();
            const sales = await transactionModel.getSalesForStats();
            setStats({
                pemasukan: sales.reduce((sum, item) => sum + Number(item.sell_price), 0),
                pengeluaran: purchases.reduce((sum, item) => sum + Number(item.total_acquisition_cost), 0),
                keuntungan: sales.reduce((sum, item) => sum + Number(item.net_profit), 0)
            });
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchStats(); }, []);

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
                        amountColor: 'text-[#1B263B]',
                        coverUrl: item.document_urls && item.document_urls.length > 0 ? item.document_urls[0] : null,
                        status: item.is_sold ? 'Terjual' : 'Tersedia' // Logika Status
                    }));
                    setTransactions(formattedData);
                } else {
                    const data = await transactionModel.getSalesList();
                    const formattedData: TransactionUI[] = data.map((item: any) => {
                        const netProfit = Number(item.net_profit);
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
                            amountColor: netProfit >= 0 ? 'text-green-600' : 'text-red-600',
                            amount: netProfit >= 0 ? `+Rp ${netProfit.toLocaleString('id-ID')}` : `-Rp ${Math.abs(netProfit).toLocaleString('id-ID')}`,
                            coverUrl: item.purchases?.document_urls && item.purchases.document_urls.length > 0 ? item.purchases.document_urls[0] : null,
                            status: 'Terjual' // Penjualan otomatis Terjual
                        };
                    });
                    setTransactions(formattedData);
                }
            } catch (error) { console.error(error); } finally { setIsLoading(false); }
        };
        fetchTransactions();
    }, [activeTab]);

    // Reset halaman ke-1 jika tab diubah atau melakukan search global
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, globalSearchQuery]);

    const handleApplyFilter = () => { 
        setAppliedStartDate(startDate); 
        setAppliedEndDate(endDate); 
        setAppliedStatusFilter(statusFilter);
        setCurrentPage(1); // Kembali ke halaman 1 saat difilter
    };

    const handleResetFilter = () => { 
        setStartDate(''); setEndDate(''); 
        setAppliedStartDate(''); setAppliedEndDate(''); 
        setSortOrder('newest'); 
        setStatusFilter('all'); setAppliedStatusFilter('all');
        setCurrentPage(1);
    };

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];
        if (globalSearchQuery) {
            result = result.filter(t => 
                t.title.toLowerCase().includes(globalSearchQuery) || t.licensePlate.toLowerCase().includes(globalSearchQuery) || 
                t.color.toLowerCase().includes(globalSearchQuery) || t.client.toLowerCase().includes(globalSearchQuery) || t.id.toLowerCase().includes(globalSearchQuery)
            );
        }
        
        // Filter Status
        if (appliedStatusFilter !== 'all') {
            result = result.filter(t => t.status === appliedStatusFilter);
        }

        if (appliedStartDate) { const start = new Date(appliedStartDate); start.setHours(0,0,0,0); result = result.filter(t => new Date(t.rawDate) >= start); }
        if (appliedEndDate) { const end = new Date(appliedEndDate); end.setHours(23,59,59,999); result = result.filter(t => new Date(t.rawDate) <= end); }

        if (sortOrder === 'asc') result.sort((a, b) => a.carBrand.localeCompare(b.carBrand));
        else if (sortOrder === 'desc') result.sort((a, b) => b.carBrand.localeCompare(a.carBrand));
        else result.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

        return result;
    }, [transactions, sortOrder, appliedStartDate, appliedEndDate, appliedStatusFilter, globalSearchQuery]);

    // Logika Pemotongan Halaman (Pagination)
    const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredAndSortedTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDownloadExcel = () => { /* Logic is unchanged */ };

    const handleDelete = async (id: string, type: 'pembelian' | 'penjualan') => {
        try {
            if (type === 'penjualan') {
                const saleData = await transactionModel.getSaleById(id);
                if (saleData) await transactionModel.updatePurchaseStatus(saleData.purchase_id, false);
            }
            await transactionModel.deleteRecord(type === 'pembelian' ? 'purchases' : 'sales', id);
            setTransactions(transactions.filter(t => t.dbId !== id));
            await fetchStats();
        } catch (error: any) { alert("Gagal menghapus: " + error.message); }
    };

    return { 
        activeTab, setActiveTab, 
        transactions: paginatedTransactions, // Return data yang sudah dipotong per halaman
        totalTransactions: filteredAndSortedTransactions.length,
        currentPage, setCurrentPage, totalPages, // Export fungsi Pagination
        isLoading, openDropdown, setOpenDropdown, stats, handleDelete, sortOrder, setSortOrder, 
        statusFilter, setStatusFilter, // Export status filter
        startDate, setStartDate, endDate, setEndDate, handleApplyFilter, handleResetFilter, handleDownloadExcel 
    };
}