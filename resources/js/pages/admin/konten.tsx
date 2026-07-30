import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface KontenItem {
    id: number;
    judul: string;
    slug: string;
    tipe: string;
    status: string;
    created_at: string;
    admin?: { id: number; name: string } | null;
    konten?: string;
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
        judul:  editData?.judul  ?? '',
        konten: editData?.konten ?? '',
        tipe:   editData?.tipe   ?? 'berita',
        status: editData?.status ?? 'draft',
    });

    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

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
    }, []);

    const submitWithStatus = (newStatus: 'draft' | 'published') => {
        // Manual validation for required fields
        if (!form.data.judul.trim()) {
            form.setError('judul', 'Judul wajib diisi');
            return;
        }
        if (!form.data.konten.trim() || form.data.konten === '<p><br></p>') {
            form.setError('konten', 'Konten wajib diisi');
            return;
        }

        const dataToSend = {
            judul: form.data.judul,
            konten: form.data.konten,
            tipe: form.data.tipe,
            status: newStatus,
        };

        if (isEdit) {
            router.patch(`/admin/konten/${editData!.id}`, dataToSend, {
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
