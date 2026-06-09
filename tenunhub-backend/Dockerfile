# ==========================================
# STAGE 1: Proses Build (Merakit Kodingan)
# ==========================================
FROM golang:1.26-alpine AS builder

# Menentukan folder kerja di dalam kontainer
WORKDIR /app

# Menyalin file modul terlebih dahulu (untuk efisiensi cache)
COPY go.mod go.sum ./
RUN go mod download

# Menyalin seluruh kodingan backend kamu
COPY . .

# Merakit aplikasi menjadi satu file binary bernama "main"
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# ==========================================
# STAGE 2: Proses Jalankan (Server Produksi)
# ==========================================
FROM alpine:latest

WORKDIR /root/

# Mengambil hasil rakitan "main" dari Stage 1
COPY --from=builder /app/main .

# Membuka port 8080 agar bisa diakses internet
EXPOSE 8080

# Perintah utama untuk menyalakan server saat kontainer hidup
CMD ["./main"]