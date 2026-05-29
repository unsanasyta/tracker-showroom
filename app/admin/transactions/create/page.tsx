"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ChevronRight,
    UploadCloud,
    CheckCircle2,
} from 'lucide-react';

export default function CreateTransactionPage() {
    const [transactionType, setTransactionType] = useState<'pembelian' | 'penjualan'>('pembelian');

    return (
        <div className="flex flex-col gap-6 pb-10">
            {/* Breadcrumb & Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Link href="/admin/transactions" className="hover:text-[#1B263B] transition-colors">
                        Transaksi
                    </Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-[#1B263B]">Tambah Transaksi Baru</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1B263B]">Tambah Transaksi Baru</h2>
            </div>

            {/* TOP BAR: Tipe Transaksi Selector & Action Buttons */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">

                {/* Kiri: Selector */}
                <div className="w-full md:w-[400px]">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">
                        Pilih Jenis Transaksi
                    </label>
                    <div className="flex p-1 bg-gray-50 border border-gray-200 rounded-lg w-full">
                        <button
                            onClick={() => setTransactionType('pembelian')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${transactionType === 'pembelian'
                                ? 'bg-[#D6E4F8] text-[#1B263B] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Pembelian Mobil
                        </button>
                        <button
                            onClick={() => setTransactionType('penjualan')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${transactionType === 'penjualan'
                                ? 'bg-[#D6E4F8] text-[#1B263B] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Penjualan Mobil
                        </button>
                    </div>
                </div>

                {/* Kanan: Action Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href="/admin/transactions" className="flex-1 md:flex-none text-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        Batal
                    </Link>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B263B] text-white rounded-lg text-sm font-bold hover:bg-[#0F172A] transition-colors shadow-sm">
                        <CheckCircle2 size={18} /> Simpan Transaksi
                    </button>
                </div>
            </div>

            {/* FORM AREA */}
            {transactionType === 'pembelian' ? (
                // LAYOUT PEMBELIAN (Grid Flat sejajar baris)
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* --- BARIS 1 --- */}
                    {/* KIRI: Identitas Mobil */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Identitas Mobil</h3>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Sumber</label>
                                    <input type="text" placeholder="Nama pemilik sebelumnya..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Beli</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77] transition-colors">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input type="text" placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Merk Mobil</label>
                                    <input type="text" placeholder="Contoh: Honda Civic RS" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Tahun</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50 text-gray-600">
                                        <option value="">Pilih tahun...</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Warna</label>
                                    <input type="text" placeholder="Warna kendaraan..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">No Polisi</label>
                                    <input type="text" placeholder="B 1234 CD..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50 uppercase" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Harga Jadi */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jadi <br /><span className="text-gray-400 font-normal">(Harga Beli + Total Service + Pajak)</span></label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-[#EEF4FF] flex-1">
                                        <span className="px-3 text-sm font-bold text-[#1B263B] border-r border-blue-200">Rp</span>
                                        <input type="text" placeholder="0" disabled className="w-full px-3 py-2.5 text-sm font-bold text-[#1B263B] outline-none bg-transparent cursor-not-allowed" />
                                    </div>
                                    <button className="flex items-center justify-center bg-[#415A77] text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-[#2D4055] transition-colors shadow-sm shrink-0">
                                        Hitung
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col flex-1">
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Deskripsi Tambahan</label>
                                <textarea
                                    placeholder="Tambahkan catatan pembelian..."
                                    className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50 resize-none min-h-[100px]"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* --- BARIS 2 --- */}
                    {/* KIRI: Pengeluaran & Service */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Pengeluaran & Service</h3>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Cat</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77] transition-colors">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input type="text" placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Mesin</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77] transition-colors">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input type="text" placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Onderdil</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77] transition-colors">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input type="text" placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Pajak</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77] transition-colors">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input type="text" placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" />
                                    </div>
                                </div>

                                {/* Penambahan Total Pengeluaran */}
                                <div className="pt-4 mt-2 border-t border-gray-100">
                                    <label className="block text-xs font-bold text-[#1B263B] mb-1.5">Total Pengeluaran Service</label>
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input type="text" placeholder="0" disabled className="w-full px-3 py-2.5 text-sm font-bold text-gray-600 outline-none bg-transparent cursor-not-allowed" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Dokumentasi */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-4 border-b pb-3">Dokumentasi</h3>
                            <div className="flex flex-col flex-1">
                                <label className="block text-xs font-bold text-gray-600 mb-2">Unggah Dokumen Pendukung</label>
                                <div className="flex-1 border-2 border-dashed border-gray-300 bg-[#F8FAFC] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#415A77] transition-colors cursor-pointer group min-h-[150px]">
                                    <div className="w-12 h-12 bg-[#D6E4F8] rounded-full flex items-center justify-center text-[#415A77] mb-3 group-hover:scale-105 transition-transform">
                                        <UploadCloud size={24} />
                                    </div>
                                    <h4 className="text-sm font-bold text-[#1B263B]">Tarik dan lepas file di sini</h4>
                                    <p className="text-xs text-gray-500 mt-1">atau klik (PDF, JPG, PNG)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                // LAYOUT PENJUALAN (Lebar Penuh)
                <div className="flex flex-col gap-6 w-full">
                    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm w-full">
                        <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Informasi Penjualan</h3>

                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Mobil <span className="text-gray-400 font-normal">(Dari Inventaris)</span></label>
                                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50 text-gray-600">
                                    <option value="">Cari/Pilih Mobil...</option>
                                    <option value="1">Porsche 911 GT3 RS (B 1234 XX)</option>
                                    <option value="2">Mercedes-Benz G63 AMG (B 999 ZZ)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Pembeli</label>
                                    <input type="text" placeholder="Nama lengkap pembeli..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Nama Makelar</label>
                                    <input type="text" placeholder="Nama makelar (jika ada)..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Harga Jual</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50/50 focus-within:border-[#415A77] transition-colors">
                                        <span className="px-3 text-sm font-bold text-gray-500 border-r border-gray-200">Rp</span>
                                        <input type="text" placeholder="0" className="w-full px-3 py-2.5 text-sm outline-none bg-transparent" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Keuntungan Bersih <span className="text-gray-400 font-normal">(Otomatis)</span></label>
                                    <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-[#EEF4FF]">
                                        <span className="px-3 text-sm font-bold text-[#1B263B] border-r border-blue-200">Rp</span>
                                        <input type="text" placeholder="0" disabled className="w-full px-3 py-2.5 text-sm font-bold text-[#1B263B] outline-none bg-transparent cursor-not-allowed" />
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Harga Jual - Harga Jadi (Acquisition Cost)</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Catatan Penjualan</label>
                                <textarea
                                    rows={3}
                                    placeholder="Tambahkan catatan khusus untuk penjualan ini..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#415A77] transition-colors bg-gray-50/50 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}