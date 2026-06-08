"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
export default function DetailKain() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [kain, setKain] = useState<any>(null);
  const [pengrajin, setPengrajin] = useState<any>(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resKain = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenun`);
        const dataKain = await resKain.json();
        const foundKain = (dataKain || []).find(
          (k: any) => k.id.toString() === id,
        );

        if (foundKain) {
          setKain(foundKain);
          if (foundKain.image_urls && foundKain.image_urls.length > 0) {
            setMainImage(foundKain.image_urls[0]);
          }

          const resPengrajin = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pengrajin`,
          );
          const dataPengrajin = await resPengrajin.json();
          const foundPengrajin = dataPengrajin.find(
            (p: any) => p.id === foundKain.pengrajin_id,
          );
          if (foundPengrajin) setPengrajin(foundPengrajin);
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#D97706] animate-pulse">
        Memuat mahakarya...
      </div>
    );
  if (!kain)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Kain tidak ditemukan.
      </div>
    );

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-10 px-6 font-sans relative">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-[#7F1D1D] font-bold mb-6 block transition-colors"
        >
          &larr; Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 border-r border-gray-100">
            <div
              onClick={() => setModalImageUrl(mainImage)}
              className="w-full h-96 md:h-500px bg-gray-100 rounded-2xl overflow-hidden mb-4 cursor-zoom-in relative group"
            >
              <img
                src={mainImage || "/placeholder.jpg"}
                alt={kain.nama_motif}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition-opacity">
                  🔍 Klik untuk perbesar
                </span>
              </div>
            </div>

            {kain.image_urls && kain.image_urls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {kain.image_urls.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? "border-[#D97706] opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-amber-50 text-[#D97706] font-bold text-xs px-3 py-1.5 rounded-full mb-4">
                {kain.jenis_warna}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-black text-[#7F1D1D] mb-4">
                {kain.nama_motif}
              </h1>
              <p className="text-3xl font-black text-gray-900 mb-8">
                Rp {kain.harga.toLocaleString("id-ID")}
              </p>
              <div className="bg-[#FFFBEB] p-6 rounded-2xl mb-8 relative">
                <span className="absolute -top-3 left-6 bg-white border border-[#D97706] text-[#D97706] text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                  Cerita Budaya
                </span>
                <p className="text-justify text-gray-700 leading-relaxed italic font-serif text-lg">
                  "{kain.cultural_story}"
                </p>
              </div>
            </div>
            {pengrajin && (
              <div className="mt-auto border-t border-gray-100 pt-8">
                <p className="text-sm text-gray-500 mb-3">Ditenun oleh:</p>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    onClick={() =>
                      pengrajin.foto_profil &&
                      setModalImageUrl(pengrajin.foto_profil)
                    }
                    className={`h-12 w-12 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shadow-sm ${pengrajin.foto_profil ? "cursor-zoom-in hover:opacity-80 transition-opacity" : ""}`}
                    title={
                      pengrajin.foto_profil
                        ? "Klik untuk memperbesar foto profil"
                        : ""
                    }
                  >
                    {pengrajin.foto_profil ? (
                      <img
                        src={pengrajin.foto_profil}
                        alt={pengrajin.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                        👤
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {pengrajin.nama}
                    </h3>
                    <p className="text-xs text-gray-500">
                      📍 {pengrajin.asal_desa}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${pengrajin.no_whatsapp}?text=Halo%20Bapak/Ibu%20${pengrajin.nama},%20saya%20tertarik%20dengan%20kain%20${kain.nama_motif}%20seharga%20Rp${kain.harga.toLocaleString("id-ID")}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#16A34A] hover:bg-[#15803D] text-white text-center font-bold py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all"
                >
                  Beli via WhatsApp &rarr;
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalImageUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setModalImageUrl(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-[#D97706] font-bold text-2xl w-12 h-12 flex items-center justify-center bg-black/50 rounded-full transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setModalImageUrl(null);
            }}
          >
            ✕
          </button>

          <img
            src={modalImageUrl}
            alt="Full screen view"
            className="w-full h-full object-contain select-none"
          />
        </div>
      )}
    </main>
  );
}
