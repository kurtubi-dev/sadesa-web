<?php

namespace Database\Seeders;

use App\Models\Pejabat;
use Illuminate\Database\Seeder;

class PejabatSeeder extends Seeder
{
    public function run(): void
    {
        $pejabat = [
            // ── Perangkat Desa ────────────────────────────────────────────────
            [
                'kategori' => 'perangkat_desa',
                'nama' => 'Asep Sutia',
                'jabatan' => 'Kepala Desa',
                'foto' => null,
                'kontak' => '081234567890',
                'urutan' => 1,
            ],
            [
                'kategori' => 'perangkat_desa',
                'nama' => 'Mulyadi, S.IP',
                'jabatan' => 'Sekretaris Desa',
                'foto' => null,
                'kontak' => '081234567891',
                'urutan' => 2,
            ],
            [
                'kategori' => 'perangkat_desa',
                'nama' => 'Hendra Kurnia',
                'jabatan' => 'Kaur Keuangan',
                'foto' => null,
                'kontak' => '081234567892',
                'urutan' => 3,
            ],
            [
                'kategori' => 'perangkat_desa',
                'nama' => 'Siti Aminah',
                'jabatan' => 'Kaur Umum & Tata Usaha',
                'foto' => null,
                'kontak' => '081234567893',
                'urutan' => 4,
            ],
            [
                'kategori' => 'perangkat_desa',
                'nama' => 'Dedi Setiadi',
                'jabatan' => 'Kasi Pemerintahan',
                'foto' => null,
                'kontak' => '081234567894',
                'urutan' => 5,
            ],
            [
                'kategori' => 'perangkat_desa',
                'nama' => 'Cecep Supriatna',
                'jabatan' => 'Kasi Kesejahteraan & Pelayanan',
                'foto' => null,
                'kontak' => '081234567895',
                'urutan' => 6,
            ],

            // ── BPD ──────────────────────────────────────────────────────────
            [
                'kategori' => 'bpd',
                'nama' => 'Drs. H. Suherman',
                'jabatan' => 'Ketua BPD',
                'foto' => null,
                'kontak' => '082134567890',
                'urutan' => 1,
            ],
            [
                'kategori' => 'bpd',
                'nama' => 'Wawan Ridwan',
                'jabatan' => 'Wakil Ketua BPD',
                'foto' => null,
                'kontak' => '082134567891',
                'urutan' => 2,
            ],
            [
                'kategori' => 'bpd',
                'nama' => 'Neng Lilis',
                'jabatan' => 'Sekretaris BPD',
                'foto' => null,
                'kontak' => '082134567892',
                'urutan' => 3,
            ],
            [
                'kategori' => 'bpd',
                'nama' => 'Jajang Nurjaman',
                'jabatan' => 'Anggota Bidang Pemerintahan',
                'foto' => null,
                'kontak' => '082134567893',
                'urutan' => 4,
            ],
            [
                'kategori' => 'bpd',
                'nama' => 'Yayat Hidayat',
                'jabatan' => 'Anggota Bidang Pembangunan',
                'foto' => null,
                'kontak' => '082134567894',
                'urutan' => 5,
            ],

            // ── Lembaga Desa ─────────────────────────────────────────────────
            [
                'kategori' => 'lembaga_desa',
                'nama' => 'Hj. Neneng Sutia',
                'jabatan' => 'Ketua Tim Penggerak PKK',
                'foto' => null,
                'kontak' => '083134567890',
                'urutan' => 1,
            ],
            [
                'kategori' => 'lembaga_desa',
                'nama' => 'Ginanjar, S.Kom',
                'jabatan' => 'Ketua Karang Taruna "Wira Karya"',
                'foto' => null,
                'kontak' => '083134567891',
                'urutan' => 2,
            ],
            [
                'kategori' => 'lembaga_desa',
                'nama' => 'H. Endang',
                'jabatan' => 'Ketua LPM (Lembaga Pemberdayaan Masyarakat)',
                'foto' => null,
                'kontak' => '083134567892',
                'urutan' => 3,
            ],
            [
                'kategori' => 'lembaga_desa',
                'nama' => 'K.H. Ahmad Fauzi',
                'jabatan' => 'Ketua MUI Desa Cirangkong',
                'foto' => null,
                'kontak' => '083134567893',
                'urutan' => 4,
            ],
        ];

        foreach ($pejabat as $item) {
            Pejabat::create($item);
        }

        $this->command->info('PejabatSeeder: Data pejabat berhasil ditambahkan.');
    }
}
