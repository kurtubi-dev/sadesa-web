<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('konten_desa', function (Blueprint $table) {
            $table->string('gambar_utama')->nullable();
            $table->string('lampiran_pdf')->nullable();
            $table->string('meta_description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('views_count')->default(0);
            $table->string('kategori')->default('Umum');
            $table->date('event_tanggal')->nullable();
            $table->string('event_lokasi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('konten_desa', function (Blueprint $table) {
            $table->dropColumn([
                'gambar_utama',
                'lampiran_pdf',
                'meta_description',
                'is_featured',
                'views_count',
                'kategori',
                'event_tanggal',
                'event_lokasi',
            ]);
        });
    }
};
