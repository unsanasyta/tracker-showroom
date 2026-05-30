// File: app/admin/transactions/edit/[type]/[id]/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTransactionController } from './useTransactionController'; // Import Controller

export default function EditTransactionPage() {
    // Ambil data dan fungsi HANYA dari Controller
    const {
        transactionType, isFetching, isLoading,
        purchaseForm, handlePurchaseChange, calculateHargaJadi,
        saleForm, handleSaleChange, availableCars, calculateNetProfit,
        handleUpdateTransaction
    } = useTransactionController();

    // Jika sedang loading fetch data
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
                <div className="flex items-center gap-3">
                    <Link href="/admin/transactions" className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        Batal
                    </Link>
                    <button
                        onClick={handleUpdateTransaction}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? "Menyimpan..." : <><CheckCircle2 size={18} /> Simpan Perubahan</>}
                    </button>
                </div>
            </div>

            {/* FORM AREA */}
            {transactionType === 'pembelian' ? (
                // FORM EDIT PEMBELIAN (VIEW SAJA)
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Identitas Mobil</h3>
                            <div className="grid grid-cols-2 gap-5">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Sumber</label><input type="text" name="source_name" value={purchaseForm.source_name} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Beli</label><input type="number" name="purchase_price" value={purchaseForm.purchase_price} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Merk Mobil</label><input type="text" name="car_brand" value={purchaseForm.car_brand} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Tahun</label><input type="number" name="car_year" value={purchaseForm.car_year} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Warna</label><input type="text" name="car_color" value={purchaseForm.car_color} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">No Polisi</label><input type="text" name="license_plate" value={purchaseForm.license_plate} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50 uppercase" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jadi</label>
                                <input type="text" disabled value={`Rp ${calculateHargaJadi().toLocaleString("id-ID")}`} className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-sm font-bold bg-[#EEF4FF] cursor-not-allowed text-[#1B263B]" />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Deskripsi Tambahan</label>
                                <textarea name="additional_notes" value={purchaseForm.additional_notes} onChange={handlePurchaseChange} className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50 resize-none min-h-[100px]"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Pengeluaran & Service</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Cat</label><input type="number" name="paint_cost" value={purchaseForm.paint_cost} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Mesin</label><input type="number" name="engine_cost" value={purchaseForm.engine_cost} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Onderdil</label><input type="number" name="parts_cost" value={purchaseForm.parts_cost} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Pajak</label><input type="number" name="tax_cost" value={purchaseForm.tax_cost} onChange={handlePurchaseChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // FORM EDIT PENJUALAN (VIEW SAJA)
                <div className="flex flex-col gap-6 w-full">
                    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm w-full">
                        <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Informasi Penjualan</h3>
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Mobil</label>
                                <select name="purchase_id" value={saleForm.purchase_id} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50 text-gray-600">
                                    <option value="">Pilih Mobil...</option>
                                    {availableCars.map((car) => (
                                        <option key={car.id} value={car.id}>{car.car_brand} ({car.car_year})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Pembeli</label><input type="text" name="buyer_name" value={saleForm.buyer_name} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Makelar</label><input type="text" name="broker_name" value={saleForm.broker_name} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-5 pt-2">
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jual</label><input type="number" name="sell_price" value={saleForm.sell_price} onChange={handleSaleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50" /></div>
                                <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Keuntungan Bersih</label><input type="text" disabled value={`Rp ${calculateNetProfit().toLocaleString("id-ID")}`} className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-sm font-bold bg-[#EEF4FF] cursor-not-allowed text-[#1B263B]" /></div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-600 mb-1.5">Catatan Penjualan</label><textarea name="sale_notes" value={saleForm.sale_notes} onChange={handleSaleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50/50 resize-none"></textarea></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}