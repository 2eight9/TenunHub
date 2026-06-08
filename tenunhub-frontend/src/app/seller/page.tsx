"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Kain {
  id: number;
  nama_motif: string;
  jenis_warna: string;
  harga: number;
  cultural_story: string;
  click_count: number;
  is_featured: boolean;
  pengrajin_id: number;
  image_urls: string[];
}

export default function DashboardSeller() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [katalog, setKatalog] = useState<Kain[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchKatalogKain(user.id);
      }
    };
    checkUser();
  }, [router]);

  const fetchKatalogKain = async (supabaseUserId: string) => {
    try {
      const resPengrajin = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pengrajin`,
        {
          cache: "no-store",
        },
      );
      const listPengrajin = await resPengrajin.json();
      const me = listPengrajin.find((p: any) => p.user_id === supabaseUserId);

      if (!me) throw new Error("Profil tidak ditemukan");

      const resTenun = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenun`, {
        cache: "no-store",
      });
      if (!resTenun.ok) throw new Error("Gagal mengambil data kain");
      const semuaKain = await resTenun.json();

      const kainSaya = (semuaKain || []).filter(
        (k: Kain) => k.pengrajin_id === me.id,
      );
      setKatalog(kainSaya);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isConfirm = window.confirm(
      "Apakah Anda yakin ingin menghapus mahakarya ini dari etalase?",
    );
    if (!isConfirm) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesi login tidak valid");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenun?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: session.access_token,
          },
        },
      );

      if (!res.ok) throw new Error("Gagal menghapus kain dari server");

      setKatalog(katalog.filter((kain) => kain.id !== id));
      alert("Kain berhasil dihapus!");
    } catch (err: any) {
      console.error(err);
      alert(`Terjadi kesalahan: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#D97706] animate-pulse">
        Memuat data dashboard toko...
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl font-black text-[#7F1D1D]">
              Dashboard Pengrajin
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Email Mitra: {user?.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/seller/settings"
              className="bg-white border border-[#D97706] text-[#D97706] font-bold py-3 px-5 rounded-xl text-sm hover:bg-[#FFFBEB] transition-colors shadow-sm"
            >
              ⚙️ Pengaturan Toko
            </Link>
            <Link
              href="/seller/tambah"
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-5 py-3 rounded-xl text-sm shadow-sm transition-colors"
            >
              ➕ Pajang Kain Baru
            </Link>
            <button
              onClick={handleLogout}
              className="border border-red-200 hover:bg-red-50 text-red-600 font-bold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              Keluar Akun
            </button>
          </div>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#451A03] mb-6">
          Katalog Kain Anda
        </h2>

        {katalog.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm mb-4">
              Belum ada kain tenun yang dipajang di etalase toko Anda.
            </p>
            <Link
              href="/seller/tambah"
              className="text-[#D97706] font-bold text-sm hover:underline"
            >
              Mulailah memajang produk pertama Anda →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {katalog.map((kain) => (
              <div
                key={kain.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full group hover:shadow-md transition-shadow"
              >
                <Link href={`/kain/${kain.id}`} className="flex flex-col grow">
                  <div className="w-full h-48 bg-gray-100 border-b border-gray-100 relative overflow-hidden shrink-0">
                    <img
                      src={
                        kain.image_urls && kain.image_urls.length > 0
                          ? kain.image_urls[0]
                          : "/placeholder.jpg"
                      }
                      alt={kain.nama_motif}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {kain.image_urls && kain.image_urls.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md font-bold backdrop-blur-sm">
                        1/{kain.image_urls.length} 📸
                      </div>
                    )}
                  </div>

                  <div className="p-5 grow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#D97706] bg-amber-50 px-2.5 py-1 rounded-full">
                        {kain.jenis_warna}
                      </span>
                      {kain.is_featured && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          🏆 Unggulan
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-gray-800 mb-1 group-hover:text-[#7F1D1D] transition-colors">
                      {kain.nama_motif}
                    </h3>
                    <p className="text-sm font-black text-[#7F1D1D] mb-4">
                      Rp {kain.harga.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-50 italic mb-4 line-clamp-3">
                      "{kain.cultural_story || "Belum ada kisah budaya."}"
                    </p>
                  </div>
                </Link>
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-gray-100 pb-3 mb-3">
                    <span>
                      Dilihat:{" "}
                      <strong className="text-gray-600">
                        {kain.click_count}
                      </strong>{" "}
                      kali
                    </span>
                    <span className="text-gray-300">ID #{kain.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/seller/edit/${kain.id}`}
                      className="flex-1 bg-amber-50 hover:bg-[#D97706] text-[#D97706] hover:text-white text-xs font-bold py-2.5 rounded-lg text-center transition-colors border border-amber-100 hover:border-transparent"
                    >
                      ✏️ Ubah
                    </Link>
                    <button
                      onClick={(e) => handleDelete(kain.id, e)}
                      className="flex-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-bold py-2.5 rounded-lg transition-colors border border-red-100 hover:border-transparent"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
