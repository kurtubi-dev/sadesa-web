<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class AppSettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // ── Kop Surat ──────────────────────────────────────────────────────
            'kop_jabatan'   => 'KEPALA DESA',
            'kop_nama_desa' => 'CIRANGKONG',
            'kop_kecamatan' => 'CIJAMBE',
            'kop_kabupaten' => 'SUBANG',
            'kop_alamat'    => 'Jln. Raya Lempar - Cirangkong Km. 08 Cijambe - Subang',
            'kop_telepon'   => '',
            'kop_fax'       => '',
            'kop_kode_pos'  => '41285',
            'kop_website'   => '',
            'kop_email'     => '',
            'kop_logo_path' => 'images/logo-kab-subang.png',

            // ── Kepala Desa ────────────────────────────────────────────────────
            'kades_nama'    => 'Asep Sutia',
            'kades_nip'     => '',
            'kades_jabatan' => 'Kepala Desa Cirangkong',

            // ── Profil Desa Cirangkong ──────────────────────────────────────────
            'profil_sejarah' => '<p>Desa Cirangkong secara historis terbentuk sejak masa kolonial Belanda, di mana wilayah ini awalnya merupakan kawasan perkebunan dan pertanian yang subur di perbukitan Kecamatan Cijambe. Seiring waktu, para sesepuh dan warga bersepakat mendirikan pemukiman teratur yang mandiri hingga resmi diakui sebagai desa administratif. Nama Cirangkong sendiri dipercaya berasal dari gabungan kata Sunda yang merujuk pada aliran air bersih (ci) dan struktur pepohonan atau bambu penyangga (rangkong) yang banyak ditemukan di kawasan ini.</p>',
            'profil_visi' => '<p>Mewujudkan Desa Cirangkong yang Mandiri, Sejahtera, dan Berbudaya melalui Digitalisasi Layanan serta Optimalisasi Potensi Pertanian dan Kemitraan Warga.</p>',
            'profil_misi' => '<ol><li>Meningkatkan kualitas tata kelola pemerintahan desa yang bersih, transparan, dan responsif berbasis teknologi informasi.</li><li>Mengembangkan potensi pertanian rakyat dan UMKM lokal guna memperkuat perekonomian desa yang mandiri.</li><li>Membangun infrastruktur desa yang merata, aman, dan berwawasan lingkungan.</li><li>Memelihara nilai-nilai budaya gotong royong dan keagamaan warga Desa Cirangkong.</li></ol>',
            'profil_geografis' => '<p>Desa Cirangkong terletak di wilayah perbukitan Kecamatan Cijambe, Kabupaten Subang, Jawa Barat, dengan ketinggian rata-rata 300-500 meter di atas permukaan laut. Wilayah ini berbatasan langsung dengan kawasan hutan lindung di sebelah selatan, perkebunan teh di barat, serta desa tetangga di utara dan timur. Sebagian besar wilayah desa berupa tanah darat, persawahan, dan perkebunan hortikultura yang sangat produktif.</p>',
            'profil_demografi' => '<p>Berdasarkan data kependudukan terbaru tahun 2026, Desa Cirangkong memiliki populasi sekitar 4.250 jiwa yang terbagi ke dalam 1.320 Kepala Keluarga (KK). Mayoritas penduduk bekerja di sektor pertanian (petani padi, manggis, cengkeh, dan hortikultura), diikuti oleh sektor buruh harian, UMKM, dan sebagian kecil sebagai ASN/karyawan swasta. Tingkat partisipasi masyarakat dalam kegiatan kemasyarakatan dan gotong royong tergolong sangat tinggi.</p>',
        ];

        foreach ($defaults as $key => $value) {
            AppSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->command->info('AppSettingSeeder: kop surat defaults seeded.');
    }
}
