# 🧶 TenunHub - Karyanya Tenun, Ceritanya Kita

TenunHub adalah sebuah platform e-commerce dan galeri digital yang didedikasikan untuk melestarikan warisan budaya tenun nusantara (khususnya Tanah Timor). Platform ini menghubungkan pengrajin lokal langsung dengan pembeli, serta dilengkapi dengan kecerdasan buatan (AI) untuk meracik cerita budaya di balik setiap helai kain.

## ✨ Fitur Utama

- **Katalog & Galeri Interaktif:** Jelajahi mahakarya tenun dengan fitur pencarian cepat (berdasarkan motif atau nama pengrajin) dan pengurutan cerdas.
- **AI Cultural Story Generator:** Integrasi dengan Google Gemini AI untuk menghasilkan narasi filosofis dan puitis tentang makna motif dan warna kain secara otomatis.
- **Dasbor Pengrajin (Mitra):** Sistem manajemen toko bagi pengrajin untuk mengunggah foto kain (mendukung _multiple upload_), mengatur harga, dan mengedit profil toko.
- **Pembelian via WhatsApp:** Mengarahkan pembeli langsung ke WhatsApp pengrajin untuk transaksi yang personal dan tanpa potongan komisi.
- **Ruang Kendali Dewa (Super Admin):** Dasbor khusus pemilik sistem untuk mengelola akun (Blokir/Pulihkan) dan mengangkat karya menjadi _Masterpiece_ (VIP).
- **Keamanan Lapis Ganda:** Autentikasi dan penyimpanan data didukung penuh oleh Supabase.

---

## 🛠️ Tech Stack

### Frontend (User Interface)

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **BaaS (Auth & Storage):** [Supabase](https://supabase.com/)

### Backend (API & Database)

- **Language:** Golang (Go)
- **Database:** PostgreSQL (via Supabase)
- **AI Integration:** Google Gemini API
- **Router/HTTP:** `net/http` (Standard Library)

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

Proyek ini terbagi menjadi dua bagian: `tenunhub-frontend` dan `tenunhub-backend`. Keduanya harus berjalan secara bersamaan.

### 1. Persiapan Database & API Keys

Sebelum memulai, pastikan Anda telah memiliki:

- Akun dan Proyek di [Supabase](https://supabase.com/).
- URL Database PostgreSQL dari Supabase.
- API Key dari [Google Gemini Studio](https://aistudio.google.com/).

### 2. Setup Backend (Golang)

Buka terminal dan arahkan ke folder backend:

```bash
cd tenunhub-backend
```

Buat file `.env` di dalam folder `tenunhub-backend` dan isi dengan konfigurasi berikut:

```env
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres
GEMINI_API_KEY=api_key_gemini_anda
FRONTEND_URL=http://localhost:3000
PORT=8080
```

Jalankan server backend:

```bash
go mod tidy
go run main.go
```

_Backend akan berjalan di `http://localhost:8080`_

### 3. Setup Frontend (Next.js)

Buka terminal baru dan arahkan ke folder frontend:

```bash
cd tenunhub-frontend
```

Buat file `.env.local` di dalam folder `tenunhub-frontend` dan isi dengan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_supabase_anda
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Install dependensi dan jalankan server frontend:

```bash
npm install
npm run dev
```

_Frontend akan berjalan di `http://localhost:3000`_

---

## 📂 Struktur Direktori Utama

```text
TENUNHUB/
├── tenunhub-backend/      # API Server Golang
│   ├── main.go            # Logika utama (CRUD, Auth Middleware, AI Generator)
│   ├── .env               # Variabel lingkungan backend (Gitignored)
│   └── go.mod / go.sum    # Dependensi Go
│
└── tenunhub-frontend/     # Aplikasi Web Next.js
    ├── src/
    │   ├── app/           # Halaman Next.js (Admin, Kain, Pengrajin, Seller, Auth)
    │   ├── components/    # Reusable UI Components (Navbar, Modal, dll)
    │   └── lib/           # Konfigurasi Supabase Client
    ├── public/            # Aset statis (Gambar, Favicon)
    └── .env.local         # Variabel lingkungan frontend (Gitignored)
```

---

## 🔒 Catatan Keamanan & Deployment

- **Jangan pernah** mengunggah file `.env` atau `.env.local` ke _repository_ publik. Keduanya telah dimasukkan ke dalam `.gitignore`.
- Saat melakukan _deployment_ (misal ke Vercel untuk Frontend dan Railway/Render untuk Backend), masukkan variabel `.env` tersebut langsung ke dalam pengaturan _Environment Variables_ di dasbor layanan _hosting_ yang digunakan.
- Pastikan pengaturan **CORS** pada Golang dan **Redirect URLs** pada Supabase telah disesuaikan dengan domain _production_ Anda.

---

_Crafted by Apriliano_
