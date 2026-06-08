"use client"; // Wajib untuk interaksi klik

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        <Link
          href="/"
          className="font-serif text-xl lg:text-2xl font-black text-[#7F1D1D] tracking-wide hover:opacity-80 transition-opacity shrink-0"
        >
          Tenun<span className="text-[#D97706]">Hub</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 font-medium text-[#451A03]">
          <Link href="/" className="hover:text-[#D97706] transition-colors">
            Jelajahi Kain
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#D97706] transition-colors"
          >
            Tentang Kami
          </Link>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="bg-[#7F1D1D] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#451A03] transition-colors whitespace-nowrap"
          >
            Buka Toko / Login &rarr;
          </Link>
        </div>
        <div className="flex lg:hidden items-center gap-3">
          <Link
            href="/login"
            className="bg-[#7F1D1D] text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-[#451A03] transition-colors"
          >
            Login
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#451A03] focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-xl flex flex-col py-4 px-6 gap-4 z-50">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="font-medium text-[#451A03] hover:text-[#D97706] pb-2 border-b border-slate-100"
          >
            Jelajahi Kain
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="font-medium text-[#451A03] hover:text-[#D97706] pb-2 border-b border-slate-100"
          >
            Tentang Kami
          </Link>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="font-bold text-[#7F1D1D] hover:text-[#451A03] pt-1"
          >
            Buka Toko / Dasbor &rarr;
          </Link>
        </div>
      )}
    </nav>
  );
}
