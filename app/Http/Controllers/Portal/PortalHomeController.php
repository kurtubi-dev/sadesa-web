<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\KontenDesa;
use App\Models\Pejabat;
use Inertia\Inertia;
use Inertia\Response;

class PortalHomeController extends Controller
{
    public function index(): Response
    {
        // 4 berita terbaru
        $berita = KontenDesa::published()
            ->where('tipe', 'berita')
            ->latest()
            ->take(4)
            ->get(['id', 'judul', 'slug', 'tipe', 'gambar_utama', 'meta_description', 'created_at']);

        // Pengumuman terbaru
        $pengumuman = KontenDesa::published()
            ->where('tipe', 'pengumuman')
            ->latest()
            ->take(3)
            ->get(['id', 'judul', 'slug', 'tipe', 'created_at']);

        // Agenda terdekat (event_tanggal >= hari ini)
        $agenda = KontenDesa::published()
            ->whereNotNull('event_tanggal')
            ->where('event_tanggal', '>=', now()->toDateString())
            ->orderBy('event_tanggal', 'asc')
            ->take(3)
            ->get(['id', 'judul', 'slug', 'event_tanggal', 'event_lokasi']);

        // Jika tidak ada agenda masa depan, ambil yang terbaru saja
        if ($agenda->isEmpty()) {
            $agenda = KontenDesa::published()
                ->whereNotNull('event_tanggal')
                ->latest()
                ->take(3)
                ->get(['id', 'judul', 'slug', 'event_tanggal', 'event_lokasi']);
        }

        // Berita utama / Featured
        $featured = KontenDesa::published()
            ->where('is_featured', true)
            ->latest()
            ->first();

        // Kepala Desa untuk sambutan
        $kades = Pejabat::perangkatDesa()
            ->where('jabatan', 'like', '%Kepala Desa%')
            ->first();

        return Inertia::render('portal/home', [
            'settings' => AppSetting::allAsArray(),
            'berita' => $berita,
            'pengumuman' => $pengumuman,
            'agenda' => $agenda,
            'featured' => $featured,
            'kades' => $kades,
        ]);
    }
}
