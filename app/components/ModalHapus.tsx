import React from "react";

interface ModalHapusProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalHapus({ isOpen, onClose, onConfirm }: ModalHapusProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
      {/* Modal Card */}
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Body */}
        <div className="flex flex-col items-center p-8 text-center">
          {/* Icon Container */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900">Konfirmasi Hapus</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data transaksi ini?
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-4 border-t border-slate-100 bg-[#f8fafc] px-8 py-5">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[#b91c1c] py-2.5 text-sm font-semibold text-white hover:bg-red-800 transition-colors shadow-sm"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}