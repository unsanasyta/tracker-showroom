// File: app/admin/transactions/edit/[type]/[id]/useTransactionController.ts
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { transactionModel } from './transactionModel';

export function useTransactionController() {
    const router = useRouter(); const params = useParams();
    const transactionType = params.type as string; const transactionId = params.id as string;
    const [isLoading, setIsLoading] = useState(false); const [isFetching, setIsFetching] = useState(true);

    const [existingFiles, setExistingFiles] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setNewFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    };

    const removeExistingFile = async (indexToRemove: number) => {
        const urlToRemove = existingFiles[indexToRemove];
        try {
            await transactionModel.deleteFile(urlToRemove);
            setExistingFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        } catch (e) { console.error("Gagal menghapus file", e); }
    };

    const removeNewFile = (indexToRemove: number) => { setNewFiles(prev => prev.filter((_, index) => index !== indexToRemove)); };

    // PERBAIKAN: Tambah field created_at pada State
    const [purchaseForm, setPurchaseForm] = useState({ created_at: '', source_name: '', purchase_price: '', car_brand: '', car_year: '', car_color: '', license_plate: '', paint_cost: '', engine_cost: '', parts_cost: '', tax_cost: '', additional_notes: '' });
    const [availableCars, setAvailableCars] = useState<any[]>([]);
    const [saleForm, setSaleForm] = useState({ created_at: '', purchase_id: '', buyer_name: '', broker_name: '', sell_price: '', sale_notes: '' });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (transactionType === 'pembelian') {
                    const data = await transactionModel.getPurchaseById(transactionId);
                    setPurchaseForm({ 
                        // Ambil hanya bagian tanggal (YYYY-MM-DD) dari format ISO timestamp Supabase
                        created_at: data.created_at ? data.created_at.split('T')[0] : '', 
                        source_name: data.source_name || '', purchase_price: data.purchase_price?.toString() || '', car_brand: data.car_brand || '', car_year: data.car_year?.toString() || '', car_color: data.car_color || '', license_plate: data.license_plate || '', paint_cost: data.paint_cost?.toString() || '', engine_cost: data.engine_cost?.toString() || '', parts_cost: data.parts_cost?.toString() || '', tax_cost: data.tax_cost?.toString() || '', additional_notes: data.additional_notes || '' 
                    });
                    if (data.document_urls && Array.isArray(data.document_urls)) setExistingFiles(data.document_urls);
                } else if (transactionType === 'penjualan') {
                    const cars = await transactionModel.getAvailableCars(); setAvailableCars(cars);
                    const saleData = await transactionModel.getSaleById(transactionId);
                    // Ambil opsi mobil yang sudah terjual ini untuk dimasukkan kembali ke dropdown (agar tidak hilang)
                    if (saleData.purchase_id && !cars.some((c:any) => c.id === saleData.purchase_id)) {
                         const currentCar = await transactionModel.getPurchaseById(saleData.purchase_id);
                         setAvailableCars(prev => [...prev, currentCar]);
                    }
                    
                    setSaleForm({ 
                        created_at: saleData.created_at ? saleData.created_at.split('T')[0] : '', 
                        purchase_id: saleData.purchase_id || '', buyer_name: saleData.buyer_name || '', broker_name: saleData.broker_name || '', sell_price: saleData.sell_price?.toString() || '', sale_notes: saleData.sale_notes || '' 
                    });
                }
            } catch (error: any) { console.error("Gagal menarik data", error); } finally { setIsFetching(false); }
        };
        fetchInitialData();
    }, [transactionId, transactionType]);

    const handlePurchaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setPurchaseForm(prev => ({ ...prev, [name]: value })); };
    const handleSaleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setSaleForm(prev => ({ ...prev, [name]: value })); };
    const calculateTotalService = () => (parseFloat(purchaseForm.paint_cost) || 0) + (parseFloat(purchaseForm.engine_cost) || 0) + (parseFloat(purchaseForm.parts_cost) || 0);
    const calculateHargaJadi = () => (parseFloat(purchaseForm.purchase_price) || 0) + (parseFloat(purchaseForm.tax_cost) || 0) + calculateTotalService();
    const calculateNetProfit = () => { if (!saleForm.purchase_id) return 0; const selectedCar = availableCars.find(car => car.id === saleForm.purchase_id); if (!selectedCar) return 0; return (parseFloat(saleForm.sell_price) || 0) - Number(selectedCar.total_acquisition_cost); };

    const handleUpdateTransaction = async () => {
        setIsLoading(true);
        try {
            // Ambil waktu saat ini untuk ditempel di belakang tanggal (HH:MM:SS)
            const currentTime = new Date().toISOString().split('T')[1];

            if (transactionType === 'pembelian') {
                const newlyUploadedUrls: string[] = [];
                if (newFiles.length > 0) { for (const file of newFiles) { newlyUploadedUrls.push(await transactionModel.uploadFile(file)); } }
                const finalDocumentUrls = [...existingFiles, ...newlyUploadedUrls];
                
                await transactionModel.updatePurchase(transactionId, { 
                    ...purchaseForm, 
                    created_at: purchaseForm.created_at ? `${purchaseForm.created_at}T${currentTime}` : undefined,
                    purchase_price: parseFloat(purchaseForm.purchase_price) || 0, car_year: parseInt(purchaseForm.car_year) || 0, paint_cost: parseFloat(purchaseForm.paint_cost) || 0, engine_cost: parseFloat(purchaseForm.engine_cost) || 0, parts_cost: parseFloat(purchaseForm.parts_cost) || 0, tax_cost: parseFloat(purchaseForm.tax_cost) || 0, total_service_cost: calculateTotalService(), total_acquisition_cost: calculateHargaJadi(), document_urls: finalDocumentUrls 
                });
            } else {
                await transactionModel.updateSale(transactionId, { 
                    ...saleForm, 
                    created_at: saleForm.created_at ? `${saleForm.created_at}T${currentTime}` : undefined,
                    sell_price: parseFloat(saleForm.sell_price) || 0, net_profit: calculateNetProfit() 
                });
            }
            alert("Perubahan berhasil disimpan!"); router.push('/admin/transactions');
        } catch (error: any) { alert("Gagal update data: " + error.message); } finally { setIsLoading(false); }
    };

    return { transactionType, isFetching, isLoading, purchaseForm, handlePurchaseChange, calculateHargaJadi, calculateTotalService, saleForm, handleSaleChange, availableCars, calculateNetProfit, handleUpdateTransaction, existingFiles, newFiles, handleFileChange, removeExistingFile, removeNewFile };
}