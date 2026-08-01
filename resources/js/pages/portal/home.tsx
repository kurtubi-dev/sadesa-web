import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    ChevronRight,
    FileText,
    MapPin,
    Newspaper,
    ArrowRight,
    Clock,
    Eye,
    Award,
    Shield,
    Heart,
    UserCheck,
    Volume2,
    CalendarDays
} from 'lucide-react';
import PortalLayout from '@/layouts/portal-layout';

interface BeritaItem {
    id: number;
    judul: string;
    slug: string;
    tipe: string;
    gambar_utama: string | null;
    meta_description: string | null;
    created_at: string;
}

interface PengumumanItem {
    id: number;
    judul: string;
    slug: string;
    tipe: string;
    created_at: string;
}

interface AgendaItem {
    id: number;
    judul: string;
    slug: string;
    event_tanggal: string;
    event_lokasi: string;
}

interface Pejabat {
    id: number;
    nama: string;
    jabatan: string;
    foto: string | null;
}

interface Settings {
    kop_nama_desa?: string;
    kop_kecamatan?: string;
    kop_kabupaten?: string;
    kop_alamat?: string;
    kop_telepon?: string;
    kades_nama?: string;
    kades_jabatan?: string;
    [key: string]: string | undefined;
}

interface Props {
    settings: Settings;
    berita: BeritaItem[];
    pengumuman: PengumumanItem[];
    agenda: AgendaItem[];
    featured: BeritaItem | null;
    kades: Pejabat | null;
}

