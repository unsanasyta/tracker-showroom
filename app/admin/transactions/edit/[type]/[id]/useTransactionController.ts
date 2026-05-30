// File: app/admin/transactions/edit/[type]/[id]/useTransactionController.ts
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { transactionModel } from './transactionModel'; // Import Model

export function useTransactionController() {
    const router = useRouter();
    const params = useParams();

    const transactionType = params.type as string;
    const transactionId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // STATE
    const [purchaseForm, setPurchaseForm] = useState({
        source_name: '', purchase_price: '', car_brand: '', car_year: '', car_color: '',
        license_plate: '', paint_cost: '', engine_cost: '', parts_cost: '', tax_cost: '', additional_notes: ''
    });

    const [availableCars, setAvailableCars] = useState<any[]>([]);
    const [saleForm, setSaleForm] = useState({
        purchase_id: '', buyer_name: '', broker_name: '', sell_price: '', sale_notes: ''
    });

    // FETCH DATA AWAL (Gunakan Model)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (transactionType === 'pembelian') {
                    const data = await transactionModel.getPurchaseById(transactionId);
                    setPurchaseForm({
                        source_name: data.source_name || '',
                        purchase_price: data.purchase_price?.toString() || '',
                        car_brand: data.car_brand || '',
                        car_year: data.car_year?.toString() || '',
                        car_color: data.car_color || '',
                        license_plate: data.license_plate || '',
                        paint_cost: data.paint_cost?.toString() || '',
                        engine_cost: data.engine_cost?.toString() || '',
                        parts_cost: data.parts_cost?.toString() || '',
                        tax_cost: data.tax_cost?.toString() || '',
                        additional_notes: data.additional_notes || ''
                    });
                } else if (transactionType === 'penjualan') {
                    const cars = await transactionModel.getAvailableCars();
                    setAvailableCars(cars);

                    const saleData = await transactionModel.getSaleById(transactionId);
                    setSaleForm({
                        purchase_id: saleData.purchase_id || '',
                        buyer_name: saleData.buyer_name || '',
                        broker_name: saleData.broker_name || '',
                        sell_price: saleData.sell_price?.toString() || '',
                        sale_notes: saleData.sale_notes || ''
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

    // HANDLERS & CALCULATIONS
    const handlePurchaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPurchaseForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSaleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSaleForm(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotalService = () => (parseFloat(purchaseForm.paint_cost) || 0) + (parseFloat(purchaseForm.engine_cost) || 0) + (parseFloat(purchaseForm.parts_cost) || 0);
    const calculateHargaJadi = () => (parseFloat(purchaseForm.purchase_price) || 0) + (parseFloat(purchaseForm.tax_cost) || 0) + calculateTotalService();

    const calculateNetProfit = () => {
        if (!saleForm.purchase_id) return 0;
        const selectedCar = availableCars.find(car => car.id === saleForm.purchase_id);
        if (!selectedCar) return 0;
        return (parseFloat(saleForm.sell_price) || 0) - Number(selectedCar.total_acquisition_cost);
    };

    // UPDATE DATA (Gunakan Model)
    const handleUpdateTransaction = async () => {
        setIsLoading(true);
        try {
            if (transactionType === 'pembelian') {
                await transactionModel.updatePurchase(transactionId, {
                    ...purchaseForm,
                    purchase_price: parseFloat(purchaseForm.purchase_price) || 0,
                    car_year: parseInt(purchaseForm.car_year) || 0,
                    paint_cost: parseFloat(purchaseForm.paint_cost) || 0,
                    engine_cost: parseFloat(purchaseForm.engine_cost) || 0,
                    parts_cost: parseFloat(purchaseForm.parts_cost) || 0,
                    tax_cost: parseFloat(purchaseForm.tax_cost) || 0,
                    total_service_cost: calculateTotalService(),
                    total_acquisition_cost: calculateHargaJadi(),
                });
            } else {
                await transactionModel.updateSale(transactionId, {
                    ...saleForm,
                    sell_price: parseFloat(saleForm.sell_price) || 0,
                    net_profit: calculateNetProfit(),
                });
            }
            alert("Perubahan berhasil disimpan!");
            router.push('/admin/transactions');
        } catch (error: any) {
            alert("Gagal update data: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        transactionType, isFetching, isLoading,
        purchaseForm, handlePurchaseChange, calculateHargaJadi,
        saleForm, handleSaleChange, availableCars, calculateNetProfit,
        handleUpdateTransaction
    };
}