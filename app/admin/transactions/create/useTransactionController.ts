import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { transactionModel } from './transactionModel';

export function useTransactionController() {
    const router = useRouter();
    const [transactionType, setTransactionType] = useState<'pembelian' | 'penjualan'>('pembelian');
    const [isLoading, setIsLoading] = useState(false);

    // --- STATE FILE UPLOAD ---
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Gabungkan file yang baru dipilih dengan file yang sudah ada
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- STATE PEMBELIAN ---
    const [purchaseForm, setPurchaseForm] = useState({
        source_name: '', purchase_price: '', car_brand: '', car_year: '', car_color: '',
        license_plate: '', paint_cost: '', engine_cost: '', parts_cost: '', tax_cost: '', additional_notes: ''
    });

    const handlePurchaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPurchaseForm(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotalService = () => (parseFloat(purchaseForm.paint_cost) || 0) + (parseFloat(purchaseForm.engine_cost) || 0) + (parseFloat(purchaseForm.parts_cost) || 0);
    const calculateHargaJadi = () => (parseFloat(purchaseForm.purchase_price) || 0) + (parseFloat(purchaseForm.tax_cost) || 0) + calculateTotalService();

    // --- STATE PENJUALAN ---
    const [availableCars, setAvailableCars] = useState<any[]>([]);
    const [saleForm, setSaleForm] = useState({
        purchase_id: '', buyer_name: '', broker_name: '', sell_price: '', sale_notes: ''
    });

    useEffect(() => {
        const fetchCars = async () => {
            if (transactionType === 'penjualan') {
                try {
                    const cars = await transactionModel.getAvailableCars();
                    setAvailableCars(cars);
                } catch (error) {
                    console.error("Gagal menarik data mobil:", error);
                }
            }
        };
        fetchCars();
    }, [transactionType]);

    const handleSaleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSaleForm(prev => ({ ...prev, [name]: value }));
    };

    const calculateNetProfit = () => {
        if (!saleForm.purchase_id) return 0;
        const selectedCar = availableCars.find(car => car.id === saleForm.purchase_id);
        if (!selectedCar) return 0;
        return (parseFloat(saleForm.sell_price) || 0) - Number(selectedCar.total_acquisition_cost);
    };

    // --- FUNGSI SAVE TRANSAKSI ---
    const handleSaveTransaction = async () => {
        setIsLoading(true);

        try {
            if (transactionType === 'pembelian') {
                // 1. Upload semua file terlebih dahulu
                const uploadedUrls: string[] = [];
                if (selectedFiles.length > 0) {
                    for (const file of selectedFiles) {
                        const url = await transactionModel.uploadFile(file);
                        uploadedUrls.push(url);
                    }
                }

                // 2. Simpan data ke database beserta URL-nya
                await transactionModel.createPurchase({
                    source_name: purchaseForm.source_name,
                    purchase_price: parseFloat(purchaseForm.purchase_price) || 0,
                    car_brand: purchaseForm.car_brand,
                    car_year: parseInt(purchaseForm.car_year) || 0,
                    car_color: purchaseForm.car_color,
                    license_plate: purchaseForm.license_plate,
                    paint_cost: parseFloat(purchaseForm.paint_cost) || 0,
                    engine_cost: parseFloat(purchaseForm.engine_cost) || 0,
                    parts_cost: parseFloat(purchaseForm.parts_cost) || 0,
                    tax_cost: parseFloat(purchaseForm.tax_cost) || 0,
                    total_service_cost: calculateTotalService(),
                    total_acquisition_cost: calculateHargaJadi(),
                    additional_notes: purchaseForm.additional_notes,
                    document_urls: uploadedUrls // Simpan array URL ke kolom baru
                });
                alert("Data Pembelian berhasil disimpan!");
                router.push('/admin/transactions');

            } else if (transactionType === 'penjualan') {
                if (!saleForm.purchase_id || !saleForm.buyer_name || !saleForm.sell_price) {
                    alert("Harap pilih mobil, isi nama pembeli, dan harga jual!");
                    setIsLoading(false);
                    return;
                }

                await transactionModel.createSale({
                    purchase_id: saleForm.purchase_id,
                    buyer_name: saleForm.buyer_name,
                    broker_name: saleForm.broker_name,
                    sell_price: parseFloat(saleForm.sell_price) || 0,
                    net_profit: calculateNetProfit(),
                    sale_notes: saleForm.sale_notes
                });

                await transactionModel.updateCarStatusToSold(saleForm.purchase_id);

                alert("Data Penjualan berhasil disimpan!");
                router.push('/admin/transactions');
            }
        } catch (error: any) {
            alert("Gagal menyimpan data: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        transactionType, setTransactionType, isLoading,
        purchaseForm, handlePurchaseChange, calculateHargaJadi, calculateTotalService,
        saleForm, handleSaleChange, availableCars, calculateNetProfit,
        handleSaveTransaction,
        selectedFiles, handleFileChange, removeFile // Export fungsi file
    };
}