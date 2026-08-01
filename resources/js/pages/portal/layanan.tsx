import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    Megaphone,
    Clock,
    Lock,
    HelpCircle,
    CheckCircle
} from 'lucide-react';
import PortalLayout from '@/layouts/portal-layout';

interface Settings {
    kop_nama_desa?: string;
    [key: string]: string | undefined;
}

interface Props {
    settings: Settings;
}

export default function Layanan({ settings }: Props) {
    const desaName = settings.kop_nama_desa || 'CIRANGKONG';

    const suratLayanan = [
        { nama: 'Surat Keterangan Usaha (SKU)', deskripsi: 'Untuk keperluan pengajuan modal usaha, izin usaha mikro, atau administrasi perbankan.' },
        { nama: 'Surat Keterangan Tidak Mampu (SKTM)', deskripsi: 'Untuk keringanan biaya sekolah, pengajuan beasiswa, atau jaminan kesehatan daerah.' },
        { nama: 'Surat Keterangan Domisili', deskripsi: 'Untuk menerangkan domisili tinggal sementara atau pembukaan cabang usaha di wilayah desa.' },
        { nama: 'Surat Keterangan Kelahiran / Kematian', deskripsi: 'Untuk pelaporan administrasi kependudukan tingkat RT/RW dan pengurusan akta sipil.' },
    ];

    return (
        <PortalLayout title="Layanan Warga" settings={settings as any}>
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white py-12 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-teal-200 font-bold uppercase tracking-wider">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span className="opacity-55">/</span>
                        <span>Layanan Warga</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pelayanan Online</h1>
                    <p className="text-sm text-teal-100 max-w-2xl font-light">
                        Pusat pengajuan berkas administrasi dan pengaduan warga secara digital mandiri Desa {desaName}.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

                {/* Intro Callout */}
                <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <Clock className="h-10 w-10 text-amber-600 shrink-0" />
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-0.5 rounded-full tracking-wider">Fase Uji Coba</span>
                        <h3 className="font-extrabold text-slate-800 dark:text-zinc-100 text-base">Layanan Digital Sedang Dipersiapkan</h3>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Saat ini sistem persuratan mandiri online sedang dalam tahap konfigurasi internal oleh perangkat desa. Layanan ini akan segera diluncurkan secara publik dalam waktu dekat.
                        </p>
                    </div>
                </div>

                {/* Surat Category */}
                <div className="space-y-6">
                    <div className="border-b pb-3 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-teal-600" />
                        <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100">Pelayanan Persuratan (Segera Hadir)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {suratLayanan.map((surat, index) => (
                            <div key={index} className="bg-card border p-6 rounded-2xl shadow-xs hover:shadow-md transition relative overflow-hidden group">
                                <div className="absolute right-4 top-4 bg-muted text-muted-foreground/60 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Lock className="h-3 w-3" /> Segera Hadir
                                </div>
                                <h3 className="font-bold text-sm text-foreground mt-2">{surat.nama}</h3>
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{surat.deskripsi}</p>
                                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <span>Persyaratan:</span>
                                    <span className="bg-slate-100 dark:bg-zinc-800 text-[10px] px-2 py-0.5 rounded-md font-semibold text-slate-500">KTP</span>
                                    <span className="bg-slate-100 dark:bg-zinc-800 text-[10px] px-2 py-0.5 rounded-md font-semibold text-slate-500">KK</span>
                                    <span className="bg-slate-100 dark:bg-zinc-800 text-[10px] px-2 py-0.5 rounded-md font-semibold text-slate-500">Pengantar RT/RW</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pengaduan Category */}
                <div className="space-y-6">
                    <div className="border-b pb-3 flex items-center gap-2">
                        <Megaphone className="h-6 w-6 text-teal-600" />
                        <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100">Portal Pengaduan & Aspirasi Warga (Segera Hadir)</h2>
                    </div>

                    <div className="bg-card border p-6 sm:p-8 rounded-2xl shadow-xs flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                        <div className="absolute right-4 top-4 bg-muted text-muted-foreground/60 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Segera Hadir
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-2xl p-4 shrink-0 border h-16 w-16 flex items-center justify-center">
                            <Megaphone className="h-8 w-8" />
                        </div>
                        <div className="space-y-2 flex-1 text-center md:text-left">
                            <h3 className="font-bold text-base text-foreground">Sistem Pengaduan Digital (SADESA Aduan)</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Sarana pelaporan gangguan fasilitas umum, kebersihan, keamanan, atau usulan pembangunan desa. Warga akan dapat mengunggah foto laporan, melacak status tindak lanjut, dan berkomunikasi dengan petugas secara real-time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-muted/10 border p-8 rounded-3xl space-y-6">
                    <h3 className="font-black text-slate-800 dark:text-zinc-100 text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-teal-600" /> Pertanyaan yang Sering Diajukan (FAQ)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-zinc-400">
                        <div className="space-y-2 bg-card p-4 rounded-xl border">
                            <h4 className="font-bold text-foreground">Bagaimana cara mengajukan surat saat ini?</h4>
                            <p className="leading-relaxed">Silakan datang langsung ke loket kantor pelayanan Desa Cirangkong dengan membawa berkas persyaratan fisik lengkap (KTP, KK, Surat Pengantar RT/RW).</p>
                        </div>
                        <div className="space-y-2 bg-card p-4 rounded-xl border">
                            <h4 className="font-bold text-foreground">Apakah pendaftaran akun warga sudah dibuka?</h4>
                            <p className="leading-relaxed">Ya, pendaftaran akun warga di portal SADESA sudah dibuka untuk tujuan pendataan penduduk dan integrasi layanan di masa mendatang.</p>
                        </div>
                    </div>
                </div>

            </div>
        </PortalLayout>
    );
}
