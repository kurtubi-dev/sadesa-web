import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Newspaper, Megaphone, Clock, Share2, MapPin as MapPinIcon, Download, Check } from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';

interface Artikel {
    id: number;
    judul: string;
    slug: string;
    konten: string;
    tipe: string;
    kategori?: string;
    gambar_utama?: string | null;
    lampiran_pdf?: string | null;
    event_tanggal?: string | null;
    event_lokasi?: string | null;
    views_count?: number;
    created_at: string;
    admin?: { id: number; name: string } | null;
}

interface TerkaitItem {
    id: number;
    judul: string;
    slug: string;
    tipe: string;
    gambar_utama?: string | null;
    created_at: string;
}

interface Props {
    artikel: Artikel;
    terkait: TerkaitItem[];
}

const getReadTime = (html: string) => {
    if (!html) return 0;
    const plain = html.replace(/<[^>]*>/g, ' ');
    const words = plain.split(/\s+/).length;
    return Math.ceil(words / 200); // 200 words per minute average
};

export default function InformasiShow({ artikel, terkait }: Props) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `${artikel.judul} - SADESA Desa Cirangkong`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PublicLayout>
            <Head title={`${artikel.judul} | Informasi Resmi Desa Cirangkong`} />

            <div className="bg-muted min-h-screen py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb / Back */}
                    <nav className="mb-8">
                        <Link
                            href="/informasi"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Pusat Informasi
                        </Link>
                    </nav>

                    <div className="grid gap-10 lg:grid-cols-3">
                        {/* Artikel utama */}
                        <div className="lg:col-span-2">
                            <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                                {/* Gambar Utama Cover Banner (Jika ada) */}
                                {artikel.gambar_utama && (
                                    <div className="w-full h-72 lg:h-96 relative overflow-hidden bg-muted">
                                        <img 
                                            src={`/storage/${artikel.gambar_utama}`} 
                                            alt={artikel.judul} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Header Artikel */}
                                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-10 text-white relative">
                                    <div className="absolute top-0 right-0 p-10 opacity-10 font-bold text-8xl select-none">DOC</div>
                                    <div className="relative z-10">
                                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                            {artikel.tipe === 'berita' ? <Newspaper className="h-3 w-3" /> : <Megaphone className="h-3 w-3" />}
                                            {artikel.tipe}
                                        </div>
                                        <span className="ml-2 rounded-full bg-black/35 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                            {artikel.kategori ?? 'Umum'}
                                        </span>
                                        <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl mt-3">
                                            {artikel.judul}
                                        </h1>
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-6 border-b border-border bg-muted/30 px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-4 w-4 text-teal-600" />
                                        <span>Penulis: {artikel.admin?.name ?? 'Pemerintah Desa'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-teal-600" />
                                        <span>{new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-teal-600" />
                                        <span>{getReadTime(artikel.konten)} Menit Baca</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Share2 className="h-4 w-4 text-teal-600" />
                                        <span>Dibaca: {artikel.views_count ?? 0} Kali</span>
                                    </div>
                                </div>

                                {/* Konten */}
                                <div className="p-8 sm:p-10">
                                    <div 
                                        className="prose prose-teal max-w-none dark:prose-invert"
                                        dangerouslySetInnerHTML={{ __html: artikel.konten }}
                                    />

                                    {/* Lampiran Dokumen PDF Card (Jika ada) */}
                                    {artikel.lampiran_pdf && (
                                        <div className="mt-8 border border-teal-100 bg-teal-50/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-teal-100 rounded-xl text-teal-600">
                                                    <Megaphone className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-foreground">Dokumen Lampiran Resmi</h4>
                                                    <p className="text-xs text-muted-foreground">Unduh berkas PDF dokumen resmi desa terkait artikel ini.</p>
                                                </div>
                                            </div>
                                            <a 
                                                href={`/storage/${artikel.lampiran_pdf}`} 
                                                download 
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition shadow-sm shrink-0"
                                            >
                                                <Download className="h-4 w-4" /> Unduh Lampiran PDF
                                            </a>
                                        </div>
                                    )}

                                    {/* Footer Artikel & Share Bar */}
                                    <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t pt-8 border-border">
                                        <div className="text-xs text-muted-foreground italic">
                                            * Informasi ini dipublikasikan secara resmi oleh Pemerintah Desa Cirangkong.
                                        </div>
                                        
                                        {/* Colored Share buttons */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-muted-foreground mr-1">Bagikan:</span>
                                            <a 
                                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                                                title="Bagikan ke WhatsApp"
                                            >
                                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.485.002 9.948-4.463 9.95-9.952.002-2.66-1.033-5.161-2.91-7.04C16.438 1.776 13.934 1.748 12.01 1.748c-5.486 0-9.95 4.464-9.952 9.954-.001 1.737.457 3.432 1.326 4.928l-.995 3.633 3.738-.979z"/>
                                                </svg>
                                            </a>
                                            <a 
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                                                title="Bagikan ke Facebook"
                                            >
                                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                </svg>
                                            </a>
                                            <button 
                                                onClick={handleCopy}
                                                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                                                title="Salin Tautan"
                                            >
                                                {copied ? <Check className="h-4 w-4 text-emerald-600 animate-pulse" /> : <Share2 className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-8">
                            
                            {/* Widget Agenda Acara */}
                            {(artikel.event_tanggal || artikel.event_lokasi) && (
                                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                                        <Calendar className="h-5 w-5 text-teal-600" />
                                        Agenda / Jadwal Kegiatan
                                    </h3>
                                    <div className="space-y-3 bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
                                        {artikel.event_tanggal && (
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-teal-700 tracking-wider">Tanggal & Hari</span>
                                                <span className="text-sm font-semibold text-foreground">
                                                    {new Date(artikel.event_tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                        {artikel.event_lokasi && (
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-teal-700 tracking-wider">Lokasi / Tempat</span>
                                                <span className="text-sm font-semibold text-foreground flex items-center gap-1 mt-0.5">
                                                    <MapPinIcon className="h-4 w-4 text-teal-600 shrink-0" />
                                                    {artikel.event_lokasi}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Artikel Terkait */}
                            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-foreground">
                                    <Newspaper className="h-5 w-5 text-teal-600" />
                                    {artikel.tipe === 'berita' ? 'Berita' : 'Pengumuman'} Lainnya
                                </h3>
                                {terkait.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">Tidak ada artikel terkait lainnya.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {terkait.map(item => (
                                            <Link
                                                key={item.id}
                                                href={`/informasi/${item.slug}`}
                                                className="group flex gap-3 items-start"
                                            >
                                                {item.gambar_utama && (
                                                    <img 
                                                        src={`/storage/${item.gambar_utama}`} 
                                                        alt={item.judul} 
                                                        className="w-16 h-12 object-cover rounded-lg border shrink-0 bg-muted"
                                                    />
                                                )}
                                                <div>
                                                    <p className="text-xs font-bold leading-snug text-foreground decoration-teal-500 decoration-2 group-hover:underline line-clamp-2">
                                                        {item.judul}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground font-medium mt-1">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-8">
                                    <Link
                                        href="/informasi"
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-50 py-3 text-sm font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400 transition"
                                    >
                                        Lihat Semua Informasi <ArrowLeft className="h-4 w-4 rotate-180" />
                                    </Link>
                                </div>
                            </div>

                            {/* Banner Layanan */}
                            <div className="rounded-3xl bg-gradient-to-br from-teal-700 to-emerald-800 p-8 text-white shadow-lg">
                                <h3 className="mb-3 text-lg font-bold italic opacity-90">Butuh Pelayanan Desa?</h3>
                                <p className="mb-6 text-sm leading-relaxed text-teal-100">
                                    Sekarang urus surat keterangan dan laporan jadi lebih mudah via Portal SADESA.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-md hover:bg-teal-50 transition"
                                >
                                    Masuk ke Portal
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
