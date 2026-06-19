// File: app/admin/transactions/detail/[type]/[id]/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, ArrowLeft, Printer, FileText, Download } from 'lucide-react';
import { useTransactionController } from './useTransactionController';

export default function DetailTransactionPage() {
    const {
        transactionType, isFetching, data, formatRp, formatDate, formatId,
        handleDownloadPDF, handleDownloadFile
    } = useTransactionController();

    if (isFetching) {
        return <div className="p-10 text-center font-bold text-gray-500 print:hidden">Memuat detail transaksi...</div>;
    }

    if (!data) {
        return <div className="p-10 text-center font-bold text-red-500 print:hidden">Data transaksi tidak ditemukan.</div>;
    }

    return (
        <div className="flex flex-col gap-6 pb-10 print:pb-0">
            {/* Breadcrumb & Header - print:hidden digunakan agar navigasi tidak ikut diprint/PDF */}
            <div className="print:hidden">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Link href="/admin/transactions" className="hover:text-[#1B263B] transition-colors">Transaksi</Link>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-[#1B263B]">Detail Transaksi</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1B263B]">
                    Detail {transactionType === 'pembelian' ? 'Pembelian' : 'Penjualan'} Mobil
                </h2>
            </div>

            {/* TOP BAR */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-none print:shadow-none print:p-0 print:mb-4">
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">ID Transaksi</p>
                    <p className="text-lg font-bold text-[#1B263B] font-mono">{formatId(data.id)}</p>
                    <p className="text-xs text-gray-500 mt-1">Dicatat pada: {formatDate(data.created_at)}</p>
                </div>
                {/* Area Tombol disembunyikan saat Export PDF */}
                <div className="flex items-center gap-3 print:hidden">
                    <Link href="/admin/transactions" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft size={18} /> Kembali
                    </Link>
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1B263B] text-white rounded-lg text-sm font-bold hover:bg-[#0F172A] transition-colors shadow-sm"
                    >
                        <Printer size={18} /> Download PDF
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            {transactionType === 'pembelian' ? (
                // --- LAYOUT DETAIL PEMBELIAN ---
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:flex print:flex-col print:gap-4">
                    {/* KIRI: Identitas Mobil */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full print:border-gray-200 print:shadow-none">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Identitas Mobil</h3>
                            <div className="grid grid-cols-2 gap-5">
                                <DetailItem label="Nama Sumber" value={data.source_name} />
                                <DetailItem label="Harga Beli" value={`Rp ${formatRp(data.purchase_price)}`} highlight />
                                <DetailItem label="Merk Mobil" value={data.car_brand} />
                                <DetailItem label="Tahun" value={data.car_year} />
                                <DetailItem label="Warna" value={data.car_color} />
                                <DetailItem label="No Polisi" value={data.license_plate?.toUpperCase()} />
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Harga Jadi */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full gap-5 print:border-gray-200 print:shadow-none">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Harga Jadi Total</label>
                                <div className="w-full border border-blue-200 rounded-lg px-4 py-3.5 text-lg font-bold bg-[#EEF4FF] text-[#1B263B]">
                                    Rp {formatRp(data.total_acquisition_cost)}
                                </div>
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Deskripsi Tambahan</label>
                                <div className="w-full flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-700 whitespace-pre-wrap min-h-[100px]">
                                    {data.additional_notes || <span className="text-gray-400 italic">Tidak ada catatan.</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KIRI: Pengeluaran & Service */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full print:border-gray-200 print:shadow-none print:break-inside-avoid">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Rincian Service & Pajak</h3>
                            <div className="grid grid-cols-2 gap-5">
                                <DetailItem label="Biaya Cat" value={`Rp ${formatRp(data.paint_cost)}`} />
                                <DetailItem label="Biaya Mesin" value={`Rp ${formatRp(data.engine_cost)}`} />
                                <DetailItem label="Biaya Onderdil" value={`Rp ${formatRp(data.parts_cost)}`} />
                                <DetailItem label="Biaya Pajak" value={`Rp ${formatRp(data.tax_cost)}`} />
                                <div className="col-span-2 pt-4 border-t border-gray-100">
                                    <DetailItem label="Total Pengeluaran Ekstra" value={`Rp ${formatRp(data.total_service_cost)}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Dokumentasi */}
                    <div className="lg:col-span-4 print:hidden">
                        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full">
                            <h3 className="text-lg font-bold text-[#1B263B] mb-4 border-b pb-3">Dokumen Pendukung</h3>
                            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                                {data.document_urls && data.document_urls.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {data.document_urls.map((url: string, index: number) => {
                                            const fileName = url.split('/').pop() || `Document ${index + 1}`;
                                            return (
                                                <div key={index} className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-lg group">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <FileText size={18} className="text-blue-600 shrink-0" />
                                                        <span className="text-sm text-blue-800 font-medium truncate">{fileName}</span>
                                                    </div>
                                                    
                                                    {/* Dua tombol terpisah: Lihat & Download */}
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <a 
                                                            href={url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            title="Lihat Dokumen"
                                                            className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                        <button 
                                                            onClick={() => handleDownloadFile(url, fileName)}
                                                            title="Download Dokumen"
                                                            className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center text-sm text-gray-400 py-6 italic border-2 border-dashed border-gray-100 rounded-xl">
                                        Tidak ada dokumen pendukung.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // --- LAYOUT DETAIL PENJUALAN ---
                <div className="flex flex-col gap-6 w-full print:gap-4">
                    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm w-full print:border-gray-200 print:shadow-none">
                        <h3 className="text-lg font-bold text-[#1B263B] mb-5 border-b pb-3">Informasi Penjualan</h3>
                        <div className="flex flex-col gap-6">
                            <DetailItem label="Mobil yang Dijual" value={`${data.car_brand || '-'} (${data.car_year || '-'}) — Nopol: ${data.license_plate?.toUpperCase() || '-'}`} />
                            <div className="grid grid-cols-2 gap-5">
                                <DetailItem label="Nama Pembeli" value={data.buyer_name} />
                                <DetailItem label="Nama Makelar" value={data.broker_name || '-'} />
                            </div>
                            <div className="grid grid-cols-2 gap-5 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Harga Jual Akhir</label>
                                    <div className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg font-bold bg-gray-50 text-[#1B263B]">
                                        Rp {formatRp(data.sell_price)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Keuntungan Bersih</label>
                                    <div className="w-full border border-green-200 rounded-lg px-4 py-3 text-lg font-bold bg-green-50 text-green-700 print:border-gray-300 print:bg-white print:text-black">
                                        Rp {formatRp(data.net_profit)}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Catatan Penjualan</label>
                                <div className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-700 min-h-[80px]">
                                    {data.sale_notes || <span className="text-gray-400 italic">Tidak ada catatan.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Komponen Pembantu
function DetailItem({ label, value, highlight = false }: { label: string, value: string | number | undefined, highlight?: boolean }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
            <div className={`w-full border rounded-lg px-4 py-2.5 text-sm font-semibold ${highlight ? 'bg-blue-50/50 border-blue-200 text-blue-800 print:bg-white print:border-gray-300 print:text-black' : 'bg-gray-50 border-gray-200 text-[#1B263B] print:bg-white'}`}>
                {value || '-'}
            </div>
        </div>
    );
}