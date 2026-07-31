<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\KontenDesa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalInformasiController extends Controller
{
    public function berita(Request $request): Response
    {
        $query = KontenDesa::published()->where('tipe', 'berita')->latest();

        if ($request->filled('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('search')) {
            $query->where('judul', 'like', "%{$request->search}%");
        }

        $konten = $query->paginate(9)->withQueryString();

        return Inertia::render('portal/informasi/index', [
            'settings' => AppSetting::allAsArray(),
            'konten'   => $konten,
            'filters'  => $request->only('kategori', 'search'),
            'type'     => 'berita',
            'title'    => 'Kabar Desa (Berita)',
        ]);
    }

    public function pengumuman(Request $request): Response
    {
        $query = KontenDesa::published()->where('tipe', 'pengumuman')->latest();

        if ($request->filled('search')) {
            $query->where('judul', 'like', "%{$request->search}%");
        }

        $konten = $query->paginate(12)->withQueryString();

        return Inertia::render('portal/informasi/index', [
            'settings' => AppSetting::allAsArray(),
            'konten'   => $konten,
            'filters'  => $request->only('search'),
            'type'     => 'pengumuman',
            'title'    => 'Pengumuman Resmi',
        ]);
    }

    public function agenda(Request $request): Response
    {
        $query = KontenDesa::published()->whereNotNull('event_tanggal');

        if ($request->filled('search')) {
            $query->where('judul', 'like', "%{$request->search}%");
        }

        $konten = $query->orderBy('event_tanggal', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('portal/informasi/index', [
            'settings' => AppSetting::allAsArray(),
            'konten'   => $konten,
            'filters'  => $request->only('search'),
            'type'     => 'agenda',
            'title'    => 'Agenda Kegiatan Desa',
        ]);
    }

    public function galeri(): Response
    {
        // Ambil semua konten yang punya gambar_utama
        $konten = KontenDesa::published()
            ->whereNotNull('gambar_utama')
            ->latest()
            ->paginate(12);

        return Inertia::render('portal/informasi/index', [
            'settings' => AppSetting::allAsArray(),
            'konten'   => $konten,
            'type'     => 'galeri',
            'title'    => 'Galeri Kegiatan',
        ]);
    }

    public function detailBerita(string $slug): Response
    {
        $artikel = KontenDesa::published()
            ->where('slug', $slug)
            ->with('admin:id,name')
            ->firstOrFail();

        // Naikkan hit counter
        $artikel->increment('views_count');

        // Artikel terkait
        $terkait = KontenDesa::published()
            ->where('tipe', $artikel->tipe)
            ->where('id', '!=', $artikel->id)
            ->latest()
            ->take(3)
            ->get(['id', 'judul', 'slug', 'tipe', 'gambar_utama', 'created_at']);

        return Inertia::render('portal/informasi/show', [
            'settings' => AppSetting::allAsArray(),
            'artikel' => $artikel,
            'terkait' => $terkait,
        ]);
    }
}
