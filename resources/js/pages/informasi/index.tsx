import { Head, Link, router } from '@inertiajs/react';
import { Search, Calendar, Newspaper, Megaphone } from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';

interface KontenItem {
    id: number;
    judul: string;
    slug: string;
    tipe: string;
    created_at: string;
    konten: string;
    gambar_utama?: string | null;
    kategori?: string | null;
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
    konten: Paginator<KontenItem>;
    featured?: KontenItem | null;
    filters: { tipe?: string; kategori?: string; search?: string };
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

// Estimasi waktu baca
const getReadTime = (html: string) => {
    const plain = stripHtml(html);
    const words = plain.split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // Rata-rata 200 kata per menit
    return minutes;
};

export default function InformasiIndex({ konten, featured, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const categories = [
        { key: 'Semua', label: '🌍 Semua Topik' },
        { key: 'Ekonomi', label: '💼 Ekonomi' },
        { key: 'Infrastruktur', label: '🏗️ Infrastruktur' },
        { key: 'Kesehatan', label: '🏥 Kesehatan' },
        { key: 'Pertanian', label: '🌾 Pertanian' },
        { key: 'Bantuan Sosial', label: '🎁 Bansos' },
        { key: 'Keamanan', label: '🛡️ Keamanan' },
    ];

    const applyFilter = (extra: Record<string, string>) =>
        router.get('/informasi', { ...filters, ...extra }, { preserveState: true });

    return (
        <PublicLayout>
            <Head title="Pusat Informasi & Berita Resmi | Pemerintah Desa Cirangkong" />

            <div className="bg-muted min-h-screen py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Page title */}
                    <div className="mb-10 text-center border-b pb-8 border-gray-200 dark:border-gray-800">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl tracking-tight">
                            Pusat Informasi & Berita Resmi
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-base text-gray-500 dark:text-gray-400">
                            Ikuti perkembangan terbaru, agenda kegiatan, pengumuman, dan pelayanan resmi dari Pemerintah Desa Cirangkong.
                        </p>
                    </div>

                    {/* Featured Article Banner (Only on first page and when search/filter is empty) */}
                    {featured && !filters.search && !filters.tipe && (!filters.kategori || filters.kategori === 'Semua') && (
                        <div className="mb-10 rounded-3xl overflow-hidden bg-card border border-border shadow-md grid grid-cols-1 lg:grid-cols-12">
                            {/* Left Image */}
                            <div className="lg:col-span-7 h-64 lg:h-96 relative bg-gradient-to-br from-teal-800 to-emerald-900">
                                {featured.gambar_utama ? (
                                    <img 
                                        src={`/storage/${featured.gambar_utama}`} 
                                        alt={featured.judul} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col justify-center items-center p-8 text-white/20 select-none">
                                        <Newspaper className="h-20 w-20 mb-2" />
                                        <span className="text-4xl font-extrabold tracking-wider">GOV CIRANGKONG</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-teal-600 text-white shadow-sm">
                                        ⭐ BERITA UTAMA
                                    </span>
                                    <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-900/60 text-white backdrop-blur-sm">
                                        {featured.kategori ?? 'Umum'}
                                    </span>
                                </div>
                            </div>
                            {/* Right Content */}
                            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-semibold">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 text-teal-600" />
                                        {new Date(featured.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                    <span>•</span>
                                    <span>{getReadTime(featured.konten ?? '')} menit baca</span>
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold leading-tight text-foreground hover:text-teal-600 transition mb-4">
                                    <Link href={`/informasi/${featured.slug}`}>
                                        {featured.judul}
                                    </Link>
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                                    {getExcerpt(featured.konten ?? '')}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                    <span className="text-xs text-muted-foreground">
                                        Oleh: <strong className="text-foreground">{featured.admin?.name ?? 'Pemerintah Desa'}</strong>
                                    </span>
                                    <Link 
                                        href={`/informasi/${featured.slug}`}
                                        className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition shadow-sm"
                                    >
                                        Baca Selengkapnya
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter & Search Bar */}
                    <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
                        {/* Tipe Filter */}
                        <div className="flex flex-wrap gap-1.5 shrink-0">
                            {(['', 'berita', 'pengumuman'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => applyFilter({ tipe: t })}
                                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 ${(filters.tipe ?? '') === t ? 'bg-teal-600 text-white shadow-sm' : 'border border-border hover:bg-muted text-muted-foreground'}`}
                                >
                                    {t === '' ? 'Semua Tipe' : t === 'berita' ? '📰 Berita' : '📢 Pengumuman'}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <form onSubmit={e => { e.preventDefault(); applyFilter({ search }); }} className="flex gap-2 w-full lg:w-auto">
                            <div className="relative w-full lg:w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari kata kunci berita…"
                                    className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-xs outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                            <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition shadow-sm">
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Horizontal Kategori Tabs */}
                    <div className="mb-8 overflow-x-auto scrollbar-none border-b border-border pb-1">
                        <div className="flex gap-2 min-w-max pb-1">
                            {categories.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => applyFilter({ kategori: cat.key })}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${(filters.kategori ?? 'Semua') === cat.key ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200' : 'hover:bg-muted text-muted-foreground border border-transparent'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid artikel */}
                    {konten.data.length === 0 ? (
                        <div className="py-24 text-center rounded-3xl bg-card border border-border shadow-sm">
                            <Newspaper className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-60" />
                            <h3 className="text-base font-bold text-foreground">Belum Ada Informasi</h3>
                            <p className="text-sm text-muted-foreground mt-1">Tidak ada berita atau pengumuman yang sesuai dengan kriteria penyaringan Anda.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {konten.data.map(item => (
                                <article key={item.id} className="group flex flex-col rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md overflow-hidden">
                                    {/* Cover image / Default gradient header */}
                                    <div className="h-48 relative overflow-hidden bg-gradient-to-br from-teal-600 to-emerald-700 flex flex-col justify-between text-white">
                                        {item.gambar_utama ? (
                                            <img 
                                                src={`/storage/${item.gambar_utama}`} 
                                                alt={item.judul} 
                                                className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute top-0 right-0 p-8 opacity-10 font-bold text-7xl select-none">GOV</div>
                                        )}
                                        {/* Overlay gradient over image */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30 z-0" />
                                        
                                        <div className="z-10 p-5 flex justify-between items-start w-full">
                                            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-teal-600/90 text-white backdrop-blur-sm">
                                                {item.tipe}
                                            </span>
                                            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/40 text-white backdrop-blur-sm">
                                                {item.kategori ?? 'Umum'}
                                            </span>
                                        </div>
                                        
                                        <div className="z-10 p-5 flex items-center gap-1.5 text-[10px] text-teal-100 font-medium">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <h2 className="mb-3 text-base font-bold leading-snug text-foreground group-hover:text-teal-600 transition line-clamp-2">
                                            <Link href={`/informasi/${item.slug}`}>
                                                {item.judul}
                                            </Link>
                                        </h2>
                                        <p className="mb-5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                                            {getExcerpt(item.konten)}
                                        </p>
                                        
                                        <div className="mt-auto flex items-center justify-between border-t pt-4 border-border text-[11px]">
                                            <span className="text-muted-foreground">
                                                Oleh: <strong className="text-foreground">{item.admin?.name ?? 'Pemerintah Desa'}</strong>
                                            </span>
                                            <Link href={`/informasi/${item.slug}`} className="flex items-center gap-1 font-bold text-teal-600 hover:text-teal-700">
                                                Baca Artikel →
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {konten.last_page > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-1">
                            {konten.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    preserveState
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${link.active ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10' : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
