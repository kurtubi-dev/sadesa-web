import { Head, Link } from '@inertiajs/react';
import { Phone, Users } from 'lucide-react';
import PortalLayout from '@/layouts/portal-layout';

interface Pejabat {
    id: number;
    nama: string;
    jabatan: string;
    foto: string | null;
    kontak: string | null;
}

interface Settings {
    kop_nama_desa?: string;
    [key: string]: string | undefined;
}

interface Props {
    settings: Settings;
    pejabat: Pejabat[];
    title: string;
    deskripsi: string;
}

export default function BPD({ settings, pejabat, title, deskripsi }: Props) {
    const desaName = settings.kop_nama_desa || 'CIRANGKONG';

    return (
        <PortalLayout title={title} settings={settings as any}>
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white py-12 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-teal-200 font-bold uppercase tracking-wider">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span className="opacity-55">/</span>
                        <span>Pemerintahan</span>
                        <span className="opacity-55">/</span>
                        <span>BPD</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
                    <p className="text-sm text-teal-100 max-w-2xl font-light">{deskripsi}</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Organogram Callout / Baggian */}
                <div className="mb-16 text-center space-y-4">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-100">Bagan Keanggotaan BPD</h2>
                    <p className="text-xs text-muted-foreground max-w-xl mx-auto">
                        Berikut adalah susunan personil Badan Permusyawaratan Desa (BPD) Desa {desaName} periode masa jabatan aktif.
                    </p>
                    <div className="h-1.5 w-16 bg-teal-600 rounded-full mx-auto"></div>
                </div>

                {/* Grid of Pejabat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {pejabat.length > 0 ? (
                        pejabat.map((item) => (
                            <div key={item.id} className="bg-card border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col items-center p-6 text-center">
                                {/* Profile Picture container */}
                                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-teal-500/20 bg-slate-100 dark:bg-zinc-800 mb-4 shadow-inner relative group">
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
                                        <div className="h-full w-full flex items-center justify-center font-black text-teal-600 bg-teal-50 dark:bg-teal-950/20 text-3xl">
                                            {item.nama.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Identity */}
                                <div className="space-y-1 flex-1">
                                    <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100 line-clamp-1">{item.nama}</h3>
                                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{item.jabatan}</p>
                                </div>

                                {/* Contact Actions */}
                                {item.kontak && (
                                    <div className="mt-4 pt-3 border-t w-full flex justify-center">
                                        <a
                                            href={`https://wa.me/${item.kontak.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition"
                                        >
                                            <Phone className="h-3.5 w-3.5" />
                                            <span>Hubungi WA</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            Data BPD belum diunggah.
                        </div>
                    )}
                </div>

            </div>
        </PortalLayout>
    );
}
