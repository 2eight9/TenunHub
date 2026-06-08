"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`,
      });
      if (error) throw error;
      setMessage({
        text: "Berhasil! Tautan untuk mereset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.",
        type: "success",
      });
      setEmail("");
    } catch (error: any) {
      setMessage({
        text: error.message || "Gagal mengirim email reset password.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-black text-[#7F1D1D] mb-2">
            Lupa Password?
          </h1>
          <p className="text-gray-500 text-sm">
            Jangan khawatir! Masukkan email toko Anda di bawah ini, dan kami
            akan mengirimkan tautan pemulihan.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-bold mb-6 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-[#451A03] mb-2"
            >
              Alamat Email Terdaftar
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-[#D97706] focus:border-[#D97706] transition-colors"
              placeholder="contoh: penenun@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Mengirim Tautan..." : "Kirim Tautan Pemulihan"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link
            href="/login"
            className="text-gray-500 hover:text-[#7F1D1D] font-bold transition-colors"
          >
            &larr; Kembali ke halaman Login
          </Link>
        </div>
      </div>
    </main>
  );
}
