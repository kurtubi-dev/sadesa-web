import { Head, Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
    Youtube,
    ChevronDown,
    Moon,
    Sun,
    Monitor,
    ChevronRight,
    Users,
    Newspaper,
    Calendar,
    Image,
    FileText,
    Building2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { dashboard, login, register } from '@/routes';
import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Settings {
    kop_nama_desa?: string;
    kop_kecamatan?: string;
    kop_kabupaten?: string;
    kop_alamat?: string;
    kop_telepon?: string;
    kop_email?: string;
    kop_logo_path?: string;
    [key: string]: string | undefined;
}

interface Props {
    auth: { user: { name: string } | null };
    canRegister?: boolean;
    settings?: Settings;
}

export default function PortalLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { auth, canRegister, settings = {} } = usePage<Props>().props;
    const user = auth?.user ?? null;
    const { appearance, updateAppearance } = useAppearance();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Active menus tracking for mobile dropdowns
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const toggleDropdown = (menuName: string) => {
        if (activeDropdown === menuName) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(menuName);
        }
    };

    const logoUrl = settings.kop_logo_path ? `/storage/${settings.kop_logo_path}` : '/images/logo-cirangkong-icon.png';
    const desaName = settings.kop_nama_desa ? settings.kop_nama_desa : 'CIRANGKONG';
    const kecName = settings.kop_kecamatan ? settings.kop_kecamatan : 'CIJAMBE';
    const kabName = settings.kop_kabupaten ? settings.kop_kabupaten : 'SUBANG';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans antialiased flex flex-col">
            <Head title={title ? `${title} | Desa ${desaName}` : `Portal Resmi Desa ${desaName}`} />

            {/* Topbar Info */}
            <div className="bg-teal-900 text-teal-100 text-xs py-2 px-4 border-b border-teal-800 hidden sm:block">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {settings.kop_telepon || '-'}</span>
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {settings.kop_email || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-teal-200">Kec. {kecName}, Kab. {kabName}</span>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 sm:top-8 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-background/95 shadow-md backdrop-blur-sm sm:top-0 py-3' : 'bg-background/80 backdrop-blur-sm py-4'}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo & Identity */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
                        <img 
                            src={logoUrl} 
                            alt={`Logo Desa ${desaName}`} 
                            className="h-10 w-10 object-contain shrink-0" 
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo-cirangkong-icon.png'; }}
                        />
                        <div className="leading-tight">
                            <span className="text-base font-bold tracking-tight text-slate-800 dark:text-zinc-100">Desa {desaName}</span>
                            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">Kec. {kecName}</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {/* Beranda */}
                        <Link href="/" className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-teal-600 transition">
                            Beranda
                        </Link>

                        {/* Profil Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-teal-600 transition">
                                Profil Desa <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute left-0 mt-1 w-48 rounded-xl border bg-card p-2 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                                <Link href="/profil" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Tentang Desa</Link>
                                <Link href="/profil#sejarah" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Sejarah</Link>
                                <Link href="/profil#visi-misi" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Visi & Misi</Link>
                                <Link href="/profil#geografis" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Geografis & Demografi</Link>
                            </div>
                        </div>

                        {/* Pemerintahan Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-teal-600 transition">
                                Pemerintahan <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute left-0 mt-1 w-52 rounded-xl border bg-card p-2 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                                <Link href="/pemerintahan" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Pemerintah Desa</Link>
                                <Link href="/pemerintahan/bpd" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">BPD</Link>
                                <Link href="/pemerintahan/lembaga" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Lembaga Desa</Link>
                            </div>
                        </div>

                        {/* Informasi Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-teal-600 transition">
                                Informasi Publik <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute left-0 mt-1 w-48 rounded-xl border bg-card p-2 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                                <Link href="/informasi/berita" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Kabar Berita</Link>
                                <Link href="/informasi/pengumuman" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Pengumuman</Link>
                                <Link href="/informasi/agenda" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Agenda Kegiatan</Link>
                                <Link href="/informasi/galeri" className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition">Galeri Foto</Link>
                            </div>
                        </div>

                        {/* Layanan */}
                        <Link href="/layanan" className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-teal-600 transition">
                            Layanan Online
                        </Link>

                        {/* Kontak */}
                        <Link href="/kontak" className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-teal-600 transition">
                            Kontak & Buku Tamu
                        </Link>
                    </div>

                    {/* Actions (Login / Portal, Theme Toggle) */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateAppearance('light')}>
                                    <Sun className="mr-2 h-4 w-4" /> <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateAppearance('dark')}>
                                    <Moon className="mr-2 h-4 w-4" /> <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateAppearance('system')}>
                                    <Monitor className="mr-2 h-4 w-4" /> <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-6 w-px bg-border/60 mx-1"></div>

                        {user ? (
                            <Link href={dashboard()}
                                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-700 transition">
                                Dashboard Internal <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        ) : (
                            <Link href={login()}
                                className="rounded-xl border border-teal-600/30 hover:border-teal-600 px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/20 transition">
                                Masuk Layanan
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateAppearance('light')}>Light</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateAppearance('dark')}>Dark</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateAppearance('system')}>System</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button onClick={() => setMobileMenuOpen(v => !v)}
                            className="rounded-lg p-2 text-foreground hover:bg-muted transition">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {mobileMenuOpen && (
                    <div className="border-t bg-background px-4 py-6 shadow-xl lg:hidden max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-200">
                        <div className="flex flex-col gap-2">
                            {/* Beranda */}
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-teal-600 transition">
                                Beranda
                            </Link>

                            {/* Dropdown Profil */}
                            <div className="border-b pb-1 mb-1">
                                <button onClick={() => toggleDropdown('profil')}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-teal-600 transition">
                                    <span>Profil Desa</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'profil' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'profil' && (
                                    <div className="pl-6 py-1 flex flex-col gap-1.5 bg-muted/20 rounded-lg mt-1">
                                        <Link href="/profil" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Tentang Desa</Link>
                                        <Link href="/profil#sejarah" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Sejarah</Link>
                                        <Link href="/profil#visi-misi" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Visi & Misi</Link>
                                        <Link href="/profil#geografis" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Geografis & Demografi</Link>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown Pemerintahan */}
                            <div className="border-b pb-1 mb-1">
                                <button onClick={() => toggleDropdown('pemerintahan')}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-teal-600 transition">
                                    <span>Pemerintahan</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'pemerintahan' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'pemerintahan' && (
                                    <div className="pl-6 py-1 flex flex-col gap-1.5 bg-muted/20 rounded-lg mt-1">
                                        <Link href="/pemerintahan" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Pemerintah Desa</Link>
                                        <Link href="/pemerintahan/bpd" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">BPD</Link>
                                        <Link href="/pemerintahan/lembaga" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Lembaga Desa</Link>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown Informasi */}
                            <div className="border-b pb-1 mb-1">
                                <button onClick={() => toggleDropdown('informasi')}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-teal-600 transition">
                                    <span>Informasi Publik</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'informasi' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'informasi' && (
                                    <div className="pl-6 py-1 flex flex-col gap-1.5 bg-muted/20 rounded-lg mt-1">
                                        <Link href="/informasi/berita" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Kabar Berita</Link>
                                        <Link href="/informasi/pengumuman" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Pengumuman</Link>
                                        <Link href="/informasi/agenda" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Agenda Kegiatan</Link>
                                        <Link href="/informasi/galeri" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 text-xs font-semibold hover:text-teal-600">Galeri Foto</Link>
                                    </div>
                                )}
                            </div>

                            {/* Layanan */}
                            <Link href="/layanan" onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-teal-600 transition border-b pb-2 mb-1">
                                Layanan Online
                            </Link>

                            {/* Kontak */}
                            <Link href="/kontak" onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-teal-600 transition border-b pb-2 mb-2">
                                Kontak & Buku Tamu
                            </Link>

                            {user ? (
                                <Link href={dashboard()} onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-xl bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-teal-700 transition">
                                    Dashboard Internal
                                </Link>
                            ) : (
                                <Link href={login()} onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-xl border border-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-teal-600 hover:bg-teal-50 dark:text-teal-400 transition">
                                    Masuk Layanan
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 pt-24 sm:pt-32 pb-16">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 dark:bg-black dark:text-zinc-500 py-16 border-t border-slate-800 dark:border-zinc-900 mt-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Brand Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={logoUrl} 
                                    alt={`Logo Desa ${desaName}`} 
                                    className="h-12 w-12 object-contain shrink-0 filter brightness-110" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo-cirangkong-icon.png'; }}
                                />
                                <div className="leading-tight">
                                    <span className="text-lg font-bold text-white tracking-tight">Desa {desaName}</span>
                                    <p className="text-xs text-teal-400 font-semibold">Kec. {kecName}, Kab. {kabName}</p>
                                </div>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Portal informasi resmi Pemerintah Desa {desaName}. Menghadirkan transparansi publik, publikasi kegiatan, dan akses layanan digital terpadu untuk segenap warga.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200 dark:text-zinc-300">Peta Situs</p>
                            <ul className="space-y-2 text-xs">
                                <li><Link href="/" className="hover:text-teal-400 transition">Beranda</Link></li>
                                <li><Link href="/profil" className="hover:text-teal-400 transition">Profil Desa</Link></li>
                                <li><Link href="/pemerintahan" className="hover:text-teal-400 transition">Pemerintahan Desa</Link></li>
                                <li><Link href="/informasi/berita" className="hover:text-teal-400 transition">Kabar & Berita</Link></li>
                                <li><Link href="/layanan" className="hover:text-teal-400 transition">Layanan Warga</Link></li>
                            </ul>
                        </div>

                        {/* Kontak Desa */}
                        <div className="space-y-3">
                            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200 dark:text-zinc-300">Hubungi Kami</p>
                            <div className="flex items-start gap-2.5 text-xs text-slate-400">
                                <MapPin className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                                <p>{settings.kop_alamat || `Kantor Desa ${desaName}`}</p>
                            </div>
                            {settings.kop_telepon && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-400">
                                    <Phone className="h-4 w-4 text-teal-500 shrink-0" />
                                    <p>{settings.kop_telepon}</p>
                                </div>
                            )}
                            {settings.kop_email && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-400">
                                    <Mail className="h-4 w-4 text-teal-500 shrink-0" />
                                    <p>{settings.kop_email}</p>
                                </div>
                            )}
                        </div>

                        {/* Statistik / Operational */}
                        <div>
                            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200 dark:text-zinc-300">Jam Pelayanan</p>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                    <span>Senin - Kamis:</span>
                                    <span className="text-slate-300">08.00 - 15.00 WIB</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                    <span>Jumat:</span>
                                    <span className="text-slate-300">08.00 - 14.30 WIB</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Sabtu - Minggu:</span>
                                    <span className="text-red-400 font-semibold">Tutup</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="my-10 border-slate-800 dark:border-zinc-900" />

                    {/* Bottom Info */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>© {new Date().getFullYear()} Pemerintah Desa {desaName}. Hak Cipta Dilindungi.</p>
                        <p className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                            <span>SADESA Web Portal v1.0</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
