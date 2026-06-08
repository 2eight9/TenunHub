"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SellerSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // 🎯 UPDATE: Menambahkan asal_desa agar tidak terhapus di Golang
  const [profile, setProfile] = useState({
    nama: "",
    asal_desa: "",
    no_whatsapp: "",
    instagram: "",
    facebook: "",
    bio_toko: "",
    foto_profil: "",
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string>("");

  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    setUserEmail(user.email || "");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pengrajin`, {
        cache: "no-store",
      });
      const data = await res.json();
      const myProfile = data.find((p: any) => p.user_id === user.id);

      if (myProfile) {
        setProfile(myProfile);
        setPreviewFoto(myProfile.foto_profil);
      }
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const isTryingToChangePassword =
        passwords.old.trim() !== "" ||
        passwords.new.trim() !== "" ||
        passwords.confirm.trim() !== "";
      if (isTryingToChangePassword) {
        if (!passwords.old || !passwords.new || !passwords.confirm) {
          throw new Error(
            "Untuk mengganti password, Anda wajib mengisi ketiga kolom password!",
          );
        }
        if (passwords.new !== passwords.confirm) {
          throw new Error("Konfirmasi password baru tidak cocok!");
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: passwords.old,
        });

        if (signInError)
          throw new Error("Password lama yang Anda masukkan salah.");

        const { error: updateError } = await supabase.auth.updateUser({
          password: passwords.new,
        });

        if (updateError)
          throw new Error("Gagal mengganti password: " + updateError.message);
      }
      let finalFotoUrl = profile.foto_profil;
      if (fotoFile) {
        const fileExt = fotoFile.name.split(".").pop();
        const fileName = `profil-${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("foto-kain")
          .upload(fileName, fotoFile, { upsert: true });

        if (uploadError)
          throw new Error(
            "Gagal mengunggah foto profil: " + uploadError.message,
          );

        const { data: publicUrlData } = supabase.storage
          .from("foto-kain")
          .getPublicUrl(fileName);

        finalFotoUrl = publicUrlData.publicUrl;
      }
      const payload = {
        ...profile,
        foto_profil: finalFotoUrl,
        user_id: user.id,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pengrajin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Database error: ${errorText}`);
      }

      alert("🎉 Profil dan Pengaturan berhasil diperbarui!");
      setPasswords({ old: "", new: "", confirm: "" });
      router.push("/seller");
    } catch (err: any) {
      alert(`❌ TERJADI KESALAHAN:\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-500"
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
  );

  const EyeSlashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );

  return (
    <main className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100 mt-10 mb-20 font-sans">
      <button
        onClick={() => router.back()}
        className="text-gray-400 font-bold mb-4 block hover:text-[#7F1D1D] transition-colors"
      >
        &larr; Kembali ke Dashboard
      </button>
      <h1 className="font-serif text-3xl font-black text-[#7F1D1D] mb-6">
        Pengaturan Toko
      </h1>

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* BAGIAN FOTO PROFIL */}
        <div className="flex items-center space-x-6 pb-6 border-b border-gray-100">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-[#D97706] shrink-0">
            {previewFoto ? (
              <img
                src={previewFoto}
                alt="Profil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-bold bg-amber-50">
                👤
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-[#451A03] mb-2">
              Foto Profil Toko
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#FFFBEB] file:text-[#D97706] hover:file:bg-[#FEF3C7] cursor-pointer"
            />
            <p className="text-[10px] text-gray-500 mt-2 font-medium">
              Format: JPG, PNG (Maks 5MB)
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#451A03]">
                Nama Toko / Pengrajin
              </label>
              <input
                value={profile.nama}
                onChange={(e) =>
                  setProfile({ ...profile, nama: e.target.value })
                }
                className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:ring-[#D97706]"
                placeholder="Contoh: Tenun Ibu Dione"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#451A03]">
                Asal Daerah / Desa
              </label>
              <input
                value={profile.asal_desa}
                onChange={(e) =>
                  setProfile({ ...profile, asal_desa: e.target.value })
                }
                className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:ring-[#D97706]"
                placeholder="Contoh: Desa Niki-Niki, Soe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#451A03]">
              Bio & Cerita Toko
            </label>
            <textarea
              value={profile.bio_toko}
              onChange={(e) =>
                setProfile({ ...profile, bio_toko: e.target.value })
              }
              className="w-full border border-gray-200 p-3 rounded-xl mt-1 focus:ring-[#D97706]"
              rows={3}
              placeholder="Ceritakan sejarah dan visi toko Anda di sini..."
            />
          </div>
        </div>
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#7F1D1D]">
              Kontak Pemesanan
            </h2>
            <p className="text-xs text-gray-500 pb-2">
              Nomor ini akan dihubungi pembeli saat menekan tombol Beli.
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#451A03]">
              Nomor WhatsApp (Gunakan awalan 62)
            </label>
            <input
              value={profile.no_whatsapp}
              onChange={(e) =>
                setProfile({ ...profile, no_whatsapp: e.target.value })
              }
              className="w-full border border-gray-200 p-3 rounded-xl mt-1 bg-green-50 focus:ring-[#D97706]"
              placeholder="Contoh: 6281234567890"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-bold text-[#451A03]">
                Link Instagram
              </label>
              <input
                value={profile.instagram}
                onChange={(e) =>
                  setProfile({ ...profile, instagram: e.target.value })
                }
                className="w-full border border-gray-200 p-3 rounded-xl mt-1"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#451A03]">
                Link Facebook
              </label>
              <input
                value={profile.facebook}
                onChange={(e) =>
                  setProfile({ ...profile, facebook: e.target.value })
                }
                className="w-full border border-gray-200 p-3 rounded-xl mt-1"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 pt-6 border-t border-gray-80 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
          <div>
            <h2 className="text-lg font-bold text-[#7F1D1D]">Keamanan Akun</h2>
            <p className="text-xs text-gray-500 pb-2">
              Kosongkan ketiga kotak ini jika Anda tidak ingin mengubah
              password.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Password Saat Ini
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.old}
                onChange={(e) =>
                  setPasswords({ ...passwords, old: e.target.value })
                }
                className="w-full border border-gray-200 p-3 pr-12 rounded-xl"
                placeholder="Masukkan password lama"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-gray-700"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Password Baru
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 pr-12 rounded-xl"
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Konfirmasi Password Baru
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  className="w-full border border-gray-200 p-3 pr-12 rounded-xl"
                  placeholder="Ketik ulang password baru"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#D97706] text-white py-4 rounded-xl font-bold hover:bg-[#B45309] transition-colors shadow-md mt-8"
        >
          {loading ? "Menyimpan Perubahan..." : "Simpan Semua Perubahan"}
        </button>
      </form>
    </main>
  );
}
