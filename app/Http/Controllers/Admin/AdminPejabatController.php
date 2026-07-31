<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Pejabat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminPejabatController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Pejabat::query();

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->search}%")
                  ->orWhere('jabatan', 'like', "%{$request->search}%");
            });
        }

        $pejabat = $query->orderBy('kategori')
            ->orderBy('urutan')
            ->orderBy('nama')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/pejabat', [
            'pejabat' => $pejabat,
            'filters' => $request->only('kategori', 'search'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nama'     => 'required|string|max:255',
            'jabatan'  => 'required|string|max:255',
            'kategori' => 'required|in:perangkat_desa,bpd,lembaga_desa',
            'kontak'   => 'nullable|string|max:50',
            'urutan'   => 'required|integer|min:0',
            'foto'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('pejabat', 'public');
        }

        $pejabat = Pejabat::create([
            'nama'     => $data['nama'],
            'jabatan'  => $data['jabatan'],
            'kategori' => $data['kategori'],
            'kontak'   => $data['kontak'] ?? null,
            'urutan'   => $data['urutan'],
            'foto'     => $fotoPath,
        ]);

        AuditLog::catat('buat_pejabat', Pejabat::class, $pejabat->id);

        return back()->with('success', 'Data pejabat berhasil ditambahkan.');
    }

    public function update(Request $request, Pejabat $pejabat): RedirectResponse
    {
        // Inertia sends multipart/form-data via POST with _method=PATCH/PUT to handle file uploads
        $data = $request->validate([
            'nama'     => 'required|string|max:255',
            'jabatan'  => 'required|string|max:255',
            'kategori' => 'required|in:perangkat_desa,bpd,lembaga_desa',
            'kontak'   => 'nullable|string|max:50',
            'urutan'   => 'required|integer|min:0',
            'foto'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            if ($pejabat->foto) {
                Storage::disk('public')->delete($pejabat->foto);
            }
            $pejabat->foto = $request->file('foto')->store('pejabat', 'public');
        }

        $pejabat->update([
            'nama'     => $data['nama'],
            'jabatan'  => $data['jabatan'],
            'kategori' => $data['kategori'],
            'kontak'   => $data['kontak'] ?? null,
            'urutan'   => $data['urutan'],
            'foto'     => $pejabat->foto,
        ]);

        AuditLog::catat('update_pejabat', Pejabat::class, $pejabat->id);

        return back()->with('success', 'Data pejabat berhasil diperbarui.');
    }

    public function destroy(Pejabat $pejabat): RedirectResponse
    {
        AuditLog::catat('hapus_pejabat', Pejabat::class, $pejabat->id, ['nama' => $pejabat->nama]);

        if ($pejabat->foto) {
            Storage::disk('public')->delete($pejabat->foto);
        }

        $pejabat->delete();

        return back()->with('success', 'Data pejabat berhasil dihapus.');
    }
}
