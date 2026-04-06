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
        Schema::create('featured_pieces', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('image')->nullable();
            $table->string('duration')->nullable();
            $table->string('choreographer')->nullable();
            $table->string('music')->nullable();
            $table->text('description')->nullable();
            $table->text('full_synopsis')->nullable();
            $table->text('intention_quote')->nullable();
            $table->string('intention_author')->nullable();
            $table->text('performers')->nullable();
            $table->text('technology')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_pieces');
    }
};
