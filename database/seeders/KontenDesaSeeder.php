<?php

namespace Database\Seeders;

use App\Models\KontenDesa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KontenDesaSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil salah satu admin untuk dijadikan penulis
        $admin = User::where('role', 'admin')->first() ?? User::first();

        if (!$admin) {
            $this->command->warn('KontenDesaSeeder: Tidak ada user admin ditemukan. Seeding dibatalkan.');
            return;
        }

        // Copy placeholder photo from public images to storage for content preview
        $fotoPath = null;
        $destDir = storage_path('app/public/konten');
        
        if (!file_exists($destDir)) {
            mkdir($destDir, 0755, true);
        }

        if (file_exists(public_path('images/poto-place.png'))) {
            copy(public_path('images/poto-place.png'), $destDir . '/poto-place.png');
            $fotoPath = 'konten/poto-place.png';
        }

        $items = [
            // ── BERITA ──────────────────────────────────────────────────────────
            [
                'judul' => 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap 1',
                'tipe' => 'berita',
                'konten' => '<p>Pemerintah Desa Cirangkong telah sukses melaksanakan penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap 1 untuk tahun anggaran berjalan. Kegiatan ini dihadiri langsung oleh Kepala Desa Cirangkong, Pendamping Desa, serta perwakilan dari Kecamatan Cijambe.</p><p>Sebanyak 80 Keluarga Penerima Manfaat (KPM) menerima bantuan sebesar Rp 300.000,- per bulan. Penyaluran berjalan dengan tertib dan menerapkan transparansi publik yang ketat.</p><p>Diharapkan bantuan ini dapat membantu meringankan beban ekonomi warga yang benar-benar membutuhkan, khususnya untuk pemenuhan kebutuhan pangan sehari-hari.</p>',
                'status' => 'published',
                'kategori' => 'Bantuan Sosial',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Pemerintah Desa Cirangkong menyalurkan BLT Dana Desa Tahap 1 kepada 80 Keluarga Penerima Manfaat secara tertib dan transparan.',
                'is_featured' => true,
                'views_count' => 142,
            ],
            [
                'judul' => 'Panen Raya Padi Petani Desa Cirangkong Alami Peningkatan Hasil',
                'tipe' => 'berita',
                'konten' => '<p>Para petani di Desa Cirangkong, Kecamatan Cijambe tersenyum lebar menyusul pelaksanaan panen raya padi musim ini. Berkat bimbingan intensif dari tim penyuluh pertanian daerah, pola tanam yang teratur, serta kecukupan pasokan pupuk organik, produktivitas padi melonjak hingga 15%.</p><p>Hasil ubinan menunjukkan rata-rata produksi mencapai 6,8 ton per hektar gabah kering giling. Kepala Desa Cirangkong menyatakan komitmennya untuk terus mendukung sarana dan prasarana irigasi guna mempertahankan swasembada pangan di tingkat desa.</p>',
                'status' => 'published',
                'kategori' => 'Pertanian',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Panen raya padi di Desa Cirangkong mencatat peningkatan produktivitas hingga 15% berkat pembinaan intensif dan pupuk organik.',
                'is_featured' => false,
                'views_count' => 89,
            ],
            [
                'judul' => 'Pembangunan Jalan Lingkungan Dusun Pasiripis Mulai Direalisasikan',
                'tipe' => 'berita',
                'konten' => '<p>Realisasi Dana Desa infrastruktur tahun ini mulai difokuskan pada pengaspalan jalan lingkungan di Dusun Pasiripis RT 03/RW 01. Jalan sepanjang 450 meter yang sebelumnya berupa tanah becek kini telah dilapisi aspal hotmiks.</p><p>Pembangunan ini menggunakan sistem padat karya tunai yang melibatkan langsung warga setempat sebagai tenaga kerja guna memberikan pemasukan tambahan bagi masyarakat desa.</p>',
                'status' => 'published',
                'kategori' => 'Infrastruktur',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Jalan lingkungan sepanjang 450 meter di Dusun Pasiripis diaspal menggunakan sistem padat karya Dana Desa Cirangkong.',
                'is_featured' => false,
                'views_count' => 64,
            ],
            [
                'judul' => 'Pelatihan UMKM Desa Cirangkong: Go Digital Menuju Pasar Nasional',
                'tipe' => 'berita',
                'konten' => '<p>Guna meningkatkan daya saing produk lokal, Pemerintah Desa Cirangkong bekerja sama dengan dinas koperasi mengadakan pelatihan digitalisasi UMKM. Peserta diajarkan teknik foto produk yang menarik, pengelolaan akun media sosial bisnis, serta pendaftaran di marketplace nasional.</p><p>Berbagai produk unggulan desa seperti keripik pisang, kerajinan bambu, dan madu hutan diharapkan dapat dipasarkan secara lebih luas pasca pelatihan ini.</p>',
                'status' => 'published',
                'kategori' => 'Ekonomi',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Pemerintah Desa Cirangkong membekali pelaku UMKM lokal dengan keterampilan digitalisasi pemasaran untuk menembus pasar nasional.',
                'is_featured' => false,
                'views_count' => 112,
            ],
            [
                'judul' => 'Pemeriksaan Kesehatan Gratis Lansia dan Balita di Posyandu Melati',
                'tipe' => 'berita',
                'konten' => '<p>Kader PKK bekerja sama dengan UPTD Puskesmas Cijambe kembali menyelenggarakan pos pelayanan terpadu bulanan di Posyandu Melati. Selain pemeriksaan tinggi & berat badan balita untuk pencegahan stunting, kegiatan kali ini mencakup cek darah, asam urat, dan pembagian vitamin gratis bagi warga lanjut usia (lansia).</p><p>Tingkat kehadiran warga sangat tinggi mencapai lebih dari 95 orang.</p>',
                'status' => 'published',
                'kategori' => 'Kesehatan',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Posyandu Melati menggelar pemeriksaan gratis untuk deteksi dini penyakit lansia serta pencegahan stunting pada balita.',
                'is_featured' => false,
                'views_count' => 73,
            ],
            [
                'judul' => 'Peningkatan Sistem Keamanan Lingkungan Melalui Pos Ronda Aktif',
                'tipe' => 'berita',
                'konten' => '<p>Babinsa dan Bhabinkamtibmas Desa Cirangkong mengapresiasi keaktifan warga dalam melaksanakan ronda malam. Sinergi ini terbukti efektif menekan angka kriminalitas dan menjaga ketenteraman warga sepanjang malam. Pihak desa juga memberikan stimulan berupa perlengkapan senter dan jas hujan bagi pos ronda aktif.</p>',
                'status' => 'published',
                'kategori' => 'Keamanan',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Sinergi warga dan aparat keamanan menjaga ketertiban lingkungan Desa Cirangkong lewat ronda malam aktif di setiap RT.',
                'is_featured' => false,
                'views_count' => 52,
            ],

            // ── PENGUMUMAN ──────────────────────────────────────────────────────
            [
                'judul' => 'Pengumuman Kerja Bakti Massal Menyambut HUT Kemerdekaan RI',
                'tipe' => 'pengumuman',
                'konten' => '<p>Diberitahukan kepada seluruh warga Desa Cirangkong, dalam rangka menyambut Hari Ulang Tahun (HUT) Kemerdekaan Republik Indonesia, kita akan mengadakan kegiatan kerja bakti pembersihan saluran air, pengecatan gapura, dan pemasangan bendera merah putih serentak.</p><p><strong>Hari/Tanggal:</strong> Minggu depan<br><strong>Waktu:</strong> Pukul 07.00 WIB - Selesai<br><strong>Lokasi:</strong> Lingkungan RT/RW masing-masing.</p><p>Dimohon kebersamaan seluruh warga untuk hadir demi keindahan desa kita tercinta.</p>',
                'status' => 'published',
                'kategori' => 'Umum',
                'gambar_utama' => null,
                'meta_description' => 'Kerja bakti massal warga Desa Cirangkong untuk membersihkan jalan dan memasang atribut kemerdekaan RI.',
                'is_featured' => false,
                'views_count' => 195,
            ],
            [
                'judul' => 'Pendaftaran Program Sertifikat Tanah Gratis (PTSL) Tahun Anggaran Ini',
                'tipe' => 'pengumuman',
                'konten' => '<p>Disampaikan kepada masyarakat Desa Cirangkong yang belum memiliki sertifikat hak milik atas tanahnya, bahwa pendaftaran kuota program Pendaftaran Tanah Sistematis Lengkap (PTSL) telah dibuka kembali.</p><p>Warga yang berminat harap segera mengumpulkan berkas persyaratan ke kantor balai desa berupa: fotokopi KTP, KK, SPPT PBB, surat pernyataan kepemilikan, dan bukti batas tanah.</p>',
                'status' => 'published',
                'kategori' => 'Umum',
                'gambar_utama' => null,
                'meta_description' => 'Informasi syarat dan batas pengumpulan berkas pendaftaran PTSL gratis Desa Cirangkong.',
                'is_featured' => false,
                'views_count' => 312,
            ],
            [
                'judul' => 'Himbauan Kewaspadaan Dini Menghadapi Musim Pancaroba',
                'tipe' => 'pengumuman',
                'konten' => '<p>Mengingat masuknya musim pancaroba dengan intensitas hujan tinggi disertai angin kencang, warga dihimbau untuk memangkas dahan pohon yang rimbun di dekat atap rumah, membersihkan saluran pembuangan air agar tidak tersumbat, serta menjaga kebersihan wadah air guna mengantisipasi perkembangbiakan nyamuk Demam Berdarah (DBD).</p>',
                'status' => 'published',
                'kategori' => 'Umum',
                'gambar_utama' => null,
                'meta_description' => 'Himbauan resmi dari kepala desa untuk menjaga keselamatan rumah dan kesehatan dari wabah DBD saat musim hujan.',
                'is_featured' => false,
                'views_count' => 105,
            ],
            [
                'judul' => 'Pengumuman Jadwal Pelayanan Administrasi Selama Libur Cuti Bersama',
                'tipe' => 'pengumuman',
                'konten' => '<p>Sehubungan dengan libur nasional dan cuti bersama, kantor kepala desa akan tutup sementara waktu. Namun untuk kebutuhan darurat seperti pengurusan surat pengantar pemakaman atau rujukan rumah sakit darurat, warga dapat menghubungi kepala dusun (kadus) masing-masing melalui nomor kontak siaga darurat.</p>',
                'status' => 'published',
                'kategori' => 'Umum',
                'gambar_utama' => null,
                'meta_description' => 'Pemberitahuan operasional pelayanan kantor desa selama cuti bersama nasional.',
                'is_featured' => false,
                'views_count' => 78,
            ],

            // ── AGENDA / EVENTS (Berita / Pengumuman yang memiliki tanggal event) ──
            [
                'judul' => 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) RKPDes',
                'tipe' => 'pengumuman',
                'konten' => '<p>Undangan resmi bagi seluruh Ketua RT, RW, Tokoh Masyarakat, Keterwakilan Perempuan, BPD, dan Lembaga Kemasyarakatan Desa untuk menghadiri Musrenbangdes pembahasan rencana kerja pembangunan desa (RKPDes) tahun depan.</p><p>Kehadiran Anda sangat menentukan arah kebijakan pembangunan desa kita.</p>',
                'status' => 'published',
                'kategori' => 'Umum',
                'gambar_utama' => null,
                'meta_description' => 'Rapat Musrenbangdes pembahasan prioritas pembangunan fisik dan ekonomi tahun depan.',
                'event_tanggal' => date('Y-m-d', strtotime('+5 days')),
                'event_lokasi' => 'Aula Balai Desa Cirangkong',
                'is_featured' => false,
                'views_count' => 87,
            ],
            [
                'judul' => 'Sosialisasi Bahaya Penyalahgunaan Narkoba Bagi Pemuda Karang Taruna',
                'tipe' => 'berita',
                'konten' => '<p>Pemerintah Desa Cirangkong menyelenggarakan sosialisasi pencegahan narkoba bekerja sama dengan Badan Narkotika Kabupaten (BNK). Dihadiri oleh seluruh anggota Karang Taruna Wira Karya serta pelajar sekolah menengah.</p><p>Acara ini diisi materi interaktif, pemutaran video edukatif, dan deklarasi komitmen bersama antinarkoba.</p>',
                'status' => 'published',
                'kategori' => 'Keamanan',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Sosialisasi pencegahan narkoba bagi generasi muda Desa Cirangkong.',
                'event_tanggal' => date('Y-m-d', strtotime('+12 days')),
                'event_lokasi' => 'Gedung Olahraga (GOR) Desa Cirangkong',
                'is_featured' => false,
                'views_count' => 64,
            ],
            [
                'judul' => 'Kegiatan Senam Jantung Sehat Bersama Ibu-ibu PKK Cirangkong',
                'tipe' => 'berita',
                'konten' => '<p>Ayo ikuti kegiatan senam jantung sehat bersama instruktur profesional yang diadakan rutin oleh pengurus PKK Desa Cirangkong. Terbuka gratis untuk seluruh warga masyarakat, disediakan air mineral dan doorprize menarik.</p>',
                'status' => 'published',
                'kategori' => 'Kesehatan',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Senam bersama kebugaran lansia dan ibu-ibu PKK Desa Cirangkong.',
                'event_tanggal' => date('Y-m-d', strtotime('+2 days')),
                'event_lokasi' => 'Halaman Balai Desa Cirangkong',
                'is_featured' => false,
                'views_count' => 93,
            ],
            [
                'judul' => 'Peringatan Isra Miraj Nabi Muhammad SAW Tingkat Desa Cirangkong',
                'tipe' => 'berita',
                'konten' => '<p>Panitia Hari Besar Islam (PHBI) mengundang kaum muslimin dan muslimat Desa Cirangkong untuk menghadiri pengajian akbar peringatan Isra Miraj yang akan menghadirkan penceramah kondang dari kota Bandung.</p>',
                'status' => 'published',
                'kategori' => 'Umum',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Peringatan Isra Miraj nabi Muhammad SAW tingkat Desa Cirangkong di masjid jami.',
                'event_tanggal' => date('Y-m-d', strtotime('+8 days')),
                'event_lokasi' => 'Masjid Jami Al-Hidayah Cirangkong',
                'is_featured' => false,
                'views_count' => 120,
            ],

            // ── GALLERY DATA (Berita yang kaya akan gambar) ──
            [
                'judul' => 'Dokumentasi Turnamen Sepak Bola Kades Cup Desa Cirangkong',
                'tipe' => 'berita',
                'konten' => '<p>Berikut adalah kilasan galeri foto kemeriahan pertandingan final turnamen sepak bola Kades Cup yang mempertemukan kesebelasan Dusun I dan Dusun III. Pertandingan berakhir dramatis melalui adu penalti yang dimenangkan oleh Dusun I.</p><p>Piala bergilir diserahkan langsung oleh Kepala Desa Cirangkong kepada kapten tim pemenang.</p>',
                'status' => 'published',
                'kategori' => 'Umum',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Galeri dokumentasi kemeriahan final turnamen sepak bola antar dusun Kades Cup.',
                'is_featured' => false,
                'views_count' => 155,
            ],
            [
                'judul' => 'Penyaluran Program PMT Pencegahan Stunting Bagi Ibu Hamil',
                'tipe' => 'berita',
                'konten' => '<p>Foto dokumentasi penyaluran paket Makanan Tambahan (PMT) berupa susu formula khusus, telur, dan buah-buahan untuk meningkatkan nutrisi ibu hamil dengan resiko kurang energi kronis (KEK). Program ini dikawal ketat oleh bidan desa.</p>',
                'status' => 'published',
                'kategori' => 'Kesehatan',
                'gambar_utama' => $fotoPath,
                'meta_description' => 'Dokumentasi foto pembagian paket makanan tambahan PMT stunting di posyandu.',
                'is_featured' => false,
                'views_count' => 45,
            ],
        ];

        foreach ($items as $item) {
            KontenDesa::create([
                'admin_id' => $admin->id,
                'judul' => $item['judul'],
                'slug' => Str::slug($item['judul']),
                'tipe' => $item['tipe'],
                'konten' => $item['konten'],
                'status' => $item['status'],
                'kategori' => $item['kategori'] ?? 'Umum',
                'gambar_utama' => $item['gambar_utama'] ?? null,
                'meta_description' => $item['meta_description'] ?? null,
                'event_tanggal' => $item['event_tanggal'] ?? null,
                'event_lokasi' => $item['event_lokasi'] ?? null,
                'is_featured' => $item['is_featured'] ?? false,
                'views_count' => $item['views_count'] ?? 0,
            ]);
        }

        $this->command->info('KontenDesaSeeder: Berhasil menambahkan berita, pengumuman, agenda, dan galeri dummy baru.');
    }
}