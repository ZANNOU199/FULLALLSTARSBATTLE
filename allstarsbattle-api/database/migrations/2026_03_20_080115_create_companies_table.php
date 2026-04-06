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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('choreographer');
            $table->string('piece_title');
            $table->text('description')->nullable();
            $table->text('bio')->nullable();
            $table->string('main_image')->nullable();
            $table->json('gallery')->nullable();
            $table->date('performance_date')->nullable();
            $table->time('performance_time')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
