import { Head, Link, router } from '@inertiajs/react';
import { Search, Calendar, Newspaper, Megaphone, Clock, MapPin, ChevronRight, ChevronLeft, Image } from 'lucide-react';
import { useState } from 'react';
import PortalLayout from '@/layouts/portal-layout';

interface KontenItem {
    id: number;
    judul: string;
    slug: string;
    tipe: string;
    created_at: string;
    konten: string;
    gambar_utama?: string | null;
    lampiran_pdf?: string | null;
    event_tanggal?: string | null;
    event_lokasi?: string | null;
    kategori?: string;
    admin?: { id: number; name: string } | null;
}

interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    settings: any;
    konten: Paginator<KontenItem>;
    filters?: { kategori?: string; search?: string };
    type: 'berita' | 'pengumuman' | 'agenda' | 'galeri';
    title: string;
}

const stripHtml = (html: string) => {
    if (!html) return '';
    const doc = html.replace(/<[^>]*>/g, ' ');
    return doc.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
};

const getExcerpt = (html: string, length = 120) => {
    const plain = stripHtml(html);
    return plain.length > length ? plain.substring(0, length) + '...' : plain;
};

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function InformasiIndex({ settings, konten, filters = {}, type, title }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [selectedKategori, setSelectedKategori] = useState(filters?.kategori ?? 'Semua');

    const categories = [
        'Semua',
        'Umum',
        'Ekonomi',
        'Infrastruktur',
        'Kesehatan',
        'Pertanian',
        'Bantuan Sosial',
        'Keamanan'
    ];

    const applyFilter = (extra: Record<string, string>) => {
        const nextFilters = { ...filters, ...extra };
        if (extra.kategori === 'Semua') {
            delete nextFilters.kategori;
        }
        router.get(`/informasi/${type}`, nextFilters, { preserveState: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search });
    };

    return (
        <PortalLayout title={title} settings={settings}>
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white py-12 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-teal-200 font-bold uppercase tracking-wider">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span className="opacity-55">/</span>
                        <span>Informasi Publik</span>
                        <span className="opacity-55">/</span>
                        <span>{title}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
                    <p className="text-sm text-teal-100 max-w-2xl font-light">
                        Mengakses berita pembangunan, pengumuman regulasi, agenda kegiatan, dan galeri visual Desa Cirangkong.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                
                {/* Search & Filter Bar (Hidden for Gallery) */}
                {type !== 'galeri' && (
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card border p-4 rounded-2xl shadow-xs">
                        
                        {/* Categories for Berita */}
                        {type === 'berita' ? (
                            <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedKategori(cat);
                                            applyFilter({ kategori: cat });
                                        }}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                            selectedKategori === cat
                                                ? 'bg-teal-600 text-white shadow-xs'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                    >
                                        {cat === 'Semua' ? '🌍 Semua Topik' : cat}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm font-semibold text-slate-500">
                                Menampilkan daftar {type === 'pengumuman' ? 'Pengumuman Resmi' : 'Agenda Kegiatan'}
                            </div>
                        )}

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative flex w-full max-w-xs items-center shrink-0">
                            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari kata kunci..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full rounded-xl border bg-background py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </form>
                    </div>
                )}

                {/* Content Output based on Type */}
                
                {/* 1. NEWS GRID */}
                {type === 'berita' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {konten.data.length > 0 ? (
                            konten.data.map(item => (
                                <article key={item.id} className="bg-card border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col h-full">
                                    <div className="h-48 w-full bg-slate-200 dark:bg-zinc-800 relative overflow-hidden shrink-0">
                                        {item.gambar_utama ? (
                                            <img
                                                src={`/storage/${item.gambar_utama}`}
                                                alt={item.judul}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-teal-600/30 bg-teal-50 dark:bg-teal-950/20">
                                                <Newspaper className="h-12 w-12" />
                                            </div>
                                        )}
                                        <span className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase bg-gray-900/70 text-white backdrop-blur-xs">
                                            {item.kategori ?? 'Umum'}
                                        </span>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                                                <Clock className="h-3.5 w-3.5 text-teal-500" />
                                                <span>{formatDate(item.created_at)}</span>
                                            </div>
                                            <h3 className="font-extrabold text-base text-slate-800 dark:text-zinc-100 hover:text-teal-600 transition leading-snug line-clamp-2">
                                                <Link href={`/informasi/berita/${item.slug}`}>{item.judul}</Link>
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                {getExcerpt(item.konten)}
                                            </p>
                                        </div>
                                        <Link href={`/informasi/berita/${item.slug}`} className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 border-t pt-3 mt-auto w-full">
                                            Baca Selengkapnya <ChevronRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 text-muted-foreground border bg-card rounded-2xl">
                                Tidak ada berita ditemukan.
                            </div>
                        )}
                    </div>
                )}

                {/* 2. ANNOUNCEMENTS LIST */}
                {type === 'pengumuman' && (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {konten.data.length > 0 ? (
                            konten.data.map(item => (
                                <div key={item.id} className="bg-card border p-6 rounded-2xl shadow-xs hover:border-teal-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                                Pengumuman Resmi
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-semibold">
                                                {formatDate(item.created_at)}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100 hover:text-teal-600 transition">
                                            <Link href={`/informasi/berita/${item.slug}`}>{item.judul}</Link>
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">
                                            {getExcerpt(item.konten)}
                                        </p>
                                    </div>
                                    <Link href={`/informasi/berita/${item.slug}`} className="rounded-xl border hover:bg-muted px-4 py-2 text-xs font-semibold shrink-0 text-center transition flex items-center justify-center gap-1">
                                        Unduh / Detail <ChevronRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 text-muted-foreground border bg-card rounded-2xl">
                                Tidak ada pengumuman ditemukan.
                            </div>
                        )}
                    </div>
                )}

                {/* 3. AGENDA LIST */}
                {type === 'agenda' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {konten.data.length > 0 ? (
                            konten.data.map(item => (
                                <div key={item.id} className="bg-card border p-5 rounded-2xl shadow-xs hover:border-teal-500/40 transition flex gap-5 items-start">
                                    <div className="bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 rounded-xl p-3 shrink-0 flex flex-col items-center justify-center h-16 w-16 border">
                                        <span className="text-xs uppercase font-extrabold leading-none">
                                            {new Date(item.event_tanggal!).toLocaleDateString('id-ID', { month: 'short' })}
                                        </span>
                                        <span className="text-xl font-black leading-none mt-1">
                                            {new Date(item.event_tanggal!).getDate()}
                                        </span>
                                    </div>
                                    <div className="space-y-2 min-w-0 flex-1">
                                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 hover:text-teal-600 transition leading-snug line-clamp-2">
                                            <Link href={`/informasi/berita/${item.slug}`}>{item.judul}</Link>
                                        </h3>
                                        <div className="space-y-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                                                <span className="truncate">{item.event_lokasi || 'Kantor Desa'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                                                <span>Dilaksanakan pada {formatDate(item.event_tanggal!)}</span>
                                            </div>
                                        </div>
                                        <Link href={`/informasi/berita/${item.slug}`} className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5 pt-2">
                                            Rincian Acara <ChevronRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 text-muted-foreground border bg-card rounded-2xl">
                                Tidak ada agenda kegiatan terdekat.
                            </div>
                        )}
                    </div>
                )}

                {/* 4. GALLERY GRID */}
                {type === 'galeri' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {konten.data.length > 0 ? (
                            konten.data.map(item => (
                                <div key={item.id} className="bg-card border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 group flex flex-col h-full">
                                    <div className="h-48 w-full bg-slate-200 dark:bg-zinc-800 relative overflow-hidden">
                                        <img
                                            src={`/storage/${item.gambar_utama}`}
                                            alt={item.judul}
                                            className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                            <Link href={`/informasi/berita/${item.slug}`} className="rounded-xl bg-white text-teal-950 px-4 py-2 text-xs font-bold flex items-center gap-1 shadow-md">
                                                <Image className="h-3.5 w-3.5" /> Lihat Artikel
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                                        <h3 className="font-bold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-teal-600 transition">
                                            <Link href={`/informasi/berita/${item.slug}`}>{item.judul}</Link>
                                        </h3>
                                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold block pt-1 border-t">
                                            {formatDate(item.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 text-muted-foreground border bg-card rounded-2xl">
                                Belum ada foto kegiatan terunggah.
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {konten.last_page > 1 && (
                    <div className="flex items-center justify-between border-t pt-6 bg-transparent">
                        <span className="text-xs text-muted-foreground">
                            Halaman {konten.current_page} dari {konten.last_page} ({konten.total} data)
                        </span>
                        <div className="flex gap-1">
                            {konten.links.map((link, idx) => {
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
                                                ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
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
        </PortalLayout>
    );
}
