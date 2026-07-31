<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pejabat extends Model
{
    use HasFactory;

    protected $table = 'pejabat';

    protected $fillable = [
        'kategori',
        'nama',
        'jabatan',
        'foto',
        'kontak',
        'urutan',
    ];

    /**
     * Scope untuk kategori perangkat desa
     */
    public function scopePerangkatDesa($query)
    {
        return $query->where('kategori', 'perangkat_desa');
    }

    /**
     * Scope untuk kategori BPD
     */
    public function scopeBpd($query)
    {
        return $query->where('kategori', 'bpd');
    }

    /**
     * Scope untuk kategori lembaga desa
     */
    public function scopeLembagaDesa($query)
    {
        return $query->where('kategori', 'lembaga_desa');
    }
}
