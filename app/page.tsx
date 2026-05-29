import React from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Bagian Kiri (Gambar & Branding) - Disembunyikan di layar HP, muncul di layar besar */}
      <div className="relative hidden w-1/2 bg-slate-900 lg:block">
        {/* Placeholder Gambar Background (Bisa diganti dengan gambar aslimu nanti) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage:
              "url('/showroom_bg.png')",
          }}
        ></div>

        {/* Overlay gelap agar teks lebih terbaca */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b132b]/90 to-[#0b132b]/40"></div>

        {/* Teks Branding */}
        <div className="absolute left-12 top-16 z-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Admin Showroom
          </h1>
          <p className="mt-2 text-sm font-semibold tracking-widest text-slate-300 uppercase">
            Amanah Mobilindo
          </p>
        </div>
      </div>

      {/* Bagian Kanan (Form Login) */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-1/2 lg:p-12">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="w-full max-w-md">

            {/* Header Text */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-[#0b132b]">
                Selamat Datang
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Silahkan isi untuk mengakses dashboard admin.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="admin@gmail.com"
                    className="block w-full rounded-md border border-slate-200 py-2.5 pl-11 pr-3 text-sm placeholder-slate-400 focus:border-[#0b132b] focus:outline-none focus:ring-1 focus:ring-[#0b132b] transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-[#0b132b] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="block w-full rounded-md border border-slate-200 py-2.5 pl-11 pr-10 text-sm placeholder-slate-400 focus:border-[#0b132b] focus:outline-none focus:ring-1 focus:ring-[#0b132b] transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                    <button type="button" className="text-slate-400 hover:text-slate-600 focus:outline-none">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#0b132b] focus:ring-[#0b132b] cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center rounded-md bg-[#0b132b] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#162349] focus:outline-none focus:ring-2 focus:ring-[#0b132b] focus:ring-offset-2 transition-all"
              >
                Sign In
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-xs font-bold text-slate-400">© Unsa Nasyta, 2026</p>
        </div>
      </div>
    </div>
  );
}