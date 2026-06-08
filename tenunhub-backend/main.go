package main

// package yang digunakan
import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/lib/pq"
)

// =====================================================================
// 1. STRUKTUR DATA (STRUCT)
// =====================================================================

// struktur data pengrajin
type Pengrajin struct {
	ID         int    `json:"id"`
	UserID     string `json:"user_id"`
	Nama       string `json:"nama"`
	AsalDesa   string `json:"asal_desa"`
	TahunMulai int    `json:"tahun_mulai"`
	Role       string `json:"role"`
	NoWhatsapp string `json:"no_whatsapp"`
	Instagram  string `json:"instagram"`
	Facebook   string `json:"facebook"`
	FotoProfil string `json:"foto_profil"`
	BioToko    string `json:"bio_toko"`
	IsBanned   bool   `json:"is_banned"`
}

// struktur data kain tenun
type Tenun struct {
	ID            int      `json:"id"`
	NamaMotif     string   `json:"nama_motif"`
	JenisWarna    string   `json:"jenis_warna"`
	Harga         int      `json:"harga"`
	CulturalStory string   `json:"cultural_story"`
	ClickCount    int      `json:"click_count"`
	IsFeatured    bool     `json:"is_featured"`
	PengrajinID   int      `json:"pengrajin_id"`
	GenerateAI    bool     `json:"generate_ai"`
	ImageUrls     []string `json:"image_urls"` 
}

// struktur data untuk request dan response ke Google Gemini API
type GeminiReq struct {
	Contents []GeminiContent `json:"contents"`
}
type GeminiContent struct {
	Parts []GeminiPart `json:"parts"`
}
type GeminiPart struct {
	Text string `json:"text"`
}
type GeminiRes struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

// variabel global untuk koneksi database
var db *sql.DB

// =====================================================================
// 2. MIDDLEWARE (CORS & KEAMANAN)
// =====================================================================

// fungsi middleware untuk mengatasi masalah error CORS secara dinamis
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 🎯 Mengambil domain Frontend dari .env (Aman untuk Deploy)
		allowedOrigin := os.Getenv("FRONTEND_URL")
		if allowedOrigin == "" {
			allowedOrigin = "*" // Fallback ke "*" saat testing lokal agar HP tidak diblokir
		}

		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, Accept")
		
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

// fungsi middleware untuk memeriksa otentikasi pada rute yang membutuhkan akses terbatas
func requireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" || r.Method == "PUT" || r.Method == "DELETE" {
			token := r.Header.Get("Authorization")
			if token == "" {
				http.Error(w, "Akses Ditolak: Anda harus login sebagai pengrajin.", http.StatusUnauthorized)
				return
			}
		}
		next(w, r)
	}
}

// =====================================================================
// 3. FUNGSI AI GENERATOR
// =====================================================================

// fungsi gemini untuk racik cerita
func racikCeritaBudayaAI(motif, warna string) string {
	apiKey := os.Getenv("GEMINI_API_KEY")

	fmt.Println("LOG AI - Memulai proses AI...")
	fmt.Println("LOG AI - Panjang API Key terdeteksi:", len(apiKey), "karakter")

	if apiKey == "" {
		return fmt.Sprintf("Kain bermotif %s dengan warna %s. (Peringatan: Kunci API AI belum terdeteksi).", motif, warna)
	}

	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey
	prompt := fmt.Sprintf(`
Bertindaklah sebagai kurator utama museum budaya dunia dan penyair kelas internasional.
Tuliskan narasi singkat yang luar biasa indah tentang kain tenun bermotif '%s' dengan warna '%s'.
Narasi harus terasa:
- Mewah, artistik, dan berkelas.
- Sarat makna filosofis dan spiritual.
- Menggambarkan hubungan manusia, alam, leluhur, dan perjalanan waktu.
- Menggunakan metafora yang memikat dan menyentuh hati.
- Membuat pembaca seakan melihat, merasakan, dan menghargai nilai luhur di balik setiap helai benang.

Tulis dalam Bahasa Indonesia yang anggun dan berkelas.
Maksimal 5 kalimat.
Hasil akhir harus terasa seperti kutipan yang layak dipajang di museum, pameran budaya internasional, atau katalog warisan UNESCO.
`, motif, warna)

	reqBody := GeminiReq{
		Contents: []GeminiContent{
			{Parts: []GeminiPart{{Text: prompt}}},
		},
	}
	jsonData, _ := json.Marshal(reqBody)

	fmt.Println("LOG AI - Mengirim request ke Google Gemini...")
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))

	if err != nil {
		fmt.Println("ERROR JARINGAN KE GEMINI:", err)
		return fmt.Sprintf("Kain bermotif %s dengan warna %s. (Gagal memuat AI, jaringan bermasalah).", motif, warna)
	}
	defer resp.Body.Close()

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	respBodyString := buf.String()

	fmt.Printf("LOG AI - Status Code dari Google: %d\n", resp.StatusCode)

	if resp.StatusCode != 200 {
		fmt.Printf("❌ GOOGLE MENOLAK:\n%s\n", respBodyString)
		return fmt.Sprintf("Kain bermotif %s dengan warna %s. (Gagal memuat AI, status %d).", motif, warna, resp.StatusCode)
	}

	var resData GeminiRes
	if err := json.Unmarshal([]byte(respBodyString), &resData); err != nil {
		fmt.Println("❌ ERROR PARSING JSON:", err)
		return fmt.Sprintf("Kain bermotif %s dengan warna %s.", motif, warna)
	}

	if len(resData.Candidates) > 0 && len(resData.Candidates[0].Content.Parts) > 0 {
		fmt.Println("LOG AI - Berhasil meracik cerita!")
		return resData.Candidates[0].Content.Parts[0].Text
	}

	fmt.Println("ERROR: Respon Google kosong:", respBodyString)
	return "Cerita kebudayaan belum tersedia."
}

