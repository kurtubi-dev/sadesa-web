<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: #f9fafb;
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>SADESA — Sahabat Digital Desa</title>

    <!-- Tab Icon (Favicon) -->
    <link rel="icon" href="/images/logo-cirangkong-icon.png" type="image/png">
    <link rel="apple-touch-icon" href="/images/logo-cirangkong-icon.png">

    <!-- Open Graph / Facebook Metadata -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="SADESA — Sahabat Digital Desa">
    <meta property="og:description" content="Portal Resmi dan Pelayanan Publik Digital Terpadu Desa Cirangkong, Kecamatan Cijambe, Kabupaten Subang.">
    <meta property="og:image" content="/images/logo-cirangkong-horizontal.png">

    <!-- Twitter Metadata -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="SADESA — Sahabat Digital Desa">
    <meta property="twitter:description" content="Portal Resmi dan Pelayanan Publik Digital Terpadu Desa Cirangkong, Kecamatan Cijambe, Kabupaten Subang.">
    <meta property="twitter:image" content="/images/logo-cirangkong-horizontal.png">

    {{-- Outfit — TailAdmin default, sesuai SADESA design system --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>