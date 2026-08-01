import { Head, useForm, usePage } from '@inertiajs/react';
import { 
    MapPin, 
    Phone, 
    Mail, 
    CheckCircle, 
    Loader2, 
    Send,
    Map
} from 'lucide-react';
import { useEffect, useState } from 'react';
import PortalLayout from '@/layouts/portal-layout';

interface Settings {
    kop_nama_desa?: string;
    kop_alamat?: string;
    kop_telepon?: string;
    kop_email?: string;
    [key: string]: string | undefined;
}

interface Props {
    settings: Settings;
    flash?: { success?: string };
}

export default function Kontak({ settings, flash }: Props) {
    const desaName = settings.kop_nama_desa || 'CIRANGKONG';
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_pengunjung: '',
        instansi:        '',
        keperluan:       '',
        no_hp:           '',
    });

    useEffect(() => {
        if (flash?.success) {
            setSubmitted(true);
            reset();
        }
    }, [flash?.success]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kontak', {
            preserveScroll: true,
        });
    };

    return (
        <PortalLayout title="Hubungi Kami" settings={settings as any}>
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-teal-950 to-emerald-900 text-white py-16 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-teal-200 font-bold uppercase tracking-wider">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span className="opacity-55">/</span>
                        <span>Hubungi Kami</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Kontak & Buku Tamu</h1>
                    <p className="text-base text-teal-100 max-w-2xl font-medium">
                        Kunjungi kantor desa kami, hubungi layanan admisi, atau catat kunjungan Anda secara resmi melalui buku tamu digital.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Side: Contact Information & Map (Span 5) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-card border p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
                            <h2 className="text-xl font-extrabold text-foreground">Informasi Kontak</h2>
                            <div className="h-1 w-12 bg-teal-600 rounded-full"></div>
                            
                            <div className="space-y-5 text-sm">
                                <div className="flex gap-4">
                                    <div className="bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-xl p-3 h-11 w-11 flex items-center justify-center border shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Alamat Kantor</h4>
                                        <p className="text-slate-700 dark:text-zinc-300 leading-relaxed">
                                            {settings.kop_alamat || 'Jl. Lempar - Cirangkong KM. 08, Desa Cirangkong, Kecamatan Cijambe, Kabupaten Subang, Jawa Barat 41286'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-xl p-3 h-11 w-11 flex items-center justify-center border shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Telepon / WhatsApp</h4>
                                        <p className="text-slate-700 dark:text-zinc-300 font-mono">
                                            {settings.kop_telepon || 'Belum diunggah'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-xl p-3 h-11 w-11 flex items-center justify-center border shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Email Resmi</h4>
                                        <p className="text-slate-700 dark:text-zinc-300 font-mono">
                                            {settings.kop_email || 'Belum diunggah'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Google Map of Cirangkong */}
                        <div className="overflow-hidden rounded-3xl border shadow-sm h-72 relative bg-muted/20">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15852.128770742186!2d107.72898952402123!3d-6.642878480397554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6931752b0cfeb9%3A0xc07ce9a2a90098df!2sCirangkong%2C%20Cijambe%2C%20Subang%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
                                className="w-full h-full border-0 absolute inset-0"
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* Right Side: Guestbook Form (Span 7) */}
                    <div className="lg:col-span-7">
                        {submitted ? (
                            <div className="bg-card border rounded-3xl p-10 text-center shadow-sm space-y-6 animate-in fade-in duration-200">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/30">
                                    <CheckCircle className="h-9 w-9 text-teal-600" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-extrabold text-foreground">Terima Kasih!</h2>
                                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                        Data kehadiran dan tujuan kunjungan Anda telah berhasil dicatat ke dalam Buku Tamu resmi Desa {desaName}.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSubmitted(false)}
                                    className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 transition"
                                >
                                    Isi Ulang (Tamu Lain)
                                </button>
                            </div>
                        ) : (
                            <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-extrabold text-foreground">Buku Tamu Digital</h2>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Silakan isi data kunjungan Anda apabila bertamu ke Kantor Desa {desaName}.
                                    </p>
                                </div>
                                <div className="h-0.5 bg-border/60"></div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Nama */}
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Nama Pengunjung <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nama_pengunjung}
                                            onChange={e => setData('nama_pengunjung', e.target.value)}
                                            placeholder="Masukkan nama lengkap Anda"
                                            className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required
                                        />
                                        {errors.nama_pengunjung && (
                                            <p className="mt-1 text-xs text-red-500">{errors.nama_pengunjung}</p>
                                        )}
                                    </div>

                                    {/* Instansi */}
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Instansi / Asal Lembaga <span className="text-[10px] font-normal text-muted-foreground uppercase">(opsional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.instansi}
                                            onChange={e => setData('instansi', e.target.value)}
                                            placeholder="Masukkan nama instansi, RT/RW, atau sekolah"
                                            className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>

                                    {/* Keperluan */}
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Keperluan Kunjungan <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.keperluan}
                                            onChange={e => setData('keperluan', e.target.value)}
                                            placeholder="Jelaskan secara singkat maksud dan tujuan bertamu..."
                                            rows={4}
                                            className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                            required
                                        />
                                        {errors.keperluan && (
                                            <p className="mt-1 text-xs text-red-500">{errors.keperluan}</p>
                                        )}
                                    </div>

                                    {/* No HP */}
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Nomor HP / WA <span className="text-[10px] font-normal text-muted-foreground uppercase">(opsional)</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.no_hp}
                                            onChange={e => setData('no_hp', e.target.value)}
                                            placeholder="Contoh: 081234567890"
                                            className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {errors.no_hp && (
                                            <p className="mt-1 text-xs text-red-500">{errors.no_hp}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white shadow hover:bg-teal-700 disabled:opacity-60 transition"
                                    >
                                        {processing ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Mencatat...</>
                                        ) : (
                                            <><Send className="h-4 w-4" /> Catat Kehadiran</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </PortalLayout>
    );
}

// Sub-components
import { Link } from '@inertiajs/react';
