import React from "react";

interface ModalLogoutProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalLogout({ isOpen, onClose, onConfirm }: ModalLogoutProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
      {/* Modal Card */}
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Body */}
        <div className="flex flex-col items-center p-8 text-center">
          {/* Icon Container */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900">Konfirmasi Logout</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin logout dari sistem?
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
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}