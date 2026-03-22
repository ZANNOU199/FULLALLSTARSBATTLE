<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Article;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Article::create([
            'title' => 'Lancement de l\'édition 2026',
            'content' => 'Le plus grand événement de danse urbaine revient au Togo avec une édition d\'exception.',
            'category' => 'News',
            'cover_image' => 'https://picsum.photos/seed/news1/800/400',
            'date' => '2026-03-15',
            'tag' => 'breaking,hip-hop',
        ]);

        Article::create([
            'title' => 'Confirmé: B-Boy Lilou sera jurore',
            'content' => 'Le légendaire B-Boy Lilou rejoint le jury de la compétition 2026.',
            'category' => 'News',
            'cover_image' => 'https://picsum.photos/seed/news2/800/400',
            'date' => '2026-03-18',
            'tag' => 'breaking,judges',
        ]);
    }
}
