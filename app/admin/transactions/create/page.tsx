"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, UploadCloud, CheckCircle2, X } from 'lucide-react';
import { useTransactionController } from './useTransactionController';

export default function CreateTransactionPage() {
    const {
        transactionType, setTransactionType, isLoading,
        purchaseForm, handlePurchaseChange, calculateHargaJadi, calculateTotalService,
        saleForm, handleSaleChange, availableCars, calculateNetProfit,
        handleSaveTransaction,
        selectedFiles, handleFileChange, removeFile
    } = useTransactionController();

    const [carSearch, setCarSearch] = useState("");
    const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
    const carDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (carDropdownRef.current && !carDropdownRef.current.contains(event.target as Node)) {
                setIsCarDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCars = availableCars.filter(car =>
        `${car.car_brand} ${car.car_year} ${car.license_plate}`.toLowerCase().includes(carSearch.toLowerCase())
    );

    const formatCurrency = (val: string | number) => {
        if (!val) return '';
        const rawNumber = val.toString().replace(/[^0-9]/g, '');
        return rawNumber ? parseInt(rawNumber, 10).toLocaleString('id-ID') : '';
    };

    const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>, handler: any) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        handler({ target: { name: e.target.name, value: rawValue } });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveTransaction(); }} className="flex flex-col gap-6 pb-10">
            <div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2">
                    <Link href="/admin/transactions" className="hover:text-[#1B263B] transition-colors">Transaksi</Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-[#1B263B]">Tambah Transaksi Baru</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#1B263B]">Tambah Transaksi Baru</h2>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                <div className="w-full md:w-[400px]">
                    <label className="block text-xs md:text-sm font-semibold text-gray-600 mb-2 md:mb-3">Pilih Jenis Transaksi</label>
                    <div className="flex p-1 bg-gray-50 border border-gray-200 rounded-lg w-full">
                        <button type="button" onClick={() => setTransactionType('pembelian')} className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all ${transactionType === 'pembelian' ? 'bg-[#D6E4F8] text-[#1B263B] shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>Pembelian Mobil</button>
                        <button type="button" onClick={() => setTransactionType('penjualan')} className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all ${transactionType === 'penjualan' ? 'bg-[#D6E4F8] text-[#1B263B] shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>Penjualan Mobil</button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <Link href="/admin/transactions" className="w-full sm:w-auto text-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">Batal</Link>
                    <button type="submit" disabled={isLoading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B263B] text-white rounded-lg text-sm font-bold hover:bg-[#0F172A] transition-colors shadow-sm disabled:opacity-50">
                        {isLoading ? "Menyimpan..." : <><CheckCircle2 size={18} /> Simpan</>}
                    </button>
                </div>
            </div>

            {transactionType === 'pembelian' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-base md:text-lg font-bold text-[#1B263B] mb-4 md:mb-5 border-b pb-3">Identitas Mobil</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                {/* INPUT TANGGAL PEMBELIAN */}
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Tanggal Pembelian <span className="text-red-500">*</span></label><input required type="date" name="created_at" value={purchaseForm.created_at} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Sumber <span className="text-red-500">*</span></label><input required type="text" name="source_name" value={purchaseForm.source_name} onChange={handlePurchaseChange} placeholder="Nama pemilik..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Beli <span className="text-red-500">*</span></label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input required type="text" name="purchase_price" value={formatCurrency(purchaseForm.purchase_price)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Merk Mobil <span className="text-red-500">*</span></label><input required type="text" name="car_brand" value={purchaseForm.car_brand} onChange={handlePurchaseChange} placeholder="Contoh: Honda Civic" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Tahun <span className="text-red-500">*</span></label><input required type="number" name="car_year" value={purchaseForm.car_year} onChange={handlePurchaseChange} placeholder="Contoh: 2024" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Warna <span className="text-red-500">*</span></label><input required type="text" name="car_color" value={purchaseForm.car_color} onChange={handlePurchaseChange} placeholder="Warna..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">No Polisi <span className="text-red-500">*</span></label><input required type="text" name="license_plate" value={purchaseForm.license_plate} onChange={handlePurchaseChange} placeholder="B 1234 CD..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 uppercase" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full gap-4 md:gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jadi <span className="text-gray-400 font-normal">(Auto)</span></label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-[#EEF4FF] flex-1"><span className="px-3 text-sm font-bold text-[#1B263B] border-r border-blue-200">Rp</span><input type="text" disabled value={calculateHargaJadi().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-[#1B263B] outline-none bg-transparent cursor-not-allowed" /></div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1"><label className="block text-xs font-bold text-gray-600 mb-1.5">Deskripsi Tambahan</label><textarea name="additional_notes" value={purchaseForm.additional_notes} onChange={handlePurchaseChange} placeholder="Tambahkan catatan..." className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 resize-none min-h-[100px]"></textarea></div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-base md:text-lg font-bold text-[#1B263B] mb-4 md:mb-5 border-b pb-3">Pengeluaran & Service</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Cat</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" name="paint_cost" value={formatCurrency(purchaseForm.paint_cost)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Mesin</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" name="engine_cost" value={formatCurrency(purchaseForm.engine_cost)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Onderdil</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" name="parts_cost" value={formatCurrency(purchaseForm.parts_cost)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Pajak</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" name="tax_cost" value={formatCurrency(purchaseForm.tax_cost)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div className="col-span-1 md:col-span-2 pt-2 md:pt-4 border-t border-gray-100"><label className="block text-xs font-bold text-[#1B263B] mb-1.5">Total Pengeluaran Service</label><div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-100"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" disabled value={calculateTotalService().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-gray-600 outline-none bg-transparent cursor-not-allowed" /></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-base md:text-lg font-bold text-[#1B263B] mb-4 border-b pb-3">Galeri & Dokumen</h3>
                            <div className="flex flex-col mb-4">
                                <label className="block text-xs font-bold text-gray-600 mb-2">Unggah Foto / Dokumen <br/><span className="text-[10px] text-blue-500 font-normal mt-1 block">💡 Gambar yang paling atas (pertama) akan otomatis dijadikan Cover Utama mobil.</span></label>
                                <input type="file" id="file-upload" multiple onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp"/>
                                <label htmlFor="file-upload" className="border-2 border-dashed border-gray-300 bg-[#F8FAFC] rounded-xl p-4 md:p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-[#415A77] transition-colors cursor-pointer">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D6E4F8] rounded-full flex items-center justify-center text-[#415A77] mb-2 md:mb-3"><UploadCloud size={24} /></div>
                                    <h4 className="text-xs md:text-sm font-bold text-[#1B263B]">Tarik dan lepas file di sini</h4>
                                </label>
                            </div>
                            {selectedFiles && selectedFiles.length > 0 && (
                                <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[150px]">
                                    <p className="text-[10px] md:text-xs font-semibold text-gray-500 mb-1">File Terpilih ({selectedFiles.length}):</p>
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className={`flex items-center justify-between p-2 md:p-2.5 bg-gray-50 border rounded-lg ${index === 0 ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'}`}>
                                            <div className="flex items-center gap-2 truncate pr-2">
                                                {index === 0 && <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold shrink-0">COVER</span>}
                                                <span className="text-[10px] md:text-xs text-[#1B263B] font-medium truncate">{file.name}</span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm w-full">
                        <h3 className="text-base md:text-lg font-bold text-[#1B263B] mb-4 md:mb-5 border-b pb-3">Informasi Penjualan</h3>
                        <div className="flex flex-col gap-4 md:gap-6">
                            
                            <div className="relative" ref={carDropdownRef}>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Mobil <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={carSearch}
                                    onChange={(e) => {
                                        setCarSearch(e.target.value);
                                        setIsCarDropdownOpen(true);
                                        if (saleForm.purchase_id) handleSaleChange({ target: { name: 'purchase_id', value: '' } } as any);
                                    }}
                                    onFocus={() => setIsCarDropdownOpen(true)}
                                    placeholder="Ketik plat, merk, atau tahun mobil..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 text-[#1B263B]"
                                />
                                <input type="text" required value={saleForm.purchase_id} onChange={()=>{}} className="opacity-0 absolute h-0 w-0 pointer-events-none" tabIndex={-1} />

                                {isCarDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-xl rounded-lg max-h-60 overflow-y-auto">
                                        {filteredCars.length > 0 ? (
                                            filteredCars.map(car => (
                                                <div
                                                    key={car.id}
                                                    onClick={() => {
                                                        handleSaleChange({ target: { name: 'purchase_id', value: car.id } } as any);
                                                        setCarSearch(`${car.car_brand} (${car.car_year}) - Nopol: ${car.license_plate}`);
                                                        setIsCarDropdownOpen(false);
                                                    }}
                                                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0"
                                                >
                                                    <div className="font-bold text-[#1B263B]">{car.car_brand} ({car.car_year})</div>
                                                    <div className="text-[11px] text-gray-500 mt-0.5 uppercase">Nopol: {car.license_plate}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center italic">Mobil tidak ditemukan.</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                {/* INPUT TANGGAL PENJUALAN */}
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Tanggal Penjualan <span className="text-red-500">*</span></label><input required type="date" name="created_at" value={saleForm.created_at} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Pembeli <span className="text-red-500">*</span></label><input required type="text" name="buyer_name" value={saleForm.buyer_name} onChange={handleSaleChange} placeholder="Nama pembeli..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Makelar</label><input type="text" name="broker_name" value={saleForm.broker_name} onChange={handleSaleChange} placeholder="Makelar..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jual <span className="text-red-500">*</span></label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input required type="text" name="sell_price" value={formatCurrency(saleForm.sell_price)} onChange={(e) => handleCurrencyInput(e, handleSaleChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Keuntungan Bersih</label>
                                    <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-[#EEF4FF]"><span className="px-3 text-sm font-bold text-[#1B263B] border-r border-blue-200">Rp</span><input type="text" disabled value={calculateNetProfit().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-[#1B263B] outline-none bg-transparent cursor-not-allowed" /></div>
                                </div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Catatan Penjualan</label><textarea name="sale_notes" value={saleForm.sale_notes} onChange={handleSaleChange} rows={3} placeholder="Catatan khusus..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 resize-none"></textarea></div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}