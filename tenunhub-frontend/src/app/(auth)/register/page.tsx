"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPengrajin() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [asalDesa, setAsalDesa] = useState("");
  const [tahunMulai, setTahunMulai] = useState("");
  const [noWhatsapp, setNoWhatsapp] = useState("");
  const [instagram, setInstagram] = useState(""); 
  const [facebook, setFacebook] = useState(""); 
  const [bioToko, setBioToko] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage(
        "❌ Password dan Konfirmasi Password tidak cocok. Silakan periksa kembali.",
      );
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      if (authData.user) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pengrajin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: authData.user.id,
              nama: nama,
              asal_desa: asalDesa,
              tahun_mulai: parseInt(tahunMulai),
              role: "pengrajin",
              no_whatsapp: noWhatsapp,
              instagram: instagram,
              facebook: facebook,
              bio_toko: bioToko,
              foto_profil: "",
            }),
          },
        );

        if (!res.ok) {
          const pesanErrorGolang = await res.text();
          throw new Error(
            pesanErrorGolang || "Gagal menyinkronkan profil ke database.",
          );
        }
        setMessage("🎉 Pendaftaran berhasil! Mengarahkan ke halaman Login...");
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center p-6 font-sans py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-10">
        <h1 className="font-serif text-3xl font-black text-center text-[#7F1D1D] mb-2">
          Buka Etalase Toko
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Daftarkan diri Anda sebagai mitra pengrajin TenunHub
        </p>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium mb-6 ${message.startsWith("❌") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#451A03] mb-1">
              Nama Lengkap / Nama Toko
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
              placeholder="Contoh: Kelompok Tenun Mama Yosina"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#451A03] mb-1">
              Nomor WhatsApp Aktif
            </label>
            <input
              type="text"
              required
              value={noWhatsapp}
              onChange={(e) => setNoWhatsapp(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
              placeholder="Contoh: 081234567890"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#451A03] mb-1">
                Instagram{" "}
                <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
                placeholder="@username"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#451A03] mb-1">
                Facebook{" "}
                <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
                placeholder="Nama Akun FB"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#451A03] mb-1">
                Asal Desa
              </label>
              <input
                type="text"
                required
                value={asalDesa}
                onChange={(e) => setAsalDesa(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
                placeholder="Contoh: Oinlasi"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#451A03] mb-1">
                Tahun Mulai
              </label>
              <input
                type="number"
                required
                value={tahunMulai}
                onChange={(e) => setTahunMulai(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
                placeholder="Contoh: 1998"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#451A03] mb-1">
              Cerita Singkat Pengrajin (Bio)
            </label>
            <textarea
              required
              rows={3}
              value={bioToko}
              onChange={(e) => setBioToko(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm resize-none"
              placeholder="Ceritakan sedikit tentang dedikasi Anda menenun kain tradisional..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#451A03] mb-1">
              Alamat Email Aktif
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#451A03] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 p-3 pr-12 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D97706] transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#451A03] mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 p-3 pr-12 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
                placeholder="Ulangi password Anda"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D97706] transition-colors focus:outline-none"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7F1D1D] hover:bg-[#451A03] text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow-sm disabled:bg-gray-300 mt-2"
          >
            {loading ? "Memproses Pendaftaran..." : "Daftar Toko Baru"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun toko?{" "}
          <Link
            href="/login"
            className="text-[#D97706] font-bold hover:underline"
          >
            Log In di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
