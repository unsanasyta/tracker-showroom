// File: app/admin/transactions/edit/[type]/[id]/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, UploadCloud, X, ExternalLink } from 'lucide-react';
import { useTransactionController } from './useTransactionController'; 

export default function EditTransactionPage() {
    const {
        transactionType, isFetching, isLoading,
        purchaseForm, handlePurchaseChange, calculateHargaJadi, calculateTotalService,
        saleForm, handleSaleChange, availableCars, calculateNetProfit,
        handleUpdateTransaction,
        existingFiles, newFiles, handleFileChange, removeExistingFile, removeNewFile
    } = useTransactionController();

    if (isFetching) {
        return <div className="p-10 text-center font-bold text-gray-500">Memuat data untuk diedit...</div>;
    }

    return (
        <div className="flex flex-col gap-6 pb-10">
            {/* Breadcrumb & Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Link href="/admin/transactions" className="hover:text-[#1B263B] transition-colors">Transaksi</Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-[#1B263B]">Edit Transaksi</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1B263B]">
                    Edit Transaksi {transactionType === 'pembelian' ? 'Pembelian' : 'Penjualan'}
                </h2>
            </div>

            {/* TOP BAR */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <p className="text-sm text-gray-500 max-w-lg">
                    Ubah detail informasi transaksi di bawah ini. Pastikan Anda menyimpan perubahan yang dilakukan.
                </p>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href="/admin/transactions" className="flex-1 md:flex-none text-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        Batal
                    </Link>
                    <button
                        onClick={handleUpdateTransaction}
                        disabled={isLoading}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B263B] text-white rounded-lg text-sm font-bold hover:bg-[#0F172A] transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? "Menyimpan..." : <><CheckCircle2 size={18} /> Simpan Perubahan</>}
                    </button>
                </div>
            </div>

            {/* FORM AREA */}
            {transactionType === 'pembelian' ? (
                // FORM EDIT PEMBELIAN
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* KIRI: Identitas Mobil */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Identitas Mobil</h3>
                            <div className="grid grid-cols-2 gap-5">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Sumber</label><input type="text" name="source_name" value={purchaseForm.source_name} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Beli</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="number" name="purchase_price" value={purchaseForm.purchase_price} onChange={handlePurchaseChange} className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Merk Mobil</label><input type="text" name="car_brand" value={purchaseForm.car_brand} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Tahun</label><input type="number" name="car_year" value={purchaseForm.car_year} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Warna</label><input type="text" name="car_color" value={purchaseForm.car_color} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">No Polisi</label><input type="text" name="license_plate" value={purchaseForm.license_plate} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 uppercase" /></div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Harga Jadi */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jadi</label>
                                <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-[#EEF4FF]"><span className="px-3 text-sm font-bold text-[#1B263B] border-r border-blue-200">Rp</span><input type="text" disabled value={calculateHargaJadi().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-[#1B263B] outline-none bg-transparent cursor-not-allowed" /></div>
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Deskripsi Tambahan</label>
                                <textarea name="additional_notes" value={purchaseForm.additional_notes} onChange={handlePurchaseChange} className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] bg-gray-50/50 resize-none min-h-[100px]"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* KIRI: Pengeluaran & Service */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Pengeluaran & Service</h3>
                            <div className="flex flex-col gap-4">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Cat</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="number" name="paint_cost" value={purchaseForm.paint_cost} onChange={handlePurchaseChange} className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Mesin</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="number" name="engine_cost" value={purchaseForm.engine_cost} onChange={handlePurchaseChange} className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Onderdil</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="number" name="parts_cost" value={purchaseForm.parts_cost} onChange={handlePurchaseChange} className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Pajak</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="number" name="tax_cost" value={purchaseForm.tax_cost} onChange={handlePurchaseChange} className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div className="pt-4 mt-2 border-t border-gray-100"><label className="block text-xs font-bold text-[#1B263B] mb-1.5">Total Pengeluaran Service</label><div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-100"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="text" disabled value={calculateTotalService().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-gray-600 outline-none bg-transparent cursor-not-allowed" /></div></div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Dokumentasi */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-4 border-b pb-3">Dokumentasi</h3>
                            
                            {/* Area Upload Baru */}
                            <div className="flex flex-col mb-4">
                                <input type="file" id="edit-file-upload" multiple onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png"/>
                                <label htmlFor="edit-file-upload" className="border-2 border-dashed border-gray-300 bg-[#F8FAFC] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#415A77] transition-colors cursor-pointer">
                                    <div className="w-10 h-10 bg-[#D6E4F8] rounded-full flex items-center justify-center text-[#415A77] mb-2"><UploadCloud size={20} /></div>
                                    <h4 className="text-sm font-bold text-[#1B263B]">Tambah File</h4>
                                    <p className="text-[11px] text-gray-500 mt-1">PDF, JPG, PNG</p>
                                </label>
                            </div>

                            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
                                {/* Menampilkan File Lama dari Database */}
                                {existingFiles.length > 0 && (
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">File Tersimpan ({existingFiles.length})</p>
                                        <div className="flex flex-col gap-2">
                                            {existingFiles.map((url, index) => {
                                                const fileName = url.split('/').pop() || `Document ${index + 1}`;
                                                return (
                                                    <div key={`existing-${index}`} className="flex items-center justify-between p-2 bg-blue-50/50 border border-blue-100 rounded-lg">
                                                        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden hover:opacity-80">
                                                            <ExternalLink size={14} className="text-blue-600 shrink-0" />
                                                            <span className="text-xs text-blue-700 font-medium truncate">{fileName}</span>
                                                        </a>
                                                        <button onClick={() => removeExistingFile(index)} className="text-gray-400 hover:text-red-500 ml-2 shrink-0"><X size={16} /></button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Menampilkan File Baru yang Mau Diupload */}
                                {newFiles.length > 0 && (
                                    <div className={existingFiles.length > 0 ? "pt-3 border-t border-gray-100" : ""}>
                                        <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-2">File Baru Siap Upload ({newFiles.length})</p>
                                        <div className="flex flex-col gap-2">
                                            {newFiles.map((file, index) => (
                                                <div key={`new-${index}`} className="flex items-center justify-between p-2 bg-green-50/50 border border-green-100 rounded-lg">
                                                    <span className="text-xs text-green-700 font-medium truncate pr-2">{file.name}</span>
                                                    <button onClick={() => removeNewFile(index)} className="text-gray-400 hover:text-red-500 shrink-0"><X size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {existingFiles.length === 0 && newFiles.length === 0 && (
                                    <div className="text-center text-xs text-gray-400 py-4 italic border border-transparent">
                                        Belum ada dokumen pendukung.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // FORM EDIT PENJUALAN
                <div className="flex flex-col gap-6 w-full">
                    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm w-full">
                        <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Informasi Penjualan</h3>
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Mobil</label>
                                <select name="purchase_id" value={saleForm.purchase_id} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50 text-gray-600 outline-none focus:border-[#415A77]">
                                    <option value="">Pilih Mobil...</option>
                                    {availableCars.map((car) => (
                                        <option key={car.id} value={car.id}>{car.car_brand} ({car.car_year})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Pembeli</label><input type="text" name="buyer_name" value={saleForm.buyer_name} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50 outline-none focus:border-[#415A77]" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Makelar</label><input type="text" name="broker_name" value={saleForm.broker_name} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50 outline-none focus:border-[#415A77]" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-5 pt-2">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jual</label><div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77]"><span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span><input type="number" name="sell_price" value={saleForm.sell_price} onChange={handleSaleChange} className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" /></div></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Keuntungan Bersih</label><div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-[#EEF4FF]"><span className="px-3 text-sm font-bold text-[#1B263B] border-r border-blue-200">Rp</span><input type="text" disabled value={calculateNetProfit().toLocaleString("id-ID")} className="w-full px-3 py-2.5 text-sm font-bold text-[#1B263B] outline-none bg-transparent cursor-not-allowed" /></div></div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Catatan Penjualan</label><textarea name="sale_notes" value={saleForm.sale_notes} onChange={handleSaleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50 resize-none outline-none focus:border-[#415A77]"></textarea></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}