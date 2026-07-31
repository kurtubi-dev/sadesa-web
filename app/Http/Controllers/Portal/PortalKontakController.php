<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\BukuTamu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalKontakController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('portal/kontak', [
            'settings' => AppSetting::allAsArray(),
        ]);
    }

    public function storeBukuTamu(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_pengunjung' => 'required|string|max:255',
            'instansi'        => 'nullable|string|max:255',
            'keperluan'       => 'required|string|max:500',
            'no_hp'           => ['nullable', 'string', 'max:15', 'regex:/^[0-9+\-\s]+$/'],
        ], [
            'nama_pengunjung.required' => 'Nama pengunjung wajib diisi.',
            'keperluan.required'       => 'Keperluan kunjungan wajib diisi.',
            'no_hp.regex'              => 'Format nomor HP tidak valid.',
        ]);

        BukuTamu::create([
            'nama_pengunjung' => $request->nama_pengunjung,
            'instansi'        => $request->instansi,
            'keperluan'       => $request->keperluan,
            'no_hp'           => $request->no_hp,
            'waktu_kunjungan' => now(),
        ]);

        return back()->with('success', 'Terima kasih! Kunjungan Anda telah tercatat di Buku Tamu Desa Cirangkong.');
    }
}
