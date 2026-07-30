<?php

namespace App\Http\Controllers;

use App\Models\KontenDesa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InformasiController extends Controller
{
    /** Daftar berita & pengumuman yang dipublikasikan */
    public function index(Request $request): Response
    {
        $query = KontenDesa::published()->latest();

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        if ($request->filled('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('search')) {
            $query->where('judul', 'like', "%{$request->search}%");
        }

        $konten = $query->paginate(12)->withQueryString();

        // Ambil berita utama (pin/featured) yang paling baru
        $featured = KontenDesa::published()
            ->where('is_featured', true)
            ->latest()
            ->first();

        return Inertia::render('informasi/index', [
            'konten'   => $konten,
            'featured' => $featured,
            'filters'  => $request->only('tipe', 'kategori', 'search'),
        ]);
    }

    /** Detail satu artikel */
    public function show(string $slug): Response
    {
        $artikel = KontenDesa::published()
            ->where('slug', $slug)
            ->with('admin:id,name')
            ->firstOrFail();

        // Naikkan hit counter pembaca secara aman
        $artikel->increment('views_count');

        // Artikel terkait (tipe sama, bukan artikel ini sendiri)
        $terkait = KontenDesa::published()
            ->where('tipe', $artikel->tipe)
            ->where('id', '!=', $artikel->id)
            ->latest()
            ->take(4)
            ->get(['id', 'judul', 'slug', 'tipe', 'gambar_utama', 'created_at']);

        return Inertia::render('informasi/show', [
            'artikel' => $artikel,
            'terkait' => $terkait,
        ]);
    }
}
