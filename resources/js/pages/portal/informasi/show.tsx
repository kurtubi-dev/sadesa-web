import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Newspaper, Megaphone, Clock, Share2, MapPin, Download, Check, Eye } from 'lucide-react';
import { useState } from 'react';
import PortalLayout from '@/layouts/portal-layout';

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
    settings: any;
    artikel: Artikel;
    terkait: TerkaitItem[];
}

const getReadTime = (html: string) => {
    if (!html) return 0;
    const plain = html.replace(/<[^>]*>/g, ' ');
    const words = plain.split(/\s+/).length;
    return Math.ceil(words / 200); // 200 words per minute average
};

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function InformasiShow({ settings, artikel, terkait }: Props) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PortalLayout title={artikel.judul} settings={settings}>
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white py-12 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-teal-200 font-bold uppercase tracking-wider">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span className="opacity-55">/</span>
                        <Link href={`/informasi/${artikel.tipe}`} className="hover:text-white transition">Informasi</Link>
                        <span className="opacity-55">/</span>
                        <span className="truncate max-w-[200px] inline-block align-bottom">{artikel.judul}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                            {artikel.tipe === 'berita' ? <Newspaper className="h-3 w-3" /> : <Megaphone className="h-3 w-3" />}
                            {artikel.tipe}
                        </span>
                        <span className="rounded-full bg-black/35 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                            {artikel.kategori ?? 'Umum'}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-3 max-w-4xl leading-tight">
                        {artikel.judul}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Back button */}
                <Link
                    href={`/informasi/${artikel.tipe}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 transition mb-8"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar {artikel.tipe === 'berita' ? 'Berita' : 'Pengumuman'}
                </Link>

                <div className="grid gap-10 lg:grid-cols-12 items-start">
                    
                    {/* Main content (Col Span 8) */}
                    <div className="lg:col-span-8 bg-card border rounded-3xl overflow-hidden shadow-xs">
                        
                        {/* Featured Image */}
                        {artikel.gambar_utama && (
                            <div className="w-full h-72 sm:h-96 relative bg-slate-200">
                                <img 
                                    src={`/storage/${artikel.gambar_utama}`} 
                                    alt={artikel.judul} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Body */}
                        <div className="p-6 sm:p-10 space-y-6">
                            
                            {/* Metadata Row */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-b pb-4">
                                <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-teal-600" /> {formatDate(artikel.created_at)}</span>
                                <span className="flex items-center gap-1"><User className="h-4 w-4 text-teal-600" /> {artikel.admin?.name || 'Pemerintah Desa'}</span>
                                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-teal-600" /> {getReadTime(artikel.konten)} menit baca</span>
                                <span className="flex items-center gap-1"><Eye className="h-4 w-4 text-teal-600" /> {artikel.views_count ?? 0} kali dilihat</span>
                            </div>

                            {/* Event details callout (If event) */}
                            {artikel.event_tanggal && (
                                <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/10 rounded-2xl space-y-2">
                                    <h4 className="font-extrabold text-xs text-teal-800 dark:text-teal-400 uppercase tracking-wider">Rincian Jadwal / Acara:</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
                                            <span>Tanggal: <strong>{formatDate(artikel.event_tanggal)}</strong></span>
                                        </div>
                                        {artikel.event_lokasi && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                                                <span>Lokasi: <strong>{artikel.event_lokasi}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Main Text Content */}
                            <div 
                                className="prose dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 leading-relaxed font-light text-base space-y-4"
                                dangerouslySetInnerHTML={{ __html: artikel.konten }}
                            />

                            {/* PDF Attachment (If exists) */}
                            {artikel.lampiran_pdf && (
                                <div className="mt-8 p-5 border bg-muted/20 rounded-2xl flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm text-foreground">Lampiran Berkas Pendukung</h4>
                                        <p className="text-xs text-muted-foreground">Format PDF, Dokumen Resmi Terlampir.</p>
                                    </div>
                                    <a
                                        href={`/storage/${artikel.lampiran_pdf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 transition flex items-center gap-1.5 shrink-0"
                                    >
                                        <Download className="h-4 w-4" /> Unduh PDF
                                    </a>
                                </div>
                            )}

                            {/* Actions Footer */}
                            <div className="border-t pt-6 flex flex-wrap gap-4 items-center justify-between">
                                <span className="text-xs text-muted-foreground">Bagikan artikel ini:</span>
                                <button
                                    onClick={handleCopy}
                                    className="rounded-xl border px-4 py-2 text-xs font-bold flex items-center gap-1.5 hover:bg-muted transition"
                                >
                                    {copied ? (
                                        <><Check className="h-4 w-4 text-green-600" /> Tersalin!</>
                                    ) : (
                                        <><Share2 className="h-4 w-4 text-teal-600" /> Salin Tautan</>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Sidebar / Related articles (Col Span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card border p-6 rounded-3xl shadow-xs space-y-5">
                            <h3 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm uppercase tracking-wider border-b pb-2">
                                Kabar Terkait Lainnya
                            </h3>
                            
                            <div className="space-y-4">
                                {terkait.length > 0 ? (
                                    terkait.map(item => (
                                        <div key={item.id} className="flex gap-3.5 items-start group">
                                            <div className="h-14 w-18 shrink-0 overflow-hidden rounded-xl border bg-slate-100 dark:bg-zinc-800 relative">
                                                {item.gambar_utama ? (
                                                    <img
                                                        src={`/storage/${item.gambar_utama}`}
                                                        alt={item.judul}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-teal-600/30 bg-teal-50 dark:bg-teal-950/20">
                                                        <Newspaper className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100 hover:text-teal-600 transition leading-snug line-clamp-2">
                                                    <Link href={`/informasi/berita/${item.slug}`}>{item.judul}</Link>
                                                </h4>
                                                <span className="text-[10px] text-muted-foreground block font-medium">
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground text-center py-4">Tidak ada kabar terkait.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </PortalLayout>
    );
}

// Imports
import { ArrowLeft } from 'lucide-react';
