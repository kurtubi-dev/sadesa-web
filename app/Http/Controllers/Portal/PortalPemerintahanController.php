<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Pejabat;
use Inertia\Inertia;
use Inertia\Response;

class PortalPemerintahanController extends Controller
{
    public function perangkat(): Response
    {
        $pejabat = Pejabat::perangkatDesa()
            ->orderBy('urutan')
            ->orderBy('nama')
            ->get();

        return Inertia::render('portal/pemerintahan', [
            'settings' => AppSetting::allAsArray(),
            'pejabat'  => $pejabat,
            'title'    => 'Pemerintah Desa',
            'deskripsi' => 'Daftar Perangkat Desa Cirangkong yang bertugas melayani administrasi dan kebutuhan warga.',
        ]);
    }

    public function bpd(): Response
    {
        $pejabat = Pejabat::bpd()
            ->orderBy('urutan')
            ->orderBy('nama')
            ->get();

        return Inertia::render('portal/bpd', [
            'settings' => AppSetting::allAsArray(),
            'pejabat'  => $pejabat,
            'title'    => 'Badan Permusyawaratan Desa (BPD)',
            'deskripsi' => 'Daftar pengurus dan anggota BPD Desa Cirangkong sebagai mitra legislatif pemerintah desa.',
        ]);
    }

    public function lembaga(): Response
    {
        $pejabat = Pejabat::lembagaDesa()
            ->orderBy('urutan')
            ->orderBy('nama')
            ->get();

        return Inertia::render('portal/lembaga', [
            'settings' => AppSetting::allAsArray(),
            'pejabat'  => $pejabat,
            'title'    => 'Lembaga Kemasyarakatan Desa',
            'deskripsi' => 'Daftar kepengurusan lembaga desa (PKK, Karang Taruna, LPM, MUI) Desa Cirangkong.',
        ]);
    }
}
