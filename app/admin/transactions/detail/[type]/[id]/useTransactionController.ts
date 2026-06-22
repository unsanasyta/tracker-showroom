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
                        acquisition_cost: res.purchases?.total_acquisition_cost,
                        document_urls: res.purchases?.document_urls // Map array galeri ke data utama
                    });
                }
            } catch (error: any) { console.error("Gagal menarik data", error); } finally { setIsFetching(false); }
        };
        fetchInitialData();
    }, [transactionId, transactionType]);

    const formatRp = (amount: number) => amount ? amount.toLocaleString('id-ID') : "0";
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };
    const formatId = (rawId: string) => rawId ? `${transactionType === 'pembelian' ? 'PUR-' : 'SAL-'}${rawId.substring(0, 6).toUpperCase()}` : "-";

    const handleDownloadPDF = () => window.print();
    const handleDownloadFile = async (url: string, fileName: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl; link.download = fileName;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            const link = document.createElement('a');
            link.href = `${url}?download=true`; link.setAttribute('download', fileName); link.target = '_blank';
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
        }
    };

    return { transactionType, transactionId, isFetching, data, formatRp, formatDate, formatId, handleDownloadPDF, handleDownloadFile };
}