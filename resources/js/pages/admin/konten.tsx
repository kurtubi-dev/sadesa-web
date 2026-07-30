import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, X, Image as ImageIcon, FileText as PdfIcon, Calendar as CalendarIcon, MapPin as MapPinIcon, Globe as GlobeIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import axios from 'axios';

interface KontenItem {
    id: number;
    judul: string;
    slug: string;
    tipe: string;
    status: string;
    created_at: string;
    admin?: { id: number; name: string } | null;
    konten?: string;
    gambar_utama?: string | null;
    lampiran_pdf?: string | null;
    meta_description?: string | null;
    is_featured?: boolean | number;
    kategori?: string;
    event_tanggal?: string | null;
    event_lokasi?: string | null;
}

interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    konten: Paginator<KontenItem>;
    filters: { tipe?: string; status?: string; search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Konten Desa', href: '/admin/konten' },
];

// ─── Form Page ─────────────────────────────────────────────────────────────────

function KontenForm({ editData, onClose }: { editData: KontenItem | null; onClose: () => void }) {
    const isEdit = editData !== null;
    
    const form = useForm({
        judul:            editData?.judul            ?? '',
        konten:           editData?.konten           ?? '',
        tipe:             editData?.tipe             ?? 'berita',
        status:           editData?.status           ?? 'draft',
        gambar_utama:     null as File | null,
        lampiran_pdf:     null as File | null,
        meta_description: editData?.meta_description ?? '',
        is_featured:      editData?.is_featured ? true : false,
        kategori:         editData?.kategori         ?? 'Umum',
        event_tanggal:    editData?.event_tanggal    ?? '',
        event_lokasi:     editData?.event_lokasi     ?? '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        editData?.gambar_utama ? `/storage/${editData.gambar_utama}` : null
    );

    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('gambar_utama', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('lampiran_pdf', file);
        }
    };

    useEffect(() => {
        if (!editorRef.current) return;
        if (editorRef.current.querySelector('.ql-editor')) return;

        const quill = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: [] }],
                    ['link', 'image', 'video'],
                    ['clean'],
                ],
            },
            placeholder: 'Tulis isi konten di sini (bisa menambahkan gambar, heading, paragraf, daftar, dll)…',
        });

        quillRef.current = quill;

        if (form.data.konten) {
            quill.clipboard.dangerouslyPasteHTML(form.data.konten);
        }

        quill.on('text-change', () => {
            const html = quill.root.innerHTML;
            form.setData('konten', html === '<p><br></p>' ? '' : html);
        });

        // Intercept standard image handler to upload automatically
        const selectLocalImage = () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;

                if (file.size > 5 * 1024 * 1024) {
                    alert('Ukuran gambar terlalu besar (maksimal 5MB)');
                    return;
                }

                const formData = new FormData();
                formData.append('image', file);

                try {
                    const response = await axios.post('/admin/konten/upload-image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });

                    if (response.data && response.data.url) {
                        const range = quill.getSelection();
                        if (range) {
                            quill.insertEmbed(range.index, 'image', response.data.url);
                            quill.setSelection(range.index + 1);
                        }
                    }
                } catch (error) {
                    console.error('Gagal mengunggah gambar:', error);
                    alert('Gagal mengunggah gambar ke server.');
                }
            };
        };

        quill.getModule('toolbar').addHandler('image', selectLocalImage);
    }, []);

    const submitWithStatus = (newStatus: 'draft' | 'published') => {
        if (!form.data.judul.trim()) {
            form.setError('judul', 'Judul wajib diisi');
            return;
        }
        if (!form.data.konten.trim() || form.data.konten === '<p><br></p>') {
            form.setError('konten', 'Konten wajib diisi');
            return;
        }

        const dataToSend = {
            judul:            form.data.judul,
            konten:           form.data.konten,
            tipe:             form.data.tipe,
            status:           newStatus,
            gambar_utama:     form.data.gambar_utama,
            lampiran_pdf:     form.data.lampiran_pdf,
            meta_description: form.data.meta_description,
            is_featured:      form.data.is_featured ? '1' : '0',
            kategori:         form.data.kategori,
            event_tanggal:    form.data.event_tanggal,
            event_lokasi:     form.data.event_lokasi,
        };

        if (isEdit) {
            // Using POST with spoofing method _method=patch to bypass PHP multipart limitations on PATCH/PUT
            router.post(`/admin/konten/${editData!.id}`, {
                ...dataToSend,
                _method: 'patch',
            }, {
                onSuccess: onClose
            });
        } else {
            router.post('/admin/konten', dataToSend, {
                onSuccess: onClose
            });
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-foreground">
                        {isEdit ? 'Edit Konten Desa' : 'Buat Konten Baru'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isEdit ? 'Perbarui berita atau pengumuman desa' : 'Tulis berita atau pengumuman baru untuk publik'}
                    </p>
                </div>
                <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm hover:bg-muted font-semibold transition">
                    Kembali ke Daftar
                </button>
            </div>

            {/* Main Form with Sidebar Grid */}
            <form onSubmit={e => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left Column: Editor (Col Span 3) */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                        {/* Judul Input - Clean Document Style */}
                        <div>
                            <input 
                                value={form.data.judul} 
                                onChange={e => form.setData('judul', e.target.value)}
                                className="w-full border-b pb-3 text-2xl font-extrabold bg-transparent border-t-0 border-x-0 border-border focus:border-teal-500 focus:ring-0 focus:outline-none placeholder:text-muted-foreground"
                                placeholder="Masukkan Judul Artikel..." 
                                required 
                            />
                            {form.errors.judul && <p className="mt-1 text-xs text-red-500">{form.errors.judul}</p>}
                        </div>

                        {/* Quill Editor Container */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Isi Artikel / Konten</label>
                            <div className="bg-background rounded-lg border overflow-hidden">
                                <div ref={editorRef} className="min-h-[500px] max-h-[800px] overflow-y-auto" />
                            </div>
                            {form.errors.konten && <p className="mt-1 text-xs text-red-500">{form.errors.konten}</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Panel (Col Span 1) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    
                    {/* Publishing settings */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider border-b pb-2 border-border">
                            Pengaturan Publikasi
                        </h3>
                        
                        {/* Tipe select */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipe Konten</label>
                            <select value={form.data.tipe} onChange={e => form.setData('tipe', e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option value="berita">📰 Berita</option>
                                <option value="pengumuman">📢 Pengumuman</option>
                            </select>
                        </div>

                        {/* Kategori select */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kategori</label>
                            <select value={form.data.kategori} onChange={e => form.setData('kategori', e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option value="Umum">Umum</option>
                                <option value="Ekonomi">💼 Ekonomi</option>
                                <option value="Infrastruktur">🏗️ Pembangunan / Infrastruktur</option>
                                <option value="Kesehatan">🏥 Kesehatan</option>
                                <option value="Pertanian">🌾 Pertanian / Perkebunan</option>
                                <option value="Bantuan Sosial">🎁 Bantuan Sosial (Bansos)</option>
                                <option value="Keamanan">🛡️ Keamanan & Ketertiban</option>
                            </select>
                        </div>
                        
                        {/* Featured (Pin) Toggle */}
                        <div className="flex items-center justify-between border-t border-b py-3 my-2 border-border">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-foreground">Pin Berita Utama</label>
                                <span className="text-[10px] text-muted-foreground leading-none">Tampilkan di banner teratas</span>
                            </div>
                            <input 
                                type="checkbox"
                                checked={form.data.is_featured}
                                onChange={e => form.setData('is_featured', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                            />
                        </div>

                        {/* Status Info */}
                        <div className="text-xs text-muted-foreground">
                            Status saat ini: <span className="font-semibold capitalize text-foreground">{form.data.status}</span>
                        </div>

                        {/* Author Info */}
                        <div className="border-t pt-3 mt-3 text-xs text-muted-foreground space-y-1">
                            <div>Penulis: <span className="font-semibold text-foreground">{editData?.admin?.name ?? 'Anda (Admin)'}</span></div>
                            {editData && (
                                <div>Dibuat: <span className="font-semibold text-foreground">{new Date(editData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                            )}
                        </div>

                        {/* Action buttons inside the sidebar card */}
                        <div className="flex flex-col gap-2 pt-3 border-t">
                            <button 
                                type="button" 
                                onClick={() => submitWithStatus('published')}
                                disabled={form.processing}
                                className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60 transition shadow-sm cursor-pointer">
                                {form.processing ? 'Menyimpan…' : isEdit && editData.status === 'published' ? 'Perbarui Konten' : 'Terbitkan Sekarang'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => submitWithStatus('draft')}
                                disabled={form.processing}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60 transition cursor-pointer">
                                {form.processing ? 'Menyimpan…' : isEdit && editData.status === 'draft' ? 'Simpan Draf' : 'Simpan sebagai Draf'}
                            </button>
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="w-full rounded-lg border border-transparent px-4 py-2 text-sm font-medium hover:bg-muted transition text-muted-foreground text-center cursor-pointer">
                                Batal
                            </button>
                        </div>
                    </div>

                    {/* Gambar Utama Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider border-b pb-2 border-border flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-teal-600" /> Cover / Gambar Utama
                        </h3>
                        {imagePreview ? (
                            <div className="relative group rounded-lg overflow-hidden border">
                                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <label className="bg-white text-gray-800 text-xs px-3 py-1.5 rounded font-bold cursor-pointer hover:bg-teal-50">
                                        Ganti Gambar
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition">
                                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-xs text-muted-foreground text-center">Pilih Gambar Sampul Berita</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                        {form.errors.gambar_utama && <p className="text-xs text-red-500 mt-1">{form.errors.gambar_utama}</p>}
                    </div>

                    {/* Lampiran PDF Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider border-b pb-2 border-border flex items-center gap-2">
                            <PdfIcon className="h-4 w-4 text-teal-600" /> Lampiran Surat/PDF
                        </h3>
                        <div>
                            {editData?.lampiran_pdf && (
                                <div className="text-xs mb-3 p-2 bg-muted rounded flex items-center justify-between">
                                    <span className="truncate max-w-[150px]">📄 {editData.lampiran_pdf.split('/').pop()}</span>
                                    <a href={`/storage/${editData.lampiran_pdf}`} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline font-semibold shrink-0">Lihat</a>
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="application/pdf" 
                                onChange={handlePdfChange} 
                                className="w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                            />
                            {form.errors.lampiran_pdf && <p className="text-xs text-red-500 mt-1">{form.errors.lampiran_pdf}</p>}
                        </div>
                    </div>

                    {/* Agenda Kegiatan (Opsional) */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider border-b pb-2 border-border flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-teal-600" /> Agenda Acara (Opsional)
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal Event</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        value={form.data.event_tanggal} 
                                        onChange={e => form.setData('event_tanggal', e.target.value)}
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tempat / Lokasi</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={form.data.event_lokasi} 
                                        onChange={e => form.setData('event_lokasi', e.target.value)}
                                        placeholder="Misal: Aula Kantor Desa"
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO & Meta Description */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider border-b pb-2 border-border flex items-center gap-2">
                            <GlobeIcon className="h-4 w-4 text-teal-600" /> Optimasi SEO / Meta
                        </h3>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Meta Description (WA Share)</label>
                            <textarea 
                                value={form.data.meta_description} 
                                onChange={e => form.setData('meta_description', e.target.value)}
                                rows={3}
                                placeholder="Tulis deskripsi singkat untuk pratinjau saat dibagikan ke WhatsApp..."
                                className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" 
                            />
                            <p className="text-[10px] text-muted-foreground text-right">{form.data.meta_description.length}/500 karakter</p>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminKonten({ konten, filters }: Props) {
    const [search, setSearch]       = useState(filters.search ?? '');
    const [formView, setFormView]   = useState<'create' | KontenItem | null>(null);

    const applyFilter = (extra: Record<string, string>) =>
        router.get('/admin/konten', { ...filters, ...extra }, { preserveState: true });

    const handleDelete = (item: KontenItem) => {
        if (!confirm(`Hapus konten "${item.judul}"?`)) return;
        router.delete(`/admin/konten/${item.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Konten Desa | SADESA" />

            {formView !== null ? (
                <KontenForm
                    editData={formView === 'create' ? null : formView}
                    onClose={() => setFormView(null)}
                />
            ) : (
                <div className="flex flex-col gap-6 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-foreground">Konten Desa</h1>
                            <p className="text-sm text-muted-foreground">Kelola berita dan pengumuman desa</p>
                        </div>
                        <button onClick={() => setFormView('create')}
                            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
                            <Plus className="h-4 w-4" /> Buat Konten
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="flex flex-wrap gap-3">
                        <form onSubmit={e => { e.preventDefault(); applyFilter({ search }); }} className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari judul…"
                                    className="w-56 rounded-lg border bg-background py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">Cari</button>
                        </form>
                        <select value={filters.tipe ?? ''} onChange={e => applyFilter({ tipe: e.target.value })}
                            className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Semua Tipe</option>
                            <option value="berita">Berita</option>
                            <option value="pengumuman">Pengumuman</option>
                        </select>
                        <select value={filters.status ?? ''} onChange={e => applyFilter({ status: e.target.value })}
                            className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Semua Status</option>
                            <option value="published">Dipublikasikan</option>
                            <option value="draft">Draft</option>
                        </select>
                        {(filters.tipe || filters.status || filters.search) && (
                            <button onClick={() => router.get('/admin/konten')} className="rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Reset</button>
                        )}
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/30 text-left">
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Judul</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Tipe</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Penulis</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Tanggal</th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {konten.data.length === 0 ? (
                                        <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Belum ada konten.</td></tr>
                                    ) : konten.data.map(item => (
                                        <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                                            <td className="max-w-xs px-4 py-3">
                                                <p className="truncate font-medium text-foreground">{item.judul}</p>
                                                <p className="truncate text-xs text-muted-foreground">/informasi/{item.slug}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.tipe === 'berita' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {item.tipe === 'berita' ? '📰 Berita' : '📢 Pengumuman'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {item.status === 'published' ? 'Publik' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{item.admin?.name ?? '—'}</td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => setFormView(item)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item)} className="rounded-md p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" title="Hapus">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {konten.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-4 py-3">
                                <p className="text-sm text-muted-foreground">Halaman {konten.current_page} dari {konten.last_page}</p>
                                <div className="flex gap-1">
                                    {konten.links.map((link, i) => (
                                        <Link key={i} href={link.url ?? '#'} preserveState
                                            className={`rounded-md px-3 py-1.5 text-sm ${link.active ? 'bg-teal-600 text-white' : 'border hover:bg-muted text-muted-foreground'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
