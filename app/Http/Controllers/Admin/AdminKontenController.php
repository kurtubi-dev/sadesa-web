<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\KontenDesa;
use App\Models\User;
use App\Notifications\InformasiDesaNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminKontenController extends Controller
{
    public function index(Request $request): Response
    {
        $query = KontenDesa::with('admin:id,name')
            ->select('id', 'admin_id', 'judul', 'slug', 'konten', 'gambar_utama', 'lampiran_pdf', 'meta_description', 'is_featured', 'kategori', 'event_tanggal', 'event_lokasi', 'tipe', 'status', 'created_at');

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where('judul', 'like', "%{$request->search}%");
        }

        $konten = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/konten', [
            'konten'  => $konten,
            'filters' => $request->only('tipe', 'status', 'search'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'judul'            => 'required|string|max:255',
            'konten'           => 'required|string',
            'tipe'             => 'required|in:berita,pengumuman',
            'status'           => 'required|in:draft,published',
            'gambar_utama'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'lampiran_pdf'     => 'nullable|file|mimes:pdf|max:10240',
            'meta_description' => 'nullable|string|max:500',
            'is_featured'      => 'nullable',
            'kategori'         => 'nullable|string|max:100',
            'event_tanggal'    => 'nullable|date',
            'event_lokasi'     => 'nullable|string|max:255',
        ]);

        $isFeatured = filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN);

        // Handle File Uploads
        $gambarPath = null;
        if ($request->hasFile('gambar_utama')) {
            $gambarPath = $this->saveAndCompressImage($request->file('gambar_utama'));
        }

        $pdfPath = null;
        if ($request->hasFile('lampiran_pdf')) {
            $pdfPath = $request->file('lampiran_pdf')->store('konten', 'public');
        }

        $konten = KontenDesa::create([
            'judul'            => $data['judul'],
            'konten'           => $data['konten'],
            'tipe'             => $data['tipe'],
            'status'           => $data['status'],
            'gambar_utama'     => $gambarPath,
            'lampiran_pdf'     => $pdfPath,
            'meta_description' => $data['meta_description'] ?? null,
            'is_featured'      => $isFeatured,
            'kategori'         => $data['kategori'] ?? 'Umum',
            'event_tanggal'    => $data['event_tanggal'] ?? null,
            'event_lokasi'     => $data['event_lokasi'] ?? null,
            'admin_id'         => auth()->id(),
        ]);

        AuditLog::catat('buat_konten', KontenDesa::class, $konten->id);

        if ($konten->status === 'published') {
            $this->broadcastInformasi($konten);
        }

        return back()->with('success', 'Konten berhasil dibuat.');
    }

    public function update(Request $request, KontenDesa $konten): RedirectResponse
    {
        // Inertia sends multipart/form-data via POST with _method=PATCH/PUT to handle file uploads
        $data = $request->validate([
            'judul'            => 'required|string|max:255',
            'konten'           => 'required|string',
            'tipe'             => 'required|in:berita,pengumuman',
            'status'           => 'required|in:draft,published',
            'gambar_utama'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'lampiran_pdf'     => 'nullable|file|mimes:pdf|max:10240',
            'meta_description' => 'nullable|string|max:500',
            'is_featured'      => 'nullable',
            'kategori'         => 'nullable|string|max:100',
            'event_tanggal'    => 'nullable|date',
            'event_lokasi'     => 'nullable|string|max:255',
        ]);

        $isFeatured = filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN);

        // Handle Cover Image Update
        if ($request->hasFile('gambar_utama')) {
            if ($konten->gambar_utama) {
                Storage::disk('public')->delete($konten->gambar_utama);
            }
            $konten->gambar_utama = $this->saveAndCompressImage($request->file('gambar_utama'));
        }

        // Handle PDF Update
        if ($request->hasFile('lampiran_pdf')) {
            if ($konten->lampiran_pdf) {
                Storage::disk('public')->delete($konten->lampiran_pdf);
            }
            $konten->lampiran_pdf = $request->file('lampiran_pdf')->store('konten', 'public');
        }

        $wasDraft = $konten->status === 'draft';
        
        $konten->update([
            'judul'            => $data['judul'],
            'konten'           => $data['konten'],
            'tipe'             => $data['tipe'],
            'status'           => $data['status'],
            'meta_description' => $data['meta_description'] ?? null,
            'is_featured'      => $isFeatured,
            'kategori'         => $data['kategori'] ?? 'Umum',
            'event_tanggal'    => $data['event_tanggal'] ?? null,
            'event_lokasi'     => $data['event_lokasi'] ?? null,
        ]);
        
        AuditLog::catat('update_konten', KontenDesa::class, $konten->id);

        if ($wasDraft && $konten->fresh()->status === 'published') {
            $this->broadcastInformasi($konten->fresh());
        }

        return back()->with('success', 'Konten berhasil diperbarui.');
    }

    private function saveAndCompressImage($file): string
    {
        $destinationPath = storage_path('app/public/konten');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $filename = uniqid('cover_', true) . '.webp';
        $fullPath = $destinationPath . '/' . $filename;

        try {
            $imageInfo = getimagesize($file->getRealPath());
            if ($imageInfo) {
                $srcWidth = $imageInfo[0];
                $srcHeight = $imageInfo[1];
                $type = $imageInfo[2];

                switch ($type) {
                    case IMAGETYPE_JPEG:
                        $sourceImage = imagecreatefromjpeg($file->getRealPath());
                        break;
                    case IMAGETYPE_PNG:
                        $sourceImage = imagecreatefrompng($file->getRealPath());
                        break;
                    case IMAGETYPE_GIF:
                        $sourceImage = imagecreatefromgif($file->getRealPath());
                        break;
                    case IMAGETYPE_WEBP:
                        $sourceImage = imagecreatefromwebp($file->getRealPath());
                        break;
                    default:
                        $sourceImage = false;
                }

                if ($sourceImage !== false) {
                    $maxWidth = 1200;
                    if ($srcWidth > $maxWidth) {
                        $dstWidth = $maxWidth;
                        $dstHeight = (int) (($srcHeight / $srcWidth) * $maxWidth);
                        
                        $virtualImage = imagecreatetruecolor($dstWidth, $dstHeight);
                        imagealphablending($virtualImage, false);
                        imagesavealpha($virtualImage, true);
                        
                        imagecopyresampled($virtualImage, $sourceImage, 0, 0, 0, 0, $dstWidth, $dstHeight, $srcWidth, $srcHeight);
                        imagewebp($virtualImage, $fullPath, 80);
                        imagedestroy($virtualImage);
                    } else {
                        imagewebp($sourceImage, $fullPath, 80);
                    }
                    imagedestroy($sourceImage);
                    return 'konten/' . $filename;
                }
            }
        } catch (\Throwable $e) {
            // Ignore & fallback
        }

        return $file->store('konten', 'public');
    }

    private function broadcastInformasi(KontenDesa $konten): void
    {
        try {
            User::where('role', 'warga')->where('status', 'aktif')
                ->each(fn ($u) => $u->notify(new InformasiDesaNotification($konten)));
        } catch (\Throwable) { /* silent */ }
    }

    public function uploadImage(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $path = $this->saveAndCompressImage($request->file('image'));
            return response()->json([
                'url' => Storage::url($path)
            ]);
        }

        return response()->json(['error' => 'File tidak valid.'], 400);
    }

    public function destroy(KontenDesa $konten): RedirectResponse
    {
        AuditLog::catat('hapus_konten', KontenDesa::class, $konten->id, ['judul' => $konten->judul]);
        
        if ($konten->gambar_utama) {
            Storage::disk('public')->delete($konten->gambar_utama);
        }
        if ($konten->lampiran_pdf) {
            Storage::disk('public')->delete($konten->lampiran_pdf);
        }

        $konten->delete();

        return back()->with('success', 'Konten berhasil dihapus.');
    }
}