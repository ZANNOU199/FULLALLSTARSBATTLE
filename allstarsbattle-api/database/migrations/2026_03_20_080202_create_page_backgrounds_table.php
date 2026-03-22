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
        Schema::create('page_backgrounds', function (Blueprint $table) {
            $table->id();
            $table->string('page_name'); // hero, artisticScene, dancers, media, contact
            $table->string('image_url')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('width')->default(1920);
            $table->integer('height')->default(1080);
            $table->timestamp('last_modified')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_backgrounds');
    }
};
