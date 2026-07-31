<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Inertia\Inertia;
use Inertia\Response;

class PortalProfilController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('portal/profil', [
            'settings' => AppSetting::allAsArray(),
        ]);
    }
}
