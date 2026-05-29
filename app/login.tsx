"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signing in with:", { email, password, rememberMe });
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen w-full bg-white text-slate-800">
      {/* Left Panel - Hidden on smaller screens, shown on desktop (lg) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-16 text-white overflow-hidden select-none">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-10000 hover:scale-105"
          style={{ backgroundImage: `url('/showroom_bg.png')` }}
        />
        {/* Dark Blue Overlay to match the mockup visual identity */}
        <div className="absolute inset-0 bg-[#0B1530]/75 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B1A] via-transparent to-[#0B1530]/40 z-10" />

        {/* Brand Header */}
        <div className="relative z-20 mt-6">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            Admin Showroom
          </h1>
          <p className="mt-2 text-xs xl:text-sm font-bold tracking-widest text-slate-300 uppercase">
            BERLIAN MOTOR DAN AMANAH MOBILINDO
          </p>
        </div>

        {/* Footer/Accent visual decoration on left side */}
        <div className="relative z-20 mt-auto">
          <div className="w-16 h-1 bg-white/30 rounded-full mb-4"></div>
          <p className="text-xs text-white/50 font-medium">
            Premium Showroom Administration System
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-between p-8 sm:p-16 lg:p-20 xl:p-24 bg-white">
        {/* Empty element for spacing */}
        <div className="hidden sm:block" />

        {/* Login Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#081026] tracking-tight font-sans">
              Selamat Datang Kembali
            </h2>
            <p className="text-sm text-slate-500 font-medium font-sans">
              Silahkan isi untuk mengakses dashboard admin.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-[#2d3a54] tracking-wide"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm text-slate-900 placeholder-slate-300 outline-none hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all font-medium"
                  placeholder="admin@gmail.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-[#2d3a54] tracking-wide"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-[#1e40af] hover:text-[#1d4ed8] hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-md border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-300 outline-none hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all ${!showPassword && password ? "font-mono tracking-widest text-xs" : "font-medium"
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900 accent-[#081026] cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2.5 block text-xs font-semibold text-slate-500 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group flex w-full items-center justify-center rounded-md bg-[#081026] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#121c38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                <span>Sign In</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                  stroke="currentColor"
                  className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="w-full max-w-[420px] mx-auto border-t border-slate-100 pt-6 mt-auto">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wider select-none">
            &copy; Unsa Nasyta
          </p>
        </div>
      </div>
    </main>
  );
}