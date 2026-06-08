"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Pengrajin {
  id: number;
  nama: string;
  asal_desa: string;
  bio_toko: string;
  foto_profil: string;
  no_whatsapp: string;
  instagram: string;
  facebook: string;
}

interface Tenun {
  pengrajin_id: any;
  id: number;
  nama_motif: string;
  jenis_warna: string;
  harga: number;
  cultural_story: string;
  click_count: number;
  is_featured: boolean;
  image_urls: string[];
}

export default function ProfilPengrajin() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [pengrajin, setPengrajin] = useState<Pengrajin | null>(null);
  const [katalog, setKatalog] = useState<Tenun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPengrajin = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pengrajin`,
          {
            cache: "no-store",
          },
        );
        const dataPengrajin = await resPengrajin.json();
        const foundPengrajin = dataPengrajin.find(
          (p: any) => p.id.toString() === id,
        );

        if (foundPengrajin) {
          setPengrajin(foundPengrajin);
          const resTenun = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/tenun`,
            {
              cache: "no-store",
            },
          );
          const dataTenun = await resTenun.json();
          const karyaBeliau = (dataTenun || []).filter(
            (k: Tenun) => k.pengrajin_id === foundPengrajin.id,
          );

          setKatalog(karyaBeliau);
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#D97706] animate-pulse">
        Menelusuri profil pengrajin...
      </div>
    );
  if (!pengrajin)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Profil pengrajin tidak ditemukan.
      </div>
    );

  return (
    <main className="bg-[#FDFBF7] min-h-screen font-sans pb-20">
      <section className="bg-white border-b border-gray-100 pt-12 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 font-bold mb-8 block hover:text-[#7F1D1D] transition-colors"
          >
            &larr; Kembali ke Beranda Utama
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden bg-amber-50 border-4 border-[#FFFBEB] shadow-lg shrink-0">
              {pengrajin.foto_profil ? (
                <img
                  src={pengrajin.foto_profil}
                  alt={pengrajin.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>
            <div className="grow">
              <h1 className="font-serif text-4xl md:text-5xl font-black text-[#7F1D1D] mb-2">
                {pengrajin.nama}
              </h1>
              <p className="text-[#D97706] font-bold tracking-wider uppercase text-xs mb-6">
                📍 {pengrajin.asal_desa || "Indonesia"}
              </p>

              <div className="bg-[#FFFBEB] p-6 rounded-2xl border border-amber-100 mb-6">
                <p className="text-gray-700 leading-relaxed italic font-serif text-[15px]">
                  "
                  {pengrajin.bio_toko ||
                    "Seorang seniman tenun yang mendedikasikan waktunya untuk melestarikan keindahan budaya nusantara melalui helaian benang."}
                  "
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {pengrajin.no_whatsapp && (
                  <a
                    href={`https://wa.me/${pengrajin.no_whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    💬 Hubungi WhatsApp
                  </a>
                )}
                {pengrajin.instagram && (
                  <a
                    href={pengrajin.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500 hover:opacity-90 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-opacity"
                  >
                    📸 Instagram
                  </a>
                )}
                {pengrajin.facebook && (
                  <a
                    href={pengrajin.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    📘 Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 pt-16">
        <div className="mb-10 text-center md:text-left border-b border-gray-200 pb-4">
          <h2 className="font-serif text-3xl font-bold text-[#451A03]">
            Koleksi Eksklusif {pengrajin.nama}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {katalog.length > 0
              ? `Terdapat ${katalog.length} mahakarya yang siap dipinang.`
              : "Belum ada mahakarya yang dipajang."}
          </p>
        </div>

        {katalog.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {katalog.map((kain) => (
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
                    <span className="text-[10px] font-bold text-[#D97706] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                      🎨 {kain.jenis_warna}
                    </span>
                    {kain.is_featured && (
                      <span className="text-[10px] bg-red-50 text-[#7F1D1D] font-extrabold px-2.5 py-1 rounded-full border border-red-100">
                        ⭐ Masterpiece
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#7F1D1D] mb-3 group-hover:text-[#D97706] transition-colors line-clamp-1">
                    {kain.nama_motif}
                  </h3>
                  <p className="text-justify text-gray-900 text-sm leading-relaxed italic bg-[#FDFBF7] p-4 rounded-2xl border border-amber-50 relative line-clamp-3">
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
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
