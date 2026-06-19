// File: app/admin/transactions/detail/[type]/[id]/useTransactionController.ts
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { transactionModel } from './transactionModel';

export function useTransactionController() {
    const params = useParams();

    const transactionType = params.type as string;
    const transactionId = params.id as string;

    const [isFetching, setIsFetching] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (transactionType === 'pembelian') {
                    const res = await transactionModel.getPurchaseById(transactionId);
                    setData(res);
                } else if (transactionType === 'penjualan') {
                    const res = await transactionModel.getSaleById(transactionId);
                    setData({
                        ...res,
                        car_brand: res.purchases?.car_brand,
                        car_year: res.purchases?.car_year,
                        license_plate: res.purchases?.license_plate,
                        acquisition_cost: res.purchases?.total_acquisition_cost
                    });
                }
            } catch (error: any) {
                console.error("Gagal menarik data", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchInitialData();
    }, [transactionId, transactionType]);

    // Helper untuk format Rupiah
    const formatRp = (amount: number) => {
        if (!amount) return "0";
        return amount.toLocaleString('id-ID');
    };

    // Helper untuk format Tanggal
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper untuk menyamakan format ID
    const formatId = (rawId: string) => {
        if (!rawId) return "-";
        const prefix = transactionType === 'pembelian' ? 'PUR-' : 'SAL-';
        return `${prefix}${rawId.substring(0, 6).toUpperCase()}`;
    };

    // Eksekusi Download PDF (Menggunakan Print bawaan Browser agar layout tetap cantik)
    const handleDownloadPDF = () => {
        window.print();
    };

    // Eksekusi Download Dokumen Pendukung secara individual
    const handleDownloadFile = async (url: string, fileName: string) => {
        try {
            // Coba ambil file secara langsung dan jadikan blob
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            // Fallback jika terkendala CORS oleh Supabase
            const link = document.createElement('a');
            link.href = `${url}?download=true`; // Parameter khusus Supabase untuk force download
            link.setAttribute('download', fileName);
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return {
        transactionType, transactionId, isFetching, data, formatRp, formatDate, formatId,
        handleDownloadPDF, handleDownloadFile // Export kedua fungsi baru ini
    };
}