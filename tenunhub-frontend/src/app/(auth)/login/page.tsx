"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPengrajin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;
      if (user) {
        if (
          user.email === "inoboimau@gmail.com" ||
          user.email === "apriliano23@students.amikom.ac.id"
        ) {
          router.push("/admin");
        } else {
          router.push("/seller");
        }
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) return;
      if (
        session.user.email === "inoboimau@gmail.com" ||
        session.user.email === "apriliano23@students.amikom.ac.id"
      ) {
        router.push("/admin");
      } else {
        router.push("/seller");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        setMessage("❌ Login gagal: user tidak ditemukan.");
        return;
      }

      setMessage("🎉 Login Berhasil! Membuka gerbang...");

      setTimeout(() => {
        if (
          data.user?.email === "inoboimau@gmail.com" ||
          data.user?.email === "apriliano23@students.amikom.ac.id"
        ) {
          router.push("/admin"); 
        } else {
          router.push("/seller");
        }
      }, 500);
    } catch (err: any) {
      const msg = err?.message || "Terjadi kesalahan saat login. Coba lagi ya.";
      setMessage(`❌ Login Gagal: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="font-serif text-3xl font-black text-center text-[#7F1D1D] mb-2">
          Masuk ke Toko
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Kelola katalog kain tenun digital Anda
        </p>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium mb-6 ${
              message.startsWith("❌")
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#451A03] mb-1">
              Email Toko
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

          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-[#451A03]">
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-xs font-bold text-[#D97706] hover:underline"
            >
              Lupa Password?
            </Link>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 p-3 pr-12 rounded-xl focus:border-[#D97706] focus:outline-none text-gray-800 text-sm"
                placeholder="Masukkan password akun toko"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7F1D1D] hover:bg-[#451A03] text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow-sm disabled:bg-gray-300 mt-2"
          >
            {loading ? "Membuka Gerbang Toko..." : "Log In Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun mitra?{" "}
          <Link
            href="/register"
            className="text-[#D97706] font-bold hover:underline"
          >
            Daftar Toko di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
