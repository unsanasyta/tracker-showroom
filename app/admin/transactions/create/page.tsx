"use client";

import React from 'react';
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

    // ─── HELPER UNTUK FORMAT RUPIAH SAAT DIKETIK ──────────────────────────────
    // 1. Fungsi untuk menambahkan titik (1.000.000) pada tampilan input
    const formatCurrency = (val: string | number) => {
        if (!val) return '';
        // Hapus semua karakter yang bukan angka
        const rawNumber = val.toString().replace(/[^0-9]/g, '');
        // Format dengan titik ala Indonesia
        return rawNumber ? parseInt(rawNumber, 10).toLocaleString('id-ID') : '';
    };

    // 2. Fungsi interceptor onChange: menghapus titik sebelum disimpan ke state Controller
    const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>, handler: any) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        // Buat "event tiruan" untuk dikirim ke handler bawaan
        handler({ target: { name: e.target.name, value: rawValue } });
    };
    // ──────────────────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-6 pb-10">
            {/* Breadcrumb & Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Link href="/admin/transactions" className="hover:text-[#1B263B] transition-colors">Transaksi</Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-[#1B263B]">Tambah Transaksi Baru</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1B263B]">Tambah Transaksi Baru</h2>
            </div>

            {/* TOP BAR: Tipe Transaksi Selector & Action Buttons */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="w-full md:w-[400px]">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">Pilih Jenis Transaksi</label>
                    <div className="flex p-1 bg-gray-50 border border-gray-200 rounded-lg w-full">
                        <button onClick={() => setTransactionType('pembelian')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${transactionType === 'pembelian' ? 'bg-[#D6E4F8] text-[#1B263B] shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>Pembelian Mobil</button>
                        <button onClick={() => setTransactionType('penjualan')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${transactionType === 'penjualan' ? 'bg-[#D6E4F8] text-[#1B263B] shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>Penjualan Mobil</button>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href="/admin/transactions" className="flex-1 md:flex-none text-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">Batal</Link>
                    <button onClick={handleSaveTransaction} disabled={isLoading} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B263B] text-white rounded-lg text-sm font-bold hover:bg-[#0F172A] transition-colors shadow-sm disabled:opacity-50">
                        {isLoading ? "Menyimpan..." : <><CheckCircle2 size={18} /> Simpan Transaksi</>}
                    </button>
                </div>
            </div>

            {/* FORM AREA */}
            {transactionType === 'pembelian' ? (
                // LAYOUT PEMBELIAN
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* KIRI: Identitas Mobil */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Identitas Mobil</h3>
                            <div className="grid grid-cols-2 gap-5">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Sumber</label><input type="text" name="source_name" value={purchaseForm.source_name} onChange={handlePurchaseChange} placeholder="Nama pemilik sebelumnya..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Beli</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        {/* Input Harga Beli Diubah ke Format Currency */}
                                        <input 
                                            type="text" 
                                            name="purchase_price" 
                                            value={formatCurrency(purchaseForm.purchase_price)} 
                                            onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} 
                                            placeholder="0" 
                                            className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" 
                                        />
                                    </div>
                                </div>
                                
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Merk Mobil</label><input type="text" name="car_brand" value={purchaseForm.car_brand} onChange={handlePurchaseChange} placeholder="Contoh: Honda Civic RS" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Tahun</label>
                                    <input 
                                        type="number" 
                                        name="car_year" 
                                        value={purchaseForm.car_year} 
                                        onChange={handlePurchaseChange} 
                                        placeholder="Contoh: 2024" 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" 
                                    />
                                </div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Warna</label><input type="text" name="car_color" value={purchaseForm.car_color} onChange={handlePurchaseChange} placeholder="Warna kendaraan..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">No Polisi</label><input type="text" name="license_plate" value={purchaseForm.license_plate} onChange={handlePurchaseChange} placeholder="B 1234 CD..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 uppercase" /></div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Harga Jadi */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jadi <br /><span className="text-gray-400 font-normal">(Harga Beli + Total Service + Pajak)</span></label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-[#EEF4FF] flex-1"><span className="px-3 text-sm font-bold text-[#1B263B] border-r border-blue-200">Rp</span><input type="text" disabled value={calculateHargaJadi().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-[#1B263B] outline-none bg-transparent cursor-not-allowed" /></div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1"><label className="block text-xs font-bold text-gray-600 mb-1.5">Deskripsi Tambahan</label><textarea name="additional_notes" value={purchaseForm.additional_notes} onChange={handlePurchaseChange} placeholder="Tambahkan catatan pembelian..." className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 resize-none min-h-[100px]"></textarea></div>
                        </div>
                    </div>

                    {/* KIRI: Pengeluaran & Service */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Pengeluaran & Service</h3>
                            <div className="flex flex-col gap-4">
                                {/* Biaya Cat, Mesin, Onderdil, Pajak diubah ke format Currency */}
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Cat</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" name="paint_cost" value={formatCurrency(purchaseForm.paint_cost)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Mesin</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" name="engine_cost" value={formatCurrency(purchaseForm.engine_cost)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Onderdil</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" name="parts_cost" value={formatCurrency(purchaseForm.parts_cost)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Pajak</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" name="tax_cost" value={formatCurrency(purchaseForm.tax_cost)} onChange={(e) => handleCurrencyInput(e, handlePurchaseChange)} placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                
                                <div className="pt-4 mt-2 border-t border-gray-100"><label className="block text-xs font-bold text-[#1B263B] mb-1.5">Total Pengeluaran Service</label><div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-100"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" disabled value={calculateTotalService().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-gray-600 outline-none bg-transparent cursor-not-allowed" /></div></div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Dokumentasi */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-4 border-b pb-3">Dokumentasi</h3>
                            
                            {/* Area Upload */}
                            <div className="flex flex-col mb-4">
                                <label className="block text-xs font-bold text-gray-600 mb-2">Unggah Dokumen Pendukung</label>
                                
                                <input 
                                    type="file" 
                                    id="file-upload" 
                                    multiple 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                
                                <label 
                                    htmlFor="file-upload" 
                                    className="border-2 border-dashed border-gray-300 bg-[#F8FAFC] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#415A77] transition-colors cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-[#D6E4F8] rounded-full flex items-center justify-center text-[#415A77] mb-3">
                                        <UploadCloud size={24} />
                                    </div>
                                    <h4 className="text-sm font-bold text-[#1B263B]">Tarik dan lepas file di sini</h4>
                                    <p className="text-xs text-gray-500 mt-1">atau klik (PDF, JPG, PNG)</p>
                                </label>
                            </div>

                            {/* Daftar File yang Dipilih */}
                            {selectedFiles && selectedFiles.length > 0 && (
                                <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[150px]">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">File Terpilih ({selectedFiles.length}):</p>
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                                            <span className="text-xs text-[#1B263B] font-medium truncate pr-2">
                                                {file.name}
                                            </span>
                                            <button 
                                                onClick={() => removeFile(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // LAYOUT PENJUALAN
                <div className="flex flex-col gap-6 w-full">
                    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm w-full">
                        <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Informasi Penjualan</h3>
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Mobil <span className="text-gray-400 font-normal">(Dari Inventaris)</span></label>
                                <select name="purchase_id" value={saleForm.purchase_id} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 text-gray-600">
                                    <option value="">Cari/Pilih Mobil...</option>
                                    {availableCars.map((car) => (<option key={car.id} value={car.id}>{car.car_brand} ({car.car_year}) - No Polisi: {car.license_plate}</option>))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Pembeli</label><input type="text" name="buyer_name" value={saleForm.buyer_name} onChange={handleSaleChange} placeholder="Nama lengkap pembeli..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Makelar</label><input type="text" name="broker_name" value={saleForm.broker_name} onChange={handleSaleChange} placeholder="Nama makelar (jika ada)..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-5 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jual</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        {/* Input Harga Jual Diubah ke Format Currency */}
                                        <input 
                                            type="text" 
                                            name="sell_price" 
                                            value={formatCurrency(saleForm.sell_price)} 
                                            onChange={(e) => handleCurrencyInput(e, handleSaleChange)} 
                                            placeholder="0" 
                                            className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Keuntungan Bersih <span className="text-gray-400 font-normal">(Otomatis)</span></label>
                                    <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-[#EEF4FF]"><span className="px-3 text-sm font-bold text-[#1B263B] border-r border-blue-200">Rp</span><input type="text" disabled value={calculateNetProfit().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-[#1B263B] outline-none bg-transparent cursor-not-allowed" /></div>
                                    <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Harga Jual - Harga Jadi (Acquisition Cost)</p>
                                </div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Catatan Penjualan</label><textarea name="sale_notes" value={saleForm.sale_notes} onChange={handleSaleChange} rows={3} placeholder="Tambahkan catatan khusus untuk penjualan ini..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 resize-none"></textarea></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}