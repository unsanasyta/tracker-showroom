"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    TrendingUp, TrendingDown, Wallet, Plus, Filter,
    MoreVertical, Download, Trash2, Edit2, RefreshCw
} from 'lucide-react';
import { useTransactionsController } from './useTransactionsController';
import ModalHapus from '@/app/components/ModalHapus';

export default function TransactionsPage() {
    const router = useRouter();

    const {
        activeTab, setActiveTab,
        transactions, isLoading,
        openDropdown, setOpenDropdown,
        stats, handleDelete,
        sortOrder, setSortOrder,
        startDate, setStartDate,
        endDate, setEndDate,
        handleApplyFilter,
        handleResetFilter, // Panggil fungsi reset
        handleDownloadExcel
    } = useTransactionsController();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [trxToDelete, setTrxToDelete] = useState<string | null>(null);

    const confirmDelete = () => {
        if (trxToDelete) {
            handleDelete(trxToDelete, activeTab);
        }
        setIsDeleteModalOpen(false);
        setTrxToDelete(null);
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1B263B]">Transaction Tracker</h2>
                    <p className="text-sm text-gray-500 mt-1">Memantau dan mengelola semua arus masuk dan keluar keuangan.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleDownloadExcel}
                        className="flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#1B263B] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Download size={16} /> Download Laporan
                    </button>
                    <Link href="/admin/transactions/create" className="flex items-center gap-2 bg-[#1B263B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0F172A] transition-colors shadow-sm">
                        <Plus size={16} /> Tambah Transaksi
                    </Link>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm flex items-start flex-col gap-1">
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-500">TOTAL PEMASUKAN</p>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="p-2 bg-[#EEF2F7] text-green-600 rounded-lg"><TrendingUp size={18} /></div>
                        <h3 className="text-2xl font-bold text-[#1B263B]">Rp{stats.pemasukan.toLocaleString('id-ID')}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm flex items-start flex-col gap-1">
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-500">TOTAL PENGELUARAN</p>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="p-2 bg-[#EEF2F7] text-red-600 rounded-lg"><TrendingDown size={18} /></div>
                        <h3 className="text-2xl font-bold text-[#1B263B]">Rp{stats.pengeluaran.toLocaleString('id-ID')}</h3>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-[#1B263B] via-[#0F172A] to-[#1B263B] p-4 rounded-xl border border-transparent shadow-md flex items-start flex-col gap-1 text-white">
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-[#D0D9E6]">KEUNTUNGAN</p>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="p-2 bg-[#415A77] text-white rounded-lg"><Wallet size={18} /></div>
                        <h3 className="text-2xl font-bold">Rp{stats.keuntungan.toLocaleString('id-ID')}</h3>
                    </div>
                </div>
            </div>

            {/* FILTERS (Sorting & Date Range) */}
            <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] flex flex-col md:flex-row gap-6 items-start md:items-end shadow-sm">
                
                {/* SORTING KIRI */}
                <div className="w-full md:flex-1">
                    <label className="block text-xs font-bold text-gray-600 mb-2">Urutkan Mobil</label>
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 bg-gray-50/50 outline-none focus:border-[#415A77] transition-colors"
                    >
                        <option value="newest">Tanggal (Terbaru)</option>
                        <option value="asc">Nama Mobil (A - Z)</option>
                        <option value="desc">Nama Mobil (Z - A)</option>
                    </select>
                </div>
                
                {/* DATE RANGE & TOMBOL KANAN */}
                <div className="flex flex-col md:flex-row items-start md:items-end gap-4 w-full md:w-auto">
                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-gray-600 mb-2">Rentang Tanggal</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full md:w-[180px] border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 bg-gray-50/50 outline-none focus:border-[#415A77] transition-colors" 
                            />
                            <span className="text-gray-400 font-medium">-</span>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full md:w-[180px] border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 bg-gray-50/50 outline-none focus:border-[#415A77] transition-colors" 
                            />
                        </div>
                    </div>
                    
                    {/* Area Tombol Reset & Filter */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button 
                            onClick={handleResetFilter}
                            title="Reset Filter"
                            className="flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 hover:text-gray-800 transition-colors shadow-sm"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <button 
                            onClick={handleApplyFilter}
                            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors w-full md:w-auto shadow-sm"
                        >
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col relative z-0">
                <div className="flex border-b border-gray-200">
                    <button onClick={() => setActiveTab('pembelian')} className={`flex-1 py-4 text-sm font-bold text-center transition-colors relative ${activeTab === 'pembelian' ? 'text-[#1B263B]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                        Pembelian Mobil
                        {activeTab === 'pembelian' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[3px] bg-[#1B263B] rounded-t-full"></div>}
                    </button>
                    <button onClick={() => setActiveTab('penjualan')} className={`flex-1 py-4 text-sm font-bold text-center transition-colors relative ${activeTab === 'penjualan' ? 'text-[#1B263B]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                        Penjualan Mobil
                        {activeTab === 'penjualan' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[3px] bg-[#1B263B] rounded-t-full"></div>}
                    </button>
                </div>

                <div className="overflow-x-visible min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-[11px] text-gray-500 uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Identitas Mobil</th>
                                <th className="px-6 py-4">No Polisi</th> 
                                <th className="px-6 py-4">Warna</th> 
                                <th className="px-6 py-4">Jenis Transaksi</th>
                                <th className="px-6 py-4 text-left">{activeTab === 'pembelian' ? 'Harga Jadi' : 'Keuntungan'}</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 relative">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500 text-sm font-semibold">Memuat data transaksi...</td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500 text-sm font-semibold">Belum ada transaksi {activeTab === 'pembelian' ? 'pembelian' : 'penjualan'} pada filter ini.</td>
                                </tr>
                            ) : (
                                transactions.map((trx) => (
                                    <tr 
                                        key={trx.dbId} 
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                        onClick={() => router.push(`/admin/transactions/detail/${activeTab}/${trx.dbId}`)}
                                    >
                                        <td className="px-6 py-4 text-sm text-[#1B263B] whitespace-nowrap">{trx.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{trx.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#1B263B] group-hover:text-blue-600 transition-colors">{trx.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{trx.client}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-[#1B263B] uppercase whitespace-nowrap">
                                            {trx.licensePlate}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 capitalize whitespace-nowrap">
                                            {trx.color}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center gap-1.5 text-xs font-bold ${trx.descColor}`}>
                                                {trx.descIcon} {trx.descType}
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-bold whitespace-nowrap ${trx.amountColor}`}>{trx.amount}</td>

                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdown(openDropdown === trx.dbId ? null : trx.dbId);
                                                }}
                                                className="text-gray-400 hover:text-[#1B263B] hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={20} />
                                            </button>

                                            {openDropdown === trx.dbId && (
                                                <div className="absolute right-10 top-8 w-36 bg-white border border-gray-200 shadow-lg rounded-lg z-50 py-1 overflow-hidden">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/admin/transactions/edit/${activeTab}/${trx.dbId}`);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                                                    >
                                                        <Edit2 size={16} /> Edit Data
                                                    </button>
                                                    <div className="h-px bg-gray-100 w-full"></div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdown(null); 
                                                            setTrxToDelete(trx.dbId); 
                                                            setIsDeleteModalOpen(true); 
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                                    >
                                                        <Trash2 size={16} /> Hapus Data
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalHapus 
                isOpen={isDeleteModalOpen} 
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setTrxToDelete(null); 
                }} 
                onConfirm={confirmDelete} 
            />
        </div>
    );
}