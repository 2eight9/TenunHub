"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditKain() {
  const router = useRouter();
  const params = useParams();
  const kainId = params.id;

  const [loadingGuard, setLoadingGuard] = useState(true);
  const [sessionToken, setSessionToken] = useState("");
  const [myPengrajinId, setMyPengrajinId] = useState<number | null>(null);

  // Form States
  const [namaMotif, setNamaMotif] = useState("");
  const [jenisWarna, setJenisWarna] = useState("");
  const [harga, setHarga] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [generateAi, setGenerateAi] = useState(false);
  const [culturalStory, setCulturalStory] = useState("");

  // State Foto
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [fotoFiles, setFotoFiles] = useState<File[]>([]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setSessionToken(session.access_token);

      try {
        const resPengrajin = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pengrajin`,
        );
        const listPengrajin = await resPengrajin.json();
        const me = listPengrajin.find(
          (p: any) => p.user_id === session.user.id,
        );
        if (me) setMyPengrajinId(me.id);

        const resTenun = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenun`,
          {
            cache: "no-store",
          },
        );
        const listTenun = await resTenun.json();
        const foundKain = (listTenun || []).find(
          (k: any) => k.id.toString() === kainId,
        );

        if (foundKain) {
          setNamaMotif(foundKain.nama_motif);
          setJenisWarna(foundKain.jenis_warna);
          setHarga(foundKain.harga.toString());
          setIsFeatured(foundKain.is_featured);
          setCulturalStory(foundKain.cultural_story);
          setExistingImages(foundKain.image_urls || []);
        } else {
          setStatusMsg("❌ Gagal: Data kain tidak ditemukan.");
        }
      } catch (err) {
        console.error(err);
        setStatusMsg("❌ Terjadi kesalahan saat memuat data.");
      } finally {
        setLoadingGuard(false);
      }
    };
    fetchData();
  }, [router, kainId]);

  // 🎯 FUNGSI BARU: Menghapus foto spesifik dari array foto lama
  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages((prevImages) =>
      prevImages.filter((_, idx) => idx !== indexToRemove),
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotoFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setStatusMsg("");

    if (!myPengrajinId) return;

    // Validasi: Harus ada minimal 1 foto (entah foto lama atau foto baru)
    if (existingImages.length === 0 && fotoFiles.length === 0) {
      setStatusMsg("❌ Gagal: Harus ada minimal 1 foto kain!");
      setLoadingSubmit(false);
      return;
    }

    try {
      // 🎯 LOGIKA GABUNGAN: Mulai dengan foto lama yang masih tersisa
      let finalUploadedUrls: string[] = [...existingImages];

      if (fotoFiles.length > 0) {
        setStatusMsg(`📸 Mengunggah ${fotoFiles.length} foto baru...`);

        const uploadPromises = fotoFiles.map(async (file) => {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("foto-kain")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("foto-kain").getPublicUrl(fileName);

          return publicUrl;
        });

        // Tunggu upload selesai, lalu gabungkan foto baru dengan foto lama
        const newUploadedUrls = await Promise.all(uploadPromises);
        finalUploadedUrls = [...finalUploadedUrls, ...newUploadedUrls];
      }

      setStatusMsg("🚀 Mengirim pembaruan ke server...");

      const payload = {
        id: parseInt(kainId as string),
        nama_motif: namaMotif,
        jenis_warna: jenisWarna,
        harga: parseInt(harga) || 0,
        is_featured: isFeatured,
        generate_ai: generateAi,
        cultural_story: culturalStory,
        image_urls: finalUploadedUrls,
        pengrajin_id: myPengrajinId,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenun`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionToken,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      setStatusMsg("🎉 Sukses! Pembaruan data kain berhasil disimpan.");
      setTimeout(() => {
        router.refresh();
        router.push("/seller");
      }, 1500);
    } catch (err: any) {
      setStatusMsg(`❌ Gagal: ${err.message}`);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingGuard)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-[#D97706] font-bold">
          Memuat data kain...
        </p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link
          href="/seller"
          className="text-gray-400 font-bold mb-2 block hover:text-[#7F1D1D] transition-colors"
        >
          ← Batal Edit
        </Link>
        <h1 className="font-serif text-3xl font-black text-[#7F1D1D] mb-6">
          Ubah Data Kain
        </h1>

        {statusMsg && (
          <div
            className={`p-4 rounded-xl text-sm font-medium mb-6 ${statusMsg.startsWith("❌") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700 animate-pulse"}`}
          >
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="border-2 border-dashed border-gray-200 p-5 rounded-xl bg-gray-50/50">
            <label className="block text-sm font-bold text-[#451A03] mb-3">
              Foto Saat Ini:
            </label>
            {existingImages.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto mb-4 pb-2 custom-scrollbar">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative group shrink-0">
                    <img
                      src={img}
                      alt="Tersimpan"
                      className="h-24 w-24 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors"
                      title="Hapus foto ini"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-red-500 mb-4 font-bold bg-red-50 p-2 rounded">
                Semua foto lama telah dihapus. Anda wajib mengunggah foto baru.
              </p>
            )}

            <label className="block text-sm font-bold text-[#451A03] mb-1">
              Tambah Foto Baru? (Opsional)
            </label>
            <p className="text-[10px] text-gray-500 mb-3">
              Foto baru akan ditambahkan bersama foto lama yang tersisa di atas.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-50 file:text-[#D97706] cursor-pointer"
            />
            {fotoFiles.length > 0 && (
              <p className="text-xs text-emerald-600 mt-2 font-bold">
                + Terpilih {fotoFiles.length} foto baru
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold">Nama / Motif</label>
            <input
              required
              value={namaMotif}
              onChange={(e) => setNamaMotif(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 focus:ring-[#D97706]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold">Harga</label>
              <input
                type="number"
                required
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                className="w-full border p-3 rounded-xl mt-1 focus:ring-[#D97706]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Pewarna</label>
              <select
                required
                value={jenisWarna}
                onChange={(e) => setJenisWarna(e.target.value)}
                className="w-full border p-3 rounded-xl mt-1 bg-white focus:ring-[#D97706]"
              >
                <option value="Alami">Alami</option>
                <option value="Sintetis">Sintetis</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-[#7F1D1D] rounded focus:ring-[#7F1D1D]"
            />
            <label
              htmlFor="featured"
              className="text-sm font-bold text-[#451A03]"
            >
              Jadikan Karya Unggulan
            </label>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
            <label className="block text-sm font-bold text-[#451A03]">
              Cerita Budaya Saat Ini
            </label>
            <textarea
              required
              value={culturalStory}
              onChange={(e) => {
                setCulturalStory(e.target.value);
                setGenerateAi(false);
              }}
              rows={4}
              className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-[#D97706]"
            />

            <div className="flex items-center pt-2 border-t border-gray-200">
              <input
                type="checkbox"
                id="generateAi"
                checked={generateAi}
                onChange={(e) => setGenerateAi(e.target.checked)}
                className="w-4 h-4 text-[#D97706] rounded focus:ring-[#D97706] mr-2"
              />
              <label
                htmlFor="generateAi"
                className="text-sm font-bold text-gray-700 cursor-pointer"
              >
                ✨ Minta AI meracik ulang cerita ini
              </label>
            </div>
          </div>

          <button
            disabled={loadingSubmit}
            className="w-full bg-[#D97706] hover:bg-[#B45309] transition-colors text-white font-bold py-3.5 rounded-xl disabled:bg-gray-400 shadow-sm mt-4"
          >
            {loadingSubmit ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </main>
  );
}