// =====================================================================
// 4. SERVER UTAMA (MAIN)
// =====================================================================

func main() {
	// Memuat file .env lokal (Jika ada)
	err := godotenv.Load()
	if err != nil {
		log.Println("Info: File .env lokal tidak ditemukan, menggunakan environment server cloud.")
	}

	// 🎯 Mengambil Koneksi DB dari variabel Environment (Sudah AMAN & Bersih 🔒)
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("❌ Error: DATABASE_URL tidak ditemukan di environment variable. Pastikan file .env sudah dikonfigurasi.")
	}

	var dbErr error
	db, dbErr = sql.Open("postgres", connStr)
	if dbErr != nil {
		log.Fatalf("Gagal membuka koneksi database: %v", dbErr)
	}
	defer db.Close()

	if dbErr = db.Ping(); dbErr != nil {
		log.Fatalf("Database tidak merespon: %v", dbErr)
	}

	fmt.Println("🚀 Berhasil terhubung ke Database Supabase!")

	// Routing API
	http.HandleFunc("/pengrajin", enableCORS(handlePengrajin))       
	http.HandleFunc("/tenun", enableCORS(requireAuth(handleTenun)))
	http.HandleFunc("/tenun/click", enableCORS(handleTenunClick))
	http.HandleFunc("/admin/featured", enableCORS(requireAuth(handleToggleFeatured)))
	http.HandleFunc("/admin/ban", enableCORS(requireAuth(handleToggleBan)))
	http.HandleFunc("/admin/stats", enableCORS(requireAuth(handleAdminStats)))

	// 🎯 Port Dinamis Menyesuaikan Cloud Hosting
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Port default untuk pengujian di komputer lokal
	}

	log.Printf("🔥 Server berjalan di port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// =====================================================================
// 5. KENDALI RUTE API (HANDLERS)
// =====================================================================

// Fungsi pengrajin untuk operasi CRUD
func handlePengrajin(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST": // Create profil pengrajin baru
		var p Pengrajin
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		} 

		query := `INSERT INTO pengrajin (user_id, nama, asal_desa, tahun_mulai, role, no_whatsapp, instagram, facebook, foto_profil, bio_toko) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
		_, err := db.Exec(query, p.UserID, p.Nama, p.AsalDesa, p.TahunMulai, p.Role, p.NoWhatsapp, p.Instagram, p.Facebook, p.FotoProfil, p.BioToko)
		if err != nil {
			http.Error(w, "Database Go Error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)

	case "PUT": // Update profil pengrajin
		var p Pengrajin
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if p.UserID == "" {
			http.Error(w, "UserID tidak boleh kosong", http.StatusBadRequest)
			return
		}

		query := `UPDATE pengrajin SET nama = $1, asal_desa = $2, tahun_mulai = $3, no_whatsapp = $4, instagram = $5, facebook = $6, foto_profil = $7, bio_toko = $8 WHERE user_id = $9`
		_, err := db.Exec(query, p.Nama, p.AsalDesa, p.TahunMulai, p.NoWhatsapp, p.Instagram, p.Facebook, p.FotoProfil, p.BioToko, p.UserID)
		if err != nil {
			http.Error(w, "Database Go Error (Update): "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Profil berhasil diperbarui"})

	case "GET": // Read profil pengrajin
		query := `SELECT id, user_id, COALESCE(nama, ''), COALESCE(asal_desa, ''), COALESCE(tahun_mulai, 0), COALESCE(role, ''), COALESCE(no_whatsapp, ''), COALESCE(instagram, ''), COALESCE(facebook, ''), COALESCE(foto_profil, ''), COALESCE(bio_toko, ''), COALESCE(is_banned, false) FROM pengrajin`
		rows, err := db.Query(query)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		list := []Pengrajin{}
		for rows.Next() {
			var p Pengrajin
			rows.Scan(&p.ID, &p.UserID, &p.Nama, &p.AsalDesa, &p.TahunMulai, &p.Role, &p.NoWhatsapp, &p.Instagram, &p.Facebook, &p.FotoProfil, &p.BioToko, &p.IsBanned)
			list = append(list, p)
		}
		json.NewEncoder(w).Encode(list)
	}
}

// Fungsi kain tenun untuk operasi CRUD dan fitur tambahan seperti generate cerita AI dan sorting
func handleTenun(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST": // Create kain tenun baru
		var t Tenun
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if t.GenerateAI {
			t.CulturalStory = racikCeritaBudayaAI(t.NamaMotif, t.JenisWarna)
		}

		query := `INSERT INTO tenun (nama_motif, jenis_warna, harga, cultural_story, click_count, is_featured, pengrajin_id, image_urls) VALUES ($1, $2, $3, $4, 0, $5, $6, $7)`
		_, err := db.Exec(query, t.NamaMotif, t.JenisWarna, t.Harga, t.CulturalStory, t.IsFeatured, t.PengrajinID, pq.Array(t.ImageUrls))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)

	case "PUT": // Update kain tenun        
		var t Tenun
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if t.GenerateAI {
			t.CulturalStory = racikCeritaBudayaAI(t.NamaMotif, t.JenisWarna)
		}

		query := `UPDATE tenun SET nama_motif = $1, jenis_warna = $2, harga = $3, cultural_story = $4, is_featured = $5, image_urls = $6 WHERE id = $7`
		_, err := db.Exec(query, t.NamaMotif, t.JenisWarna, t.Harga, t.CulturalStory, t.IsFeatured, pq.Array(t.ImageUrls), t.ID)
		if err != nil {
			http.Error(w, "Database Go Error (Update Tenun): "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Kain tenun berhasil diperbarui!"})

	case "DELETE": // Delete kain tenun
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, "ID Tenun harus disertakan", http.StatusBadRequest)
			return
		}

		query := `DELETE FROM tenun WHERE id = $1`
		_, err := db.Exec(query, id)
		if err != nil {
			http.Error(w, "Database Go Error (Delete Tenun): "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Kain tenun berhasil dihapus dari katalog"})

	case "GET": // Read daftar kain tenun dengan opsi sorting
		sortParam := r.URL.Query().Get("sort")
		orderClause := "ORDER BY id DESC"

		switch sortParam {
		case "terlaris":
			orderClause = "ORDER BY click_count DESC"
		case "termurah":
			orderClause = "ORDER BY harga ASC"
		case "termahal":
			orderClause = "ORDER BY harga DESC"
		}

		query := fmt.Sprintf(`SELECT id, COALESCE(nama_motif,''), COALESCE(jenis_warna,''), COALESCE(harga,0), COALESCE(cultural_story,''), COALESCE(click_count,0), COALESCE(is_featured,false), COALESCE(pengrajin_id,0), COALESCE(image_urls, '{}') FROM tenun %s`, orderClause)
		rows, err := db.Query(query)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var list []Tenun
		for rows.Next() {
			var t Tenun
			rows.Scan(&t.ID, &t.NamaMotif, &t.JenisWarna, &t.Harga, &t.CulturalStory, &t.ClickCount, &t.IsFeatured, &t.PengrajinID, pq.Array(&t.ImageUrls))
			list = append(list, t)
		}
		json.NewEncoder(w).Encode(list)
	}
}

// Fungsi untuk menangani penambahan click count saat kain tenun diklik oleh pengguna
func handleTenunClick(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
			return
	} 

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "ID Tenun harus disertakan", http.StatusBadRequest)
		return
	}

	query := `UPDATE tenun SET click_count = click_count + 1 WHERE id = $1`
	_, err := db.Exec(query, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Click count bertambah!"})
}

// =====================================================================
// 6. FITUR SUPER ADMIN
// =====================================================================

// Fungsi super admin untuk toggle status VIP produk tenun
func handleToggleFeatured(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}
	id := r.URL.Query().Get("id")
	query := `UPDATE tenun SET is_featured = NOT is_featured WHERE id = $1`
	_, err := db.Exec(query, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Status VIP produk berhasil diubah!"})
}

// Fungsi super admin untuk toggle status blokir akun pengrajin
func handleToggleBan(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}
	id := r.URL.Query().Get("id")
	query := `UPDATE pengrajin SET is_banned = NOT is_banned WHERE id = $1`
	_, err := db.Exec(query, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Status blokir akun berhasil diubah!"})
}

// Fungsi super admin untuk melihat statistik umum tentang jumlah kain tenun dan pengrajin yang terdaftar di platform
func handleAdminStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	var totalKain, totalPengrajin int
	db.QueryRow(`SELECT COUNT(*) FROM tenun`).Scan(&totalKain)
	db.QueryRow(`SELECT COUNT(*) FROM pengrajin`).Scan(&totalPengrajin)

	stats := map[string]interface{}{
		"total_kain":      totalKain,
		"total_pengrajin": totalPengrajin,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(stats)
}