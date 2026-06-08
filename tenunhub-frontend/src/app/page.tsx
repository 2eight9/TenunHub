"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Tenun {
  id: number;
  nama_motif: string;
  jenis_warna: string;
  harga: number;
  cultural_story: string;
  click_count: number;
  is_featured: boolean;
  image_urls: string[];
  pengrajin_id: number;
}

export default function CatalogHome() {
  const [kainList, setKainList] = useState<Tenun[]>([]);
  const [pengrajinList, setPengrajinList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchKatalog();
  }, [sortOption]);

  const fetchKatalog = async () => {
    setLoading(true);
    try {
      let queryParam = "";
      if (sortOption === "harga-murah") queryParam = "?sort=termurah";
      else if (sortOption === "harga-mahal") queryParam = "?sort=termahal";
      else if (sortOption === "terpopuler") queryParam = "?sort=terlaris";

      const resKain = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenun${queryParam}`,
        {
          cache: "no-store",
        },
      );
      if (!resKain.ok) throw new Error("Gagal mengambil data tenun");
      const dataKain = await resKain.json();
      setKainList(dataKain || []);

      const resPengrajin = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pengrajin`,
        {
          cache: "no-store",
        },
      );
      if (!resPengrajin.ok) throw new Error("Gagal mengambil data pengrajin");
      const dataPengrajin = await resPengrajin.json();
      setPengrajinList(dataPengrajin || []);
    } catch (err) {
      console.error(
        "📢 Server backend belum aktif atau ada gangguan data:",
        err,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBeliSekarang = async (kain: Tenun, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenun/click?id=${kain.id}`,
        {
          method: "POST",
        },
      );
    } catch (error) {
      console.error("Gagal melacak klik:", error);
    } finally {
      router.push(`/kain/${kain.id}`);
    }
  };

  const filteredKainList = kainList.filter((kain) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchMotif = kain.nama_motif.toLowerCase().includes(query);
    const pembuat = pengrajinList.find((p) => p.id === kain.pengrajin_id);
    const matchPengrajin = pembuat
      ? pembuat.nama.toLowerCase().includes(query)
      : false;
    return matchMotif || matchPengrajin;
  });

  // Hero Section
  return (
    <main className="bg-[#FDFBF7] min-h-screen font-sans pb-20">
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 px-3 py-1.5 rounded-full">
            ✨ Warisan Budaya yang Terjalin dalam Setiap Benang
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-black text-[#7F1D1D] mt-4 mb-6 leading-tight">
            Jangan Biarkan Cerita Ini <br />
            Berakhir Pada <span className="text-[#D97706]">Kita</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-lg mb-8 leading-relaxed">
            Ada hal-hal yang tak mampu disimpan oleh waktu. Maka manusia
            menenunnya menjadi cerita, agar tetap hidup jauh setelah mereka
            tiada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#katalog"
              className="bg-[#7F1D1D] text-white font-bold px-8 py-4 rounded-xl shadow-md hover:bg-[#451A03] transition-colors text-center text-sm"
            >
              Jelajahi Koleksi &rarr;
            </a>
            <Link
              href="/register"
              className="bg-white border border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors text-center text-sm"
            >
              Lanjutkan Ceritanya &rarr;
            </Link>
          </div>
        </div>
        <div className="bg-amber-100/50 aspect-4/3 rounded-3xl border border-amber-100 flex items-center justify-center p-8 text-center italic text-[#78350F] font-serif font-medium shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 opacity-28 bg-[url('https://www.transparenttextures.com/patterns/woven.png')]"></div>
          <span className=" text-center relative z-10">
            "Setiap motif adalah halaman dari kisah yang tak pernah ditulis,
            namun terus diceritakan dari generasi ke generasi melalui benang,
            warna, dan tangan yang menenunnya."
          </span>
        </div>
      </section>
      <section id="katalog" className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200 pb-6 mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#451A03]">
              Galeri Tenun Tanah Timor
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Ditemukan {filteredKainList.length} mahakarya seni tenun
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari motif atau pengrajin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] shadow-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">
                Urutkan:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-sm font-bold text-[#451A03] bg-transparent focus:outline-none cursor-pointer w-full"
              >
                <option value="default">Terbaru Dipajang</option>
                <option value="harga-murah">Harga Terendah</option>
                <option value="harga-mahal">Harga Tertinggi</option>
                <option value="terpopuler">Paling Diminati</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#D97706] font-bold animate-pulse text-sm">
            Sedang menggelar kain tenun terbaik...
          </div>
        ) : filteredKainList.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center shadow-sm">
            <p className="text-gray-500 text-lg">
              Maaf, kain atau pengrajin yang Anda cari belum ditemukan.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-[#D97706] font-bold text-sm hover:underline"
            >
              Tampilkan semua koleksi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredKainList.map((kain) => {
              const pembuat = pengrajinList.find(
                (p) => p.id === kain.pengrajin_id,
              );

              return (
                <Link
                  key={kain.id}
                  href={`/kain/${kain.id}`}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="w-full h-64 bg-gray-100 relative">
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

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-2 items-center max-w-[70%]">
                        <span className="text-[10px] font-bold text-[#D97706] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 shrink-0">
                          🎨 {kain.jenis_warna}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (pembuat)
                              router.push(`/pengrajin/${pembuat.id}`);
                          }}
                          className="text-[10px] font-bold text-[#451A03] bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full border border-gray-200 truncate transition-colors z-10"
                        >
                          👤 {pembuat ? pembuat.nama : "Anonim"}
                        </button>
                      </div>
                      {kain.is_featured && (
                        <span className="text-[10px] bg-red-50 text-[#7F1D1D] font-extrabold px-2.5 py-1 rounded-full border border-red-100">
                          ⭐ Masterpiece
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#7F1D1D] mb-3 group-hover:text-[#D97706] transition-colors line-clamp-1">
                      {kain.nama_motif}
                    </h3>
                    <p className="justify text-gray-600 text-sm leading-relaxed italic bg-[#FDFBF7] p-4 rounded-2xl border border-amber-50 relative line-clamp-3">
                      "{kain.cultural_story}"
                    </p>
                  </div>

                  <div className="p-6 bg-[#FDFBF7] border-t border-gray-50/80 flex items-center justify-between gap-4 mt-auto">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Harga Jual
                      </p>
                      <p className="font-serif text-xl font-black text-[#451A03]">
                        Rp {kain.harga.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleBeliSekarang(kain, e)}
                      className="bg-[#7F1D1D] hover:bg-[#451A03] text-white font-bold text-xs px-4 py-3 rounded-xl transition-colors shadow-md whitespace-nowrap"
                    >
                      Beli Sekarang &rarr;
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
