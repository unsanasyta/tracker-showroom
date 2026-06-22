"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, ArrowLeft, Printer, FileText, Download, Edit2 } from 'lucide-react';
import { useTransactionController } from './useTransactionController';

const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

export default function DetailTransactionPage() {
    const { transactionType, transactionId, isFetching, data, formatRp, formatDate, formatId, handleDownloadPDF } = useTransactionController();

    if (isFetching) return <div className="p-10 text-center font-bold text-gray-500 print:hidden">Memuat detail transaksi...</div>;
    if (!data) return <div className="p-10 text-center font-bold text-red-500 print:hidden">Data transaksi tidak ditemukan.</div>;

    // Helper untuk memformat tanggal ke gaya bahasa Indonesia yang lebih rapi tanpa jam
    const formatTanggalOnly = (isoString: string) => {
        if (!isoString) return "-";
        return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="flex flex-col gap-6 pb-10 print:pb-0 print:gap-3">
            <div className="print:hidden">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2"><Link href="/admin/transactions" className="hover:text-[#1B263B] transition-colors">Transaksi</Link><ChevronRight size={14} /><span className="font-semibold text-[#1B263B]">Detail Transaksi</span></div>
                <h2 className="text-xl md:text-2xl font-bold text-[#1B263B]">Detail {transactionType === 'pembelian' ? 'Pembelian' : 'Penjualan'} Mobil</h2>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:border-none print:shadow-none print:p-0 print:mb-2">
                <div>
                    <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-xs">ID Transaksi</p>
                    <p className="text-base md:text-lg font-bold text-[#1B263B] font-mono print:text-base">{formatId(data.id)}</p>
                    <p className="text-[11px] md:text-xs text-gray-500 mt-1">Dicatat pada sistem: {formatDate(data.created_at)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 print:hidden w-full lg:w-auto mt-2 lg:mt-0">
                    <Link href="/admin/transactions" className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"><ArrowLeft size={18} /> <span className="hidden sm:inline">Kembali</span></Link>
                    
                    {/* TOMBOL EDIT BARU */}
                    <Link href={`/admin/transactions/edit/${transactionType}/${transactionId}`} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors shadow-sm">
                        <Edit2 size={16} /> Edit
                    </Link>

                    <button onClick={handleDownloadPDF} className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 bg-[#1B263B] text-white rounded-lg text-sm font-bold hover:bg-[#0F172A] transition-colors shadow-sm"><Printer size={18} /> Download PDF</button>
                </div>
            </div>

            {/* SEKSI BARU: GALERI FOTO MOBIL (DI TAMPILKAN DI KEDUA TIPE TRANSAKSI) */}
            {data.document_urls && data.document_urls.length > 0 && (
                <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm print:hidden">
                    <h3 className="text-base md:text-lg font-bold text-[#1B263B] mb-4 border-b pb-3">Galeri & Dokumen Kendaraan</h3>
                    <div className="flex flex-col gap-4">
                        {/* Tampilkan Cover Utama Besar */}
                        {isImage(data.document_urls[0]) ? (
                            <img src={data.document_urls[0]} alt="Cover Utama" className="w-full h-[250px] md:h-[400px] object-cover rounded-xl shadow-sm border border-gray-200" />
                        ) : (
                            <div className="w-full h-[200px] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-gray-200"><FileText size={48} className="mb-2" /><span>Cover Dokumen (PDF)</span></div>
                        )}
                        
                        {/* Tampilkan Sisanya Sebagai Thumbnail Kecil-Kecil di Bawah */}
                        {data.document_urls.length > 1 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
                                {data.document_urls.slice(1).map((url: string, index: number) => (
                                    isImage(url) ? (
                                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                                            <img src={url} alt={`Galeri ${index}`} className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm" />
                                        </a>
                                    ) : (
                                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors shadow-sm">
                                            <FileText size={24} className="mb-1" /><span className="text-[10px] px-2 truncate w-full text-center font-semibold">Buka Dokumen</span>
                                        </a>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SEKSI INFORMASI DATA TRANSAKSI */}
            {transactionType === 'pembelian' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:flex print:flex-col print:gap-3">
                    <div className="lg:col-span-8">
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full print:border-gray-200 print:shadow-none print:p-4">
                            <h3 className="text-base md:text-lg font-bold text-[#1B263B] mb-4 md:mb-5 print:mb-3 print:text-base border-b pb-3 print:pb-2">Identitas Mobil</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 print:gap-2">
                                {/* TAMBAHAN: TANGGAL PEMBELIAN */}
                                <DetailItem label="Tanggal Pembelian" value={formatTanggalOnly(data.created_at)} highlight />
                                <DetailItem label="Nama Sumber" value={data.source_name} />
                                <DetailItem label="Harga Beli" value={`Rp ${formatRp(data.purchase_price)}`} />
                                <DetailItem label="Merk Mobil" value={data.car_brand} />
                                <DetailItem label="Tahun" value={data.car_year} />
                                <DetailItem label="Warna" value={data.car_color} />
                                <DetailItem label="No Polisi" value={data.license_plate?.toUpperCase()} />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col h-full gap-4 md:gap-5 print:border-gray-200 print:shadow-none print:p-4 print:gap-3">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider print:mb-0.5">Harga Jadi Total</label><div className="w-full border border-blue-200 rounded-lg px-4 py-3.5 print:py-2 text-base md:text-lg print:text-base font-bold bg-[#EEF4FF] text-[#1B263B]">Rp {formatRp(data.total_acquisition_cost)}</div></div>
                            <div className="flex flex-col flex-1"><label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider print:mb-0.5">Deskripsi Tambahan</label><div className="w-full flex-1 border border-gray-200 rounded-lg px-4 py-3 print:py-2 text-xs md:text-sm bg-gray-50 text-gray-700 whitespace-pre-wrap min-h-[100px] print:min-h-0">{data.additional_notes || <span className="text-gray-400 italic">Tidak ada catatan.</span>}</div></div>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm h-full print:border-gray-200 print:shadow-none print:p-4 print:break-inside-avoid">
                            <h3 className="text-base md:text-lg font-bold text-[#1B263B] mb-4 md:mb-5 print:mb-3 print:text-base border-b pb-3 print:pb-2">Rincian Service & Pajak</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 print:gap-2">
                                <DetailItem label="Biaya Cat" value={`Rp ${formatRp(data.paint_cost)}`} />
                                <DetailItem label="Biaya Mesin" value={`Rp ${formatRp(data.engine_cost)}`} />
                                <DetailItem label="Biaya Onderdil" value={`Rp ${formatRp(data.parts_cost)}`} />
                                <DetailItem label="Biaya Pajak" value={`Rp ${formatRp(data.tax_cost)}`} />
                                <div className="col-span-1 sm:col-span-2 pt-2 md:pt-4 print:pt-2 border-t border-gray-100"><DetailItem label="Total Pengeluaran Ekstra" value={`Rp ${formatRp(data.total_service_cost)}`} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6 w-full print:gap-3">
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E7EB] shadow-sm w-full print:border-gray-200 print:shadow-none print:p-4">
                        <h3 className="text-base md:text-lg font-bold text-[#1B263B] mb-4 md:mb-5 print:mb-3 print:text-base border-b pb-3 print:pb-2">Informasi Penjualan</h3>
                        <div className="flex flex-col gap-4 md:gap-6 print:gap-3">
                            <DetailItem label="Mobil yang Dijual" value={`${data.car_brand || '-'} (${data.car_year || '-'}) — Nopol: ${data.license_plate?.toUpperCase() || '-'}`} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 print:gap-2">
                                {/* TAMBAHAN: TANGGAL PENJUALAN */}
                                <DetailItem label="Tanggal Penjualan" value={formatTanggalOnly(data.created_at)} highlight />
                                <DetailItem label="Nama Pembeli" value={data.buyer_name} />
                                <DetailItem label="Nama Makelar" value={data.broker_name || '-'} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 print:gap-2 pt-2 md:pt-4 print:pt-2 border-t border-gray-100">
                                <div><label className="block text-xs font-bold text-gray-500 mb-1.5 print:mb-0.5 uppercase tracking-wider">Harga Jual Akhir</label><div className="w-full border border-gray-200 rounded-lg px-4 py-3 print:py-2 text-base md:text-lg print:text-base font-bold bg-gray-50 text-[#1B263B]">Rp {formatRp(data.sell_price)}</div></div>
                                <div><label className="block text-xs font-bold text-gray-500 mb-1.5 print:mb-0.5 uppercase tracking-wider">Keuntungan Bersih</label><div className="w-full border border-green-200 rounded-lg px-4 py-3 print:py-2 text-base md:text-lg print:text-base font-bold bg-green-50 text-green-700 print:border-gray-300 print:bg-white print:text-black">Rp {formatRp(data.net_profit)}</div></div>
                            </div>
                            <div className="pt-2 print:pt-1"><label className="block text-xs font-bold text-gray-500 mb-1.5 print:mb-0.5 uppercase tracking-wider">Catatan Penjualan</label><div className="w-full border border-gray-200 rounded-lg px-4 py-3 print:py-2 text-xs md:text-sm bg-gray-50 text-gray-700 min-h-[80px] print:min-h-0">{data.sale_notes || <span className="text-gray-400 italic">Tidak ada catatan.</span>}</div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({ label, value, highlight = false }: { label: string, value: string | number | undefined, highlight?: boolean }) {
    return (
        <div>
            <label className="block text-[10px] md:text-xs font-bold text-gray-500 mb-1.5 print:mb-0.5 uppercase tracking-wider">{label}</label>
            <div className={`w-full border rounded-lg px-3 md:px-4 py-2 md:py-2.5 print:py-1 text-xs md:text-sm font-semibold ${highlight ? 'bg-blue-50/50 border-blue-200 text-blue-800 print:bg-white print:border-gray-300 print:text-black' : 'bg-gray-50 border-gray-200 text-[#1B263B] print:bg-white'}`}>{value || '-'}</div>
        </div>
    );
}