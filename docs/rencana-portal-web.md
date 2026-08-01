# Rencana Rombak Portal Desa Cirangkong

Dokumen ini merangkum hasil diskusi perencanaan rombak landing page & pembuatan portal resmi Pemerintah Desa Cirangkong, berdasarkan project SADESA yang sudah ada.

---

## 1. Latar Belakang

- Project semester **SADESA** (Sahabat Digital Desa) — sistem administrasi & layanan digital untuk Desa Cirangkong, Kec. Cijambe, Kab. Subang — sudah selesai dikerjakan untuk keperluan nilai semester.
- Rencana awal SADESA: web + mobile. Mobile belum memungkinkan dikerjakan, jadi fokus dialihkan ke web saja.
- Repo project dipisah dari repo awal (yang sudah selesai semester), disisakan bagian **Laravel + Inertia + React**-nya saja: [`github.com/kurtubi-dev/sadesa-web`](https://github.com/kurtubi-dev/sadesa-web)
- Fokus pengerjaan kemarin: fitur **berita** dan **halaman admin/backend**. Tampilan landing page publik belum disentuh (kecuali bagian berita).
- Masalah utama: landing page yang ada sekarang terasa seperti **halaman promosi produk/aplikasi SaaS** ("Sistem Administrasi Desa Cirangkong", CTA "Masuk ke Dashboard", copy soal fitur software), bukan **website resmi pemerintahan desa**.

**Tujuan:** merombak identitas & struktur situs supaya menjadi portal informasi resmi Pemerintah Desa Cirangkong — sesuai pola umum website desa/kecamatan di Indonesia (referensi: jabarprov.go.id, glagaharjosid.slemankab.go.id, kec-dlingo.bantulkab.go.id).

---

## 2. Keputusan Arsitektur

| Keputusan | Pilihan |
|---|---|
| Repo | **Satu repo yang sama** (`sadesa-web`), bukan repo terpisah |
| Struktur kode | Diisolasi di folder/namespace baru **`portal/`** (controller & halaman React terpisah dari modul lama) |
| Layout halaman | **Multi-halaman** (tiap menu = URL sendiri), bukan single-page scroll — kesan lebih profesional/institusional |
| Hosting | Belum ditentukan (anggaran dari desa belum ada). Kandidat: Hostinger, RumahWeb, Biznet (disk persisten) vs free tier Railway/Render/Google Cloud trial (filesystem ephemeral) |
| Storage file | Pakai **Laravel `Storage` facade** (disk-agnostic), bukan hardcode path — supaya gampang pindah disk (local ⇄ S3-compatible/R2/B2) kapan pun tanpa ubah kode controller |

**Alasan satu repo, bukan repo terpisah:** kalau dipisah, tombol "Ajukan Surat/Laporan" di portal nantinya harus manggil API lintas aplikasi + urus autentikasi lintas app (butuh SSO/token sharing), plus 2x hosting, 2x deployment, 2x testing. Dengan satu repo, begitu modul layanan (fase 2) diaktifkan, semuanya otomatis nyambung karena satu database yang sama — kerjaan kamu di folder `portal/` tetap terisolasi dan aman dari modul lama.

---

## 3. Audit: Yang Sudah Ada di `sadesa-web` (dipakai ulang, tidak dibangun ulang)

| Modul | Lokasi di repo | Status |
|---|---|---|
| Berita/Pengumuman/Galeri ("Konten Desa") | `InformasiController`, `informasi/index.tsx`, `informasi/show.tsx`, `admin/konten.tsx` | Sudah dinamis + admin panel, tinggal restyle tampilan publik |
| Buku Tamu | `buku-tamu.tsx` (publik), `admin/buku-tamu.tsx` | Sudah jalan |
| Pengaturan Desa (identitas: nama desa, kecamatan, kabupaten, alamat, telp, email, nama kades) | `admin/pengaturan.tsx`, settings key-value (`[key: string]: string`) | Sudah ada, fleksibel ditambah field baru tanpa migration baru |
| Data Master (wilayah desa/dusun/RW/RT, kategori pengaduan) | `admin/data-master.tsx` | Sudah ada |
| Master Surat & Template Surat | `admin/master-surat.tsx`, `master-surat-template.tsx` | Sudah ada — **ditunda ke fase 2** |
| Pengaduan/Laporan | `admin/pengaduan.tsx`, `admin/pengaduan-detail.tsx` | Sudah ada — **ditunda ke fase 2** |
| Verifikasi Warga, Users, Audit Log, Broadcast | `admin/*` | Sudah ada, untuk manajemen internal |
| Dashboard Kepala Desa (role internal) | `pages/kepala-desa/*` (pengajuan, statistik, ulasan) | Dashboard internal untuk role Kepala Desa (approve surat dll) — **bukan** halaman publik profil kepala desa |

---

## 4. Yang Perlu Dibangun Baru (Fase 1 — Portal Informasi)

### 4.1 Layout & Komponen Fondasi
Dibangun duluan karena dipakai berulang di semua halaman:
- `PortalLayout` — bungkus Navbar + Footer
- `Navbar` — dropdown/megamenu: Profil, Pemerintahan, Informasi, Layanan
- `Footer` — alamat, kontak, medsos, link cepat, statistik pengunjung
- `HeroSection` — khusus Beranda
- `PageHeader` — judul halaman + breadcrumb, dipakai di semua halaman selain Beranda

### 4.2 Halaman & Routing

```
/                          → Beranda
/profil                    → Profil Desa (sejarah, visi-misi, geografis, demografi)
/pemerintahan              → Struktur organisasi + Perangkat Desa
/pemerintahan/bpd          → BPD (Badan Permusyawaratan Desa)
/pemerintahan/lembaga      → Lembaga Desa (PKK, Karang Taruna, LPM, dll)
/informasi/berita          → List berita (reuse InformasiController lama)
/informasi/berita/{slug}   → Detail berita
/informasi/pengumuman      → List pengumuman
/informasi/agenda          → Agenda kegiatan
/informasi/galeri          → Galeri foto/video
/layanan                   → Katalog layanan — PLACEHOLDER "Segera Hadir" (fase 1)
/kontak                    → Kontak + Buku Tamu (reuse BukuTamuController lama)
```

### 4.3 Struktur Data Baru

**Tabel `pejabat`** (satu tabel untuk Perangkat Desa, BPD, dan Lembaga Desa):
- `kategori` (enum: `perangkat_desa` / `bpd` / `lembaga_desa`)
- `nama`, `jabatan`, `foto`, `kontak`, `urutan`

Alasan satu tabel: strukturnya sama (daftar orang/organisasi dengan jabatan), tinggal filter berdasarkan kategori di tiap halaman (`/pemerintahan`, `/pemerintahan/bpd`, `/pemerintahan/lembaga`). Kalau kontennya nanti ternyata tipis, halaman tetap jalan tanpa perlu redesain struktur data.

**Profil Desa** — perluasan tabel Pengaturan Desa (settings key-value) yang sudah ada, dengan field tambahan: `sejarah`, `visi`, `misi`, `geografis`, `demografi` (rich text). Dipilih **fixed field**, bukan page-builder, karena kontennya predictable dan belum ada kebutuhan variasi section per desa.

### 4.4 Halaman Layanan (Placeholder)
- Desa belum akan menggunakan layanan surat/laporan online untuk saat ini
- Halaman `/layanan` tetap dibuat dan tampil di navbar, tapi isinya kartu status "Segera Hadir" untuk tiap jenis layanan (bukan form pengajuan aktif)
- Dipisah 2 kategori sesuai struktur SADESA: **Surat** dan **Laporan/Pengaduan** (dua modul terpisah, bukan digabung)

---

## 5. Fase 2 (Nanti — Setelah Portal Fase 1 Stabil)

- Sambungkan halaman `/layanan` ke modul **Master Surat** & **Pengaduan** yang sudah ada di `sadesa-web`
- Aktifkan alur pengajuan (auth warga, verifikasi warga, antrean)
- Karena satu repo & satu database, integrasi ini tinggal ganti isi controller `/layanan` untuk menarik data asli — tampilan tidak perlu dirombak ulang

## 6. Ditunda — Menunggu Konfirmasi Data dari Pihak Desa

- **Transparansi/Publikasi** — APBDes, produk hukum desa (Perdes/SK), dokumen perencanaan (RPJMDes/RKPDes), LPPDes
- **Potensi Desa** — UMKM, wisata, produk unggulan

---

## 7. Urutan Pengerjaan yang Disarankan

1. Layout fondasi (Navbar, Footer, PageHeader)
2. Beranda (bisa dengan placeholder di section yang datanya belum lengkap)
3. Profil Desa (statis, cepat kelar — cuma perluasan settings)
4. Pemerintahan/Struktur (tabel `pejabat` + CRUD admin + 3 halaman publik)
5. Informasi (restyle tampilan publik, backend sudah ada)
6. Layanan (placeholder — paling ringan)
7. Kontak (reuse data settings + Buku Tamu)

---

## 8. Poin yang Masih Terbuka

- Detail konten Profil & Pemerintahan (seberapa panjang sejarah, jumlah perangkat/BPD/lembaga) belum diketahui — mempengaruhi apakah sub-halaman Pemerintahan nanti terasa "tipis", tapi struktur data yang dipilih sudah cukup fleksibel untuk kedua kemungkinan
- Keputusan hosting final belum diambil — menunggu anggaran dari desa
- Konten Transparansi & Potensi Desa menunggu konfirmasi dari pihak desa
