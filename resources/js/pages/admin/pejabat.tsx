import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, UserCheck, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pejabat {
    id: number;
    nama: string;
    jabatan: string;
    kategori: 'perangkat_desa' | 'bpd' | 'lembaga_desa';
    foto: string | null;
    kontak: string | null;
    urutan: number;
    created_at: string;
}

interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    pejabat: Paginator<Pejabat>;
    filters: { kategori?: string; search?: string };
    flash?: { success?: string; error?: string };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const KATEGORI_LABEL: Record<string, string> = {
    perangkat_desa: 'Perangkat Desa',
    bpd: 'BPD',
    lembaga_desa: 'Lembaga Desa',
};

const KATEGORI_COLOR: Record<string, string> = {
    perangkat_desa: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    bpd: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    lembaga_desa: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Kelola Pejabat', href: '/admin/pejabat' },
];

// ─── Form Modal (Add / Edit) ──────────────────────────────────────────────────

function PejabatModal({ pejabat, onClose }: { pejabat: Pejabat | null; onClose: () => void }) {
    const isEdit = pejabat !== null;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        nama: pejabat?.nama ?? '',
        jabatan: pejabat?.jabatan ?? '',
        kategori: pejabat?.kategori ?? 'perangkat_desa',
        kontak: pejabat?.kontak ?? '',
        urutan: pejabat?.urutan ?? 0,
        foto: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        pejabat?.foto ? `/storage/${pejabat.foto}` : null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use Form Data for file upload compatibility
        const formData = new FormData();
        formData.append('nama', data.nama);
        formData.append('jabatan', data.jabatan);
        formData.append('kategori', data.kategori);
        formData.append('kontak', data.kontak);
        formData.append('urutan', String(data.urutan));
        if (data.foto) {
            formData.append('foto', data.foto);
        }

        if (isEdit) {
            router.post(`/admin/pejabat/${pejabat.id}`, formData, {
                forceFormData: true,
                onSuccess: () => onClose(),
            });
        } else {
            router.post('/admin/pejabat', formData, {
                forceFormData: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl bg-card border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="font-bold text-foreground">
                        {isEdit ? 'Edit Data Pejabat' : 'Tambah Pejabat Baru'}
                    </h3>
                    <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted text-muted-foreground transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <form onSubmit={submit}>
                    <div className="space-y-4 p-6 max-h-[70vh] overflow-y-auto">
                        
                        {/* Foto Upload & Preview */}
                        <div className="flex flex-col items-center gap-4 border-b pb-4">
                            <div className="relative group flex h-28 w-28 shrink-0 items-center justify-center rounded-full border bg-muted/30 overflow-hidden ring-4 ring-background shadow-md">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200 cursor-pointer"
                                     onClick={() => fileInputRef.current?.click()}>
                                    <span className="text-[10px] text-white font-semibold uppercase tracking-wider">Ubah Foto</span>
                                </div>
                            </div>
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition"
                                >
                                    Pilih Foto Pejabat
                                </button>
                                {errors.foto && <p className="mt-1 text-xs text-red-500 text-center">{errors.foto}</p>}
                                <p className="mt-1 text-[10px] text-muted-foreground text-center">PNG/JPG, Maksimal 2 MB</p>
                            </div>
                        </div>

                        {/* Nama */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-foreground">Nama Lengkap</label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={e => setData('nama', e.target.value)}
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Contoh: Mulyadi, S.IP"
                                required
                            />
                            {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama}</p>}
                        </div>

                        {/* Jabatan */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-foreground">Jabatan</label>
                            <input
                                type="text"
                                value={data.jabatan}
                                onChange={e => setData('jabatan', e.target.value)}
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Contoh: Sekretaris Desa"
                                required
                            />
                            {errors.jabatan && <p className="mt-1 text-xs text-red-500">{errors.jabatan}</p>}
                        </div>

                        {/* Kategori & Kontak */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-foreground">Kategori</label>
                                <select
                                    value={data.kategori}
                                    onChange={e => setData('kategori', e.target.value as any)}
                                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="perangkat_desa">Perangkat Desa</option>
                                    <option value="bpd">BPD</option>
                                    <option value="lembaga_desa">Lembaga Desa</option>
                                </select>
                                {errors.kategori && <p className="mt-1 text-xs text-red-500">{errors.kategori}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-foreground">Nomor Kontak <span className="text-xs font-normal text-muted-foreground">(Opsional)</span></label>
                                <input
                                    type="text"
                                    value={data.kontak}
                                    onChange={e => setData('kontak', e.target.value)}
                                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="Contoh: 0812345..."
                                />
                                {errors.kontak && <p className="mt-1 text-xs text-red-500">{errors.kontak}</p>}
                            </div>
                        </div>

                        {/* Urutan Tampil */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-foreground">Urutan Tampilan</label>
                            <input
                                type="number"
                                min="0"
                                value={data.urutan}
                                onChange={e => setData('urutan', parseInt(e.target.value) || 0)}
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            {errors.urutan && <p className="mt-1 text-xs text-red-500">{errors.urutan}</p>}
                            <p className="mt-1 text-[11px] text-muted-foreground">Angka lebih kecil akan ditampilkan lebih dulu di halaman publik.</p>
                        </div>

                    </div>

                    <div className="flex justify-end gap-3 border-t px-6 py-4 bg-muted/20">
                        <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-sm hover:bg-muted transition font-semibold">
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 transition"
                        >
                            {isEdit ? 'Perbarui Pejabat' : 'Simpan Pejabat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPejabat({ pejabat, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [kategori, setKategori] = useState(filters.kategori ?? '');
    
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPejabat, setSelectedPejabat] = useState<Pejabat | null>(null);

    const applyFilter = (key: string, val: string) => {
        const nextFilters = { ...filters, [key]: val };
        if (!val) {
            delete nextFilters[key as keyof typeof filters];
        }
        router.get('/admin/pejabat', nextFilters, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const handleDelete = (item: Pejabat) => {
        if (!confirm(`Hapus data ${item.nama} (${item.jabatan})? Tindakan ini tidak dapat dibatalkan.`)) return;
        router.delete(`/admin/pejabat/${item.id}`);
    };

    const openEditModal = (item: Pejabat) => {
        setSelectedPejabat(item);
        setModalOpen(true);
    };

    const openCreateModal = () => {
        setSelectedPejabat(null);
        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Pejabat Desa | SADESA" />

            {modalOpen && (
                <PejabatModal
                    pejabat={selectedPejabat}
                    onClose={() => setModalOpen(false)}
                />
            )}

            <div className="mx-auto max-w-6xl p-6 pb-12">
                
                {/* Header */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <UserCheck className="h-6 w-6 text-teal-600" />
                            Kelola Pejabat Desa
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Manajemen data Perangkat Desa, Badan Permusyawaratan Desa (BPD), dan Lembaga Kemasyarakatan Desa Cirangkong
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Pejabat
                    </button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                        ✓ {flash.success}
                    </div>
                )}

                {/* Filter & Search Bar */}
                <div className="mb-6 flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    
                    {/* Category Filter */}
                    <div className="flex gap-2">
                        {['', 'perangkat_desa', 'bpd', 'lembaga_desa'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setKategori(cat);
                                    applyFilter('kategori', cat);
                                }}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                                    kategori === cat
                                        ? 'bg-teal-600 text-white shadow-xs'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                            >
                                {cat === '' ? 'Semua Kategori' : KATEGORI_LABEL[cat]}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative flex w-full max-w-sm items-center">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari nama atau jabatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border bg-background py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get('/admin/pejabat', { ...filters, search: '' });
                                }}
                                className="absolute right-3 text-xs text-muted-foreground hover:text-foreground"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Table / Grid */}
                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
                                <tr>
                                    <th className="px-6 py-4 w-16 text-center">Urutan</th>
                                    <th className="px-6 py-4">Pejabat</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Kontak</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pejabat.data.length > 0 ? (
                                    pejabat.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/10 transition">
                                            <td className="px-6 py-4 font-mono font-semibold text-center text-muted-foreground">
                                                {item.urutan}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-muted/40">
                                                        {item.foto ? (
                                                            <img
                                                                src={`/storage/${item.foto}`}
                                                                alt={item.nama}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '';
                                                                    (e.target as HTMLImageElement).className = 'hidden';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/20 text-sm">
                                                                {item.nama.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">{item.nama}</h3>
                                                        <p className="text-xs text-muted-foreground">{item.jabatan}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${KATEGORI_COLOR[item.kategori]}`}>
                                                    {KATEGORI_LABEL[item.kategori]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground font-mono">
                                                {item.kontak || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                                        title="Edit Data"
                                                    >
                                                        <Pencil className="h-4.5 w-4.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                                        title="Hapus Data"
                                                    >
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            Tidak ada data pejabat ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pejabat.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/10">
                            <span className="text-xs text-muted-foreground">
                                Halaman {pejabat.current_page} dari {pejabat.last_page} ({pejabat.total} data)
                            </span>
                            <div className="flex gap-1">
                                {pejabat.links.map((link, idx) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <button
                                                key={idx}
                                                disabled={!link.url}
                                                onClick={() => router.get(link.url!)}
                                                className="rounded-lg border p-1.5 hover:bg-muted disabled:opacity-50 transition"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <button
                                                key={idx}
                                                disabled={!link.url}
                                                onClick={() => router.get(link.url!)}
                                                className="rounded-lg border p-1.5 hover:bg-muted disabled:opacity-50 transition"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => router.get(link.url!)}
                                            className={`rounded-lg border px-3 py-1 text-xs font-semibold transition ${
                                                link.active
                                                    ? 'bg-teal-600 border-teal-600 text-white'
                                                    : 'hover:bg-muted text-muted-foreground'
                                            }`}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