export default function Home({ settings, berita, pengumuman, agenda, featured, kades }: Props) {
    const desaName = settings.kop_nama_desa || 'CIRANGKONG';
    const kadesName = kades?.nama || settings.kades_nama || 'Asep Sutia';
    const kadesFoto = kades?.foto ? `/storage/${kades.foto}` : '/images/default-kades.png';

    // Format date Indonesian style
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <PortalLayout title="Beranda" settings={settings as any}>
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white overflow-hidden -mt-8 sm:-mt-16 py-20 px-4">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

                {/* Soft glow */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse duration-5000"></div>

                <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Welcome Text */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-800/60 border border-teal-700/50 backdrop-blur-xs text-xs font-bold text-teal-300 uppercase tracking-widest">
                            <Volume2 className="h-3.5 w-3.5" /> Portal Resmi Pemerintahan Desa
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                            Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">Desa {desaName}</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Pusat informasi resmi, transparansi tata kelola, dan akses layanan digital terpadu bagi segenap masyarakat Desa {desaName}, Kecamatan {settings.kop_kecamatan || 'Cijambe'}, Kabupaten {settings.kop_kabupaten || 'Subang'}.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/layanan" className="rounded-xl bg-teal-400 hover:bg-teal-300 px-6 py-4 text-[15px] font-bold text-teal-950 shadow-lg hover:shadow-teal-500/20 transition flex items-center justify-center gap-2">
                                Layanan Online Mandiri <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/profil" className="rounded-xl bg-teal-950/60 hover:bg-teal-900/80 px-6 py-4 text-[15px] font-bold text-white border border-teal-700/40 hover:border-teal-600 transition flex items-center justify-center">
                                Jelajahi Profil Desa
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition group">
                            <UserCheck className="h-9 w-9 text-teal-300 mb-3 group-hover:scale-110 transition duration-300" />
                            <p className="text-3xl font-black text-white">4.250+</p>
                            <p className="text-sm text-teal-100 uppercase font-extrabold tracking-wider mt-1.5">Penduduk</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition group">
                            <Award className="h-9 w-9 text-teal-300 mb-3 group-hover:scale-110 transition duration-300" />
                            <p className="text-3xl font-black text-white">100%</p>
                            <p className="text-sm text-teal-100 uppercase font-extrabold tracking-wider mt-1.5">Pelayanan Prima</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition group">
                            <Shield className="h-9 w-9 text-teal-300 mb-3 group-hover:scale-110 transition duration-300" />
                            <p className="text-3xl font-black text-white">Aman</p>
                            <p className="text-sm text-teal-100 uppercase font-extrabold tracking-wider mt-1.5">Kondusifitas</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition group">
                            <Heart className="h-9 w-9 text-teal-300 mb-3 group-hover:scale-110 transition duration-300" />
                            <p className="text-3xl font-black text-white">Guyub</p>
                            <p className="text-sm text-teal-100 uppercase font-extrabold tracking-wider mt-1.5">Gotong Royong</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Welcome & Greetings Section */}
            <section className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border shadow-xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-4 flex flex-col items-center">
                        <div className="relative h-64 w-52 rounded-2xl overflow-hidden shadow-lg border-4 border-teal-500/20 bg-slate-100 dark:bg-zinc-800">
                            {kades?.foto ? (
                                <img
                                    src={kadesFoto}
                                    alt={kadesName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-teal-600 bg-teal-50 dark:bg-teal-950/20 p-4">
                                    <UserCheck className="h-16 w-16 mb-2 opacity-55" />
                                    <span className="text-center text-xs font-bold uppercase tracking-wider">{kadesName}</span>
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-zinc-100">{kadesName}</h3>
                            <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">{settings.kades_jabatan || 'Kepala Desa Cirangkong'}</p>
                        </div>
                    </div>
                    <div className="lg:col-span-8 space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-zinc-100 leading-tight">
                            Sambutan Kepala Desa Cirangkong
                        </h2>
                        <div className="h-1.5 w-20 bg-teal-600 rounded-full"></div>
                        <div className="text-slate-600 dark:text-zinc-300 leading-relaxed space-y-4 italic font-light text-base sm:text-lg">
                            <p>
                                "Sampurasun, warga Desa Cirangkong yang saya cintai. Puji dan syukur senantiasa kita panjatkan ke hadirat Tuhan Yang Maha Esa atas terwujudnya media informasi portal resmi ini."
                            </p>
                            <p>
                                "Situs web ini merupakan komitmen nyata kami untuk menghadirkan keterbukaan informasi publik, memudahkan akses administrasi secara elektronik, serta mengenalkan potensi unggulan pertanian dan kebudayaan Desa Cirangkong kepada dunia luar. Mari bersama-sama kita dukung kemajuan desa menuju Cirangkong Mandiri, Sejahtera, dan Berbudaya."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Grid: Berita, Pengumuman & Agenda */}
            <section className="bg-slate-100/60 dark:bg-zinc-900/30 py-24 border-y">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Berita List (Left Col - Span 8) */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex justify-between items-center border-b pb-4">
                                <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                                    <Newspaper className="h-6 w-6 text-teal-600" /> Kabar Desa
                                </h2>
                                <Link href="/informasi/berita" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                                    Lihat Semua Berita <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {berita.length > 0 ? (
                                    berita.map((item) => (
                                        <article key={item.id} className="bg-card border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col h-full">
                                            <div className="h-44 w-full bg-slate-200 dark:bg-zinc-800 relative overflow-hidden">
                                                {item.gambar_utama ? (
                                                    <img
                                                        src={`/storage/${item.gambar_utama}`}
                                                        alt={item.judul}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-teal-600/30 bg-teal-50 dark:bg-teal-950/20">
                                                        <Newspaper className="h-10 w-10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                                                        <Clock className="h-3 w-3 text-teal-500" />
                                                        <span>{formatDate(item.created_at)}</span>
                                                    </div>
                                                    <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100 line-clamp-2 hover:text-teal-600 transition leading-snug">
                                                        <Link href={`/informasi/berita/${item.slug}`}>{item.judul}</Link>
                                                    </h3>
                                                    {item.meta_description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                            {item.meta_description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Link href={`/informasi/berita/${item.slug}`} className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 pt-2 border-t mt-auto">
                                                    Baca Selengkapnya <ChevronRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                                        Belum ada berita dipublikasikan.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar: Pengumuman & Agenda (Right Col - Span 4) */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* Pengumuman */}
                            <div className="space-y-4">
                                <div className="border-b pb-3 flex justify-between items-center">
                                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                                        <Volume2 className="h-5 w-5 text-amber-500" /> Pengumuman
                                    </h2>
                                    <Link href="/informasi/pengumuman" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                                        Semua
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {pengumuman.length > 0 ? (
                                        pengumuman.map((item) => (
                                            <div key={item.id} className="bg-card border p-4 rounded-xl shadow-xs hover:border-teal-500/50 transition">
                                                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 rounded-full px-2 py-0.5 uppercase tracking-wider">
                                                    Pengumuman
                                                </span>
                                                <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100 mt-2 hover:text-teal-600 transition line-clamp-2">
                                                    <Link href={`/informasi/berita/${item.slug}`}>{item.judul}</Link>
                                                </h3>
                                                <span className="text-[10px] text-muted-foreground mt-2 block font-medium">
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground text-center py-4">Belum ada pengumuman.</p>
                                    )}
                                </div>
                            </div>

                            {/* Agenda */}
                            <div className="space-y-4">
                                <div className="border-b pb-3 flex justify-between items-center">
                                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5 text-teal-600" /> Agenda Kegiatan
                                    </h2>
                                    <Link href="/informasi/agenda" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                                        Semua
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {agenda.length > 0 ? (
                                        agenda.map((item) => (
                                            <div key={item.id} className="bg-card border p-4 rounded-xl shadow-xs hover:border-teal-500/50 transition flex gap-3.5 items-start">
                                                <div className="bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 rounded-xl p-2.5 shrink-0 flex flex-col items-center justify-center h-12 w-12 border">
                                                    <span className="text-[10px] uppercase font-extrabold leading-none">
                                                        {new Date(item.event_tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                                                    </span>
                                                    <span className="text-base font-black leading-none mt-1">
                                                        {new Date(item.event_tanggal).getDate()}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 min-w-0">
                                                    <h3 className="font-bold text-xs text-slate-800 dark:text-zinc-100 hover:text-teal-600 transition line-clamp-2 leading-snug">
                                                        <Link href={`/informasi/berita/${item.slug}`}>{item.judul}</Link>
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <MapPin className="h-3 w-3 shrink-0 text-teal-600" />
                                                        <span className="truncate">{item.event_lokasi || 'Kantor Desa'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground text-center py-4">Belum ada agenda terdekat.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Services Links Banner */}
            <section className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold">Memerlukan Layanan Administrasi Surat & Laporan?</h2>
                    <p className="text-sm text-teal-100 max-w-xl mx-auto">
                        Pemerintah Desa Cirangkong siap melayani pengajuan surat keterangan secara digital terpadu melalui Portal Layanan SADESA.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/layanan" className="bg-white text-teal-900 font-bold px-6 py-3 rounded-xl shadow hover:bg-teal-50 transition">
                            Lihat Layanan
                        </Link>
                        <Link href="/kontak" className="bg-teal-900/60 border border-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-teal-900/80 transition">
                            Hubungi Kami / Isi Buku Tamu
                        </Link>
                    </div>
                </div>
            </section>
        </PortalLayout>
    );
}
