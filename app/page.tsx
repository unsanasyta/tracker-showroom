// File: app/page.tsx
"use client";

import React from "react";
import { useLoginController } from "./useLoginController";

export default function LoginPage() {
  // Panggil semua state dan fungsi dari controller
  const {
    email, setEmail,
    password, setPassword,
    error, isLoading,
    handleLogin
  } = useLoginController();

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Bagian Kiri (Gambar & Branding) */}
      <div className="relative hidden w-1/2 bg-primary lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/showroom_bg.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary/40"></div>
        <div className="absolute left-12 top-16 z-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">Amanah Mobilindo</h1>
          <p className="mt-2 text-sm font-semibold tracking-widest text-tertiary uppercase">
            Admin Showroom
          </p>
        </div>
      </div>

      {/* Bagian Kanan (Form Login) */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-1/2 lg:p-12">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-primary">Selamat Datang Kembali</h2>
              <p className="mt-2 text-sm text-secondary">Silahkan isi untuk mengakses dashboard admin.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="block w-full rounded-md border border-tertiary py-2.5 px-3 text-sm text-primary placeholder-neutral focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-md border border-tertiary py-2.5 px-3 text-sm text-primary placeholder-neutral focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex w-full items-center justify-center rounded-md bg-primary py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus:outline-none transition-all disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}