"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Tenun {
  id: number;
  nama_motif: string;
  harga: number;
  pengrajin_id: number;
  is_featured: boolean;
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [kainList, setKainList] = useState<Tenun[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ total_kain: 0, total_pengrajin: 0 });
  const [pengrajinList, setPengrajinList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("kain");
  const adminEmails = ["inoboimau@gmail.com"];

  useEffect(() => {
    const verifyAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userEmail = session?.user?.email || "";

      if (!session || !adminEmails.includes(userEmail)) {
        alert("Akses ditolak. Halaman ini khusus pemilik sistem.");
        router.push("/");
        return;
      }

      setIsAdmin(true);
      fetchData();
    };

    verifyAdmin();
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenun`, {
        cache: "no-store",
      });

      const data = await res.json();
      setKainList(data || []);
    } catch (err) {
      console.error("Gagal memuat data", err);
    } finally {
      setLoading(false);
    }

    const ambilDataAdmin = async () => {
      const resStats = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        {
          cache: "no-store",
        },
      );
      if (resStats.ok) setStats(await resStats.json());
      const resPengrajin = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pengrajin`,
        {
          cache: "no-store",
        },
      );
      if (resPengrajin.ok) setPengrajinList(await resPengrajin.json());
    };
    ambilDataAdmin();
  };

  const handleHapus = async (id: number) => {
    const konfirmasi = window.confirm(
      "Peringatan Dewa: Yakin ingin memusnahkan data ini secara permanen?",
    );
    if (!konfirmasi) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenun?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: session?.access_token || "",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Ditolak oleh server Golang.");
      }
      setKainList((prev) => prev.filter((item) => item.id !== id));
      alert("✅ Data berhasil dimusnahkan selamanya!");
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Error: Gagal mengeksekusi perintah hapus.");
    }
  };

  const handleUbahVIP = async (id: number) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/featured?id=${id}`,
        {
          method: "PUT",
          headers: { Authorization: session?.access_token || "" },
        },
      );
      if (!res.ok) throw new Error();

      setKainList((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, is_featured: !k.is_featured } : k,
        ),
      );
    } catch (err) {
      alert("Gagal mengubah status VIP produk.");
    }
  };

  const handleStatusBlokir = async (id: number) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin mengubah status blokir akun pengrajin ini?",
    );
    if (!konfirmasi) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/ban?id=${id}`,
        {
          method: "PUT",
          headers: { Authorization: session?.access_token || "" },
        },
      );
      if (!res.ok) throw new Error();

      setPengrajinList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_banned: !p.is_banned } : p)),
      );
    } catch (err) {
      alert("Gagal memproses blokir akun.");
    }
  };

  const handleLogout = async () => {
    const konfirmasi = window.confirm(
      "Yakin ingin keluar dari Ruang Kendali Dewa?",
    );
    if (!konfirmasi) return;

    await supabase.auth.signOut();
    router.push("/login");
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-xl font-semibold">Memuat data...</h2>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">
              Dashboard Super Admin
            </h1>
            <p className="text-sm text-slate-500">
              Kelola seluruh data dan pengguna di ekosistem TenunHub.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2">
                ← Kembali ke Beranda
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600  hover:bg-red-700 border border-red-800 text-black text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-all"
            >
              Keluar (Logout)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
              Total Kain Terdaftar
            </p>
            <p className="text-3xl font-black text-slate-800">
              {stats.total_kain}{" "}
              <span className="text-lg font-medium text-slate-500">Produk</span>
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
              Total Mitra Pengrajin
            </p>
            <p className="text-3xl font-black text-slate-800">
              {stats.total_pengrajin}{" "}
              <span className="text-lg font-medium text-slate-500">Akun</span>
            </p>
          </div>
        </div>

        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("kain")}
            className={`pb-3 px-2 font-bold text-sm transition-all ${activeTab === "kain" ? "border-b-2 border-red-600 text-red-600" : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"}`}
          >
            Katalog Kain ({kainList.length})
          </button>
          <button
            onClick={() => setActiveTab("pengrajin")}
            className={`pb-3 px-2 font-bold text-sm transition-all ${activeTab === "pengrajin" ? "border-b-2 border-red-600 text-red-600" : "text-slate-400 hover:text-slate-600 border-b-2 border-transparent"}`}
          >
            Manajemen Pengrajin ({pengrajinList.length})
          </button>
        </div>

        <div>
          {activeTab === "kain" ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Nama Motif</th>
                    <th className="p-4">Pengrajin ID</th>
                    <th className="p-4">Harga</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kainList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-slate-400"
                      >
                        Tidak ada data tenun yang tersedia.
                      </td>
                    </tr>
                  ) : (
                    kainList.map((kain) => (
                      <tr
                        key={kain.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4 text-slate-500 font-medium">
                          {kain.id}
                        </td>
                        <td className="p-4 font-bold text-slate-800">
                          {kain.nama_motif}
                        </td>
                        <td className="p-4 text-slate-600">
                          {kain.pengrajin_id}
                        </td>
                        <td className="p-4 text-slate-600">
                          Rp {kain.harga.toLocaleString("id-ID")}
                        </td>
                        <td className="p-4 text-center">
                          {kain.is_featured ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                              ⭐ VIP
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                              Standar
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleUbahVIP(kain.id)}
                            className={`mr-2 text-xs px-3 py-1.5 rounded font-bold transition-all ${kain.is_featured ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}
                          >
                            {kain.is_featured ? "Cabut VIP" : "Set VIP"}
                          </button>
                          <button
                            onClick={() => handleHapus(kain.id)}
                            className="bg-white border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold py-1.5 px-3 rounded transition-all"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Nama Toko</th>
                    <th className="p-4">Asal Desa</th>
                    <th className="p-4">No Whatsapp</th>
                    <th className="p-4 text-center">Status Keaktifan</th>
                    <th className="p-4 text-center">Tindakan Kontrol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pengrajinList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-slate-400"
                      >
                        Belum ada pengrajin yang bergabung.
                      </td>
                    </tr>
                  ) : (
                    pengrajinList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-800">
                          {p.nama}
                        </td>
                        <td className="p-4 text-slate-500">{p.asal_desa}</td>
                        <td className="p-4 text-slate-500">{p.no_whatsapp}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.is_banned ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
                          >
                            {p.is_banned ? "DIBLOKIR" : "AKTIF"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleStatusBlokir(p.id)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${p.is_banned ? "bg-emerald-600 border-transparent text-white hover:bg-emerald-700" : "bg-white border-red-300 text-red-600 hover:bg-red-50"}`}
                          >
                            {p.is_banned ? "Pulihkan Akun" : "Blokir Permanen"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
