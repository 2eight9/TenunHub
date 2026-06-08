"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TambahKainBaru() {
  const router = useRouter();
  const [loadingGuard, setLoadingGuard] = useState(true);
  const [sessionToken, setSessionToken] = useState("");
  const [myPengrajinId, setMyPengrajinId] = useState<number | null>(null);

  // Form States
  const [namaMotif, setNamaMotif] = useState("");
  const [jenisWarna, setJenisWarna] = useState("");
  const [harga, setHarga] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [generateAi, setGenerateAi] = useState(true);
  const [culturalStory, setCulturalStory] = useState("");

  // 🎯 STATE BARU UNTUK BANYAK FOTO
  const [fotoFiles, setFotoFiles] = useState<File[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setSessionToken(session.access_token);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pengrajin`);
        const list = await res.json();
        const me = list.find((p: any) => p.user_id === session.user.id);
        if (me) setMyPengrajinId(me.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingGuard(false);
      }
    };
    checkUser();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFotoFiles(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setStatusMsg("");

    if (!myPengrajinId) return;

    try {
      let finalUploadedUrls: string[] = [];

      if (fotoFiles.length > 0) {
        setStatusMsg(`📸 Sedang mengunggah ${fotoFiles.length} foto kain...`);
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

        finalUploadedUrls = await Promise.all(uploadPromises);
      }

      setStatusMsg("🚀 Menghubungkan ke server & meracik cerita budaya...");
      const payload = {
        nama_motif: namaMotif,
        jenis_warna: jenisWarna,
        harga: parseInt(harga) || 0,
        is_featured: isFeatured,
        generate_ai: generateAi,
        cultural_story: generateAi ? "" : culturalStory,
        image_urls: finalUploadedUrls,
        pengrajin_id: myPengrajinId,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenun`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionToken,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      setStatusMsg("🎉 Sukses! Kain tenun beserta fotonya berhasil dipajang!");
      setTimeout(() => router.push("/seller"), 1500);
    } catch (err: any) {
      setStatusMsg(`❌ Gagal: ${err.message}`);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingGuard)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse">Memverifikasi...</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/seller" className="text-gray-400 font-bold mb-2 block">
          ← Kembali
        </Link>
        <h1 className="font-serif text-3xl font-black text-[#7F1D1D] mb-6">
          Pajang Kain Baru
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
            <label className="block text-sm font-bold text-[#451A03] mb-2">
              Foto Fisik Kain (Bisa pilih lebih dari 1)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-50 file:text-[#D97706] cursor-pointer"
            />
            {fotoFiles.length > 0 && (
              <p className="text-xs text-emerald-600 mt-2 font-bold">
                Terpilih {fotoFiles.length} foto
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold">Nama / Motif</label>
            <input
              required
              value={namaMotif}
              onChange={(e) => setNamaMotif(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1"
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
                className="w-full border p-3 rounded-xl mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Pewarna</label>
              <select
                required
                value={jenisWarna}
                onChange={(e) => setJenisWarna(e.target.value)}
                className="w-full border p-3 rounded-xl mt-1"
              >
                <option value="">Pilih...</option>
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
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="text-sm font-bold">
              Jadikan Karya Unggulan
            </label>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border space-y-3">
            <label className="block text-sm font-bold">
              Metode Cerita (AI / Manual)
            </label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  checked={generateAi}
                  onChange={() => setGenerateAi(true)}
                  className="mr-2"
                />
                ✨ AI Gemini
              </label>
              <label>
                <input
                  type="radio"
                  checked={!generateAi}
                  onChange={() => setGenerateAi(false)}
                  className="mr-2"
                />
                ✍️ Manual
              </label>
            </div>
            {!generateAi && (
              <textarea
                required
                value={culturalStory}
                onChange={(e) => setCulturalStory(e.target.value)}
                rows={3}
                className="w-full border p-3 rounded-xl mt-2 text-sm"
                placeholder="Tulis cerita..."
              />
            )}
          </div>

          <button
            disabled={loadingSubmit}
            className="w-full bg-[#7F1D1D] text-white font-bold py-3.5 rounded-xl disabled:bg-gray-400"
          >
            {loadingSubmit ? "Menyimpan Data..." : "Pajang Kain Sekarang"}
          </button>
        </form>
      </div>
    </main>
  );
}
