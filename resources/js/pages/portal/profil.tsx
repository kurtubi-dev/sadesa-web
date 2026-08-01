import { Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Compass, 
    Users, 
    Target, 
    MapPin,
    ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import PortalLayout from '@/layouts/portal-layout';

interface Settings {
    kop_nama_desa?: string;
    profil_sejarah?: string;
    profil_visi?: string;
    profil_misi?: string;
    profil_geografis?: string;
    profil_demografi?: string;
    [key: string]: string | undefined;
}

interface Props {
    settings: Settings;
}

export default function Profil({ settings }: Props) {
    const desaName = settings.kop_nama_desa || 'CIRANGKONG';
    const [activeTab, setActiveTab] = useState<'sejarah' | 'visi-misi' | 'geografis' | 'demografi'>('sejarah');

    // Handle hash anchors on mount or click
    useEffect(() => {
        const hash = window.location.hash;
        const timer = setTimeout(() => {
            if (hash === '#sejarah') {
                setActiveTab('sejarah');
            } else if (hash === '#visi-misi') {
                setActiveTab('visi-misi');
            } else if (hash === '#geografis') {
                setActiveTab('geografis');
            } else if (hash === '#demografi') {
                setActiveTab('demografi');
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        window.history.pushState(null, '', `#${tab}`);
    };

    return (
        <PortalLayout title="Profil Desa" settings={settings as any}>
            {/* Page Header banner */}
            <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white py-16 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-teal-200 font-bold uppercase tracking-wider">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span className="opacity-55">/</span>
                        <span>Profil Desa</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Profil Desa {desaName}</h1>
                    <p className="text-base text-teal-100 max-w-2xl font-medium">
                        Mengenal lebih dekat sejarah, visi dan misi pembangunan, letak geografis, serta kependudukan Desa {desaName}.
                    </p>
                </div>
            </div>

            {/* Main content grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Sticky Tab Menu (Span 3) */}
                    <div className="lg:col-span-3 lg:sticky lg:top-36 bg-card border rounded-2xl p-4 shadow-sm space-y-1">
                        <button
                            onClick={() => handleTabChange('sejarah')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition text-left ${
                                activeTab === 'sejarah'
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <BookOpen className="h-5 w-5 shrink-0" />
                            <span>Sejarah Desa</span>
                        </button>
                        
                        <button
                            onClick={() => handleTabChange('visi-misi')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition text-left ${
                                activeTab === 'visi-misi'
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <Target className="h-5 w-5 shrink-0" />
                            <span>Visi & Misi</span>
                        </button>

                        <button
                            onClick={() => handleTabChange('geografis')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition text-left ${
                                activeTab === 'geografis'
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <Compass className="h-5 w-5 shrink-0" />
                            <span>Kondisi Geografis</span>
                        </button>

                        <button
                            onClick={() => handleTabChange('demografi')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition text-left ${
                                activeTab === 'demografi'
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <Users className="h-5 w-5 shrink-0" />
                            <span>Demografi Kependudukan</span>
                        </button>
                    </div>

                    {/* Right: Tab Contents (Span 9) */}
                    <div className="lg:col-span-9 bg-card border rounded-3xl p-6 sm:p-10 shadow-sm min-h-[50vh]">
                        {/* Sejarah */}
                        {activeTab === 'sejarah' && (
                            <div className="space-y-6 animate-in fade-in duration-200">
                                <div className="flex items-center gap-3 pb-3 border-b">
                                    <BookOpen className="h-7 w-7 text-teal-600" />
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-100">Sejarah Desa Cirangkong</h2>
                                </div>
                                <div 
                                    className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 leading-relaxed space-y-4 font-light"
                                    dangerouslySetInnerHTML={{ __html: settings.profil_sejarah || '<p>Informasi sejarah belum diunggah.</p>' }}
                                />
                            </div>
                        )}

                        {/* Visi & Misi */}
                        {activeTab === 'visi-misi' && (
                            <div className="space-y-8 animate-in fade-in duration-200">
                                <div className="flex items-center gap-3 pb-3 border-b">
                                    <Target className="h-7 w-7 text-teal-600" />
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-100">Visi & Misi Desa Cirangkong</h2>
                                </div>

                                {/* Visi Card */}
                                <div className="bg-teal-50/50 dark:bg-teal-950/10 border border-teal-500/10 rounded-2xl p-6 sm:p-8 space-y-3">
                                    <span className="text-[10px] font-extrabold text-teal-700 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300 px-3 py-1 rounded-full uppercase tracking-wider">
                                        Visi Desa
                                    </span>
                                    <div 
                                        className="text-lg font-bold text-slate-800 dark:text-zinc-100 italic leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: settings.profil_visi || '<p>Visi belum diunggah.</p>' }}
                                    />
                                </div>

                                {/* Misi Card */}
                                <div className="space-y-4">
                                    <h3 className="font-extrabold text-slate-800 dark:text-zinc-100 uppercase tracking-wider text-xs">Misi Pembangunan Desa</h3>
                                    <div 
                                        className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 leading-relaxed list-decimal pl-5 space-y-3 font-light"
                                        dangerouslySetInnerHTML={{ __html: settings.profil_misi || '<p>Misi belum diunggah.</p>' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Geografis */}
                        {activeTab === 'geografis' && (
                            <div className="space-y-6 animate-in fade-in duration-200">
                                <div className="flex items-center gap-3 pb-3 border-b">
                                    <Compass className="h-7 w-7 text-teal-600" />
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-100">Kondisi Geografis Desa</h2>
                                </div>
                                <div 
                                    className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 leading-relaxed space-y-4 font-light"
                                    dangerouslySetInnerHTML={{ __html: settings.profil_geografis || '<p>Informasi geografis belum diunggah.</p>' }}
                                />
                                
                                {/* Static map call-out */}
                                <div className="mt-6 flex flex-col sm:flex-row items-center gap-5 p-5 border bg-muted/20 rounded-2xl">
                                    <MapPin className="h-10 w-10 text-teal-600 shrink-0" />
                                    <div className="space-y-1 text-center sm:text-left">
                                        <h4 className="font-bold text-sm text-foreground">Lokasi Administratif Desa Cirangkong</h4>
                                        <p className="text-xs text-muted-foreground">Kecamatan Cijambe, Kabupaten Subang, Provinsi Jawa Barat.</p>
                                    </div>
                                    <Link href="/kontak" className="sm:ml-auto rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 transition flex items-center gap-1 shrink-0">
                                        Lihat Peta Google Maps <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Demografi */}
                        {activeTab === 'demografi' && (
                            <div className="space-y-6 animate-in fade-in duration-200">
                                <div className="flex items-center gap-3 pb-3 border-b">
                                    <Users className="h-7 w-7 text-teal-600" />
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-100">Demografi Kependudukan</h2>
                                </div>
                                <div 
                                    className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-zinc-300 leading-relaxed space-y-4 font-light"
                                    dangerouslySetInnerHTML={{ __html: settings.profil_demografi || '<p>Informasi demografi belum diunggah.</p>' }}
                                />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </PortalLayout>
    );
}

// Sub-component for Link
