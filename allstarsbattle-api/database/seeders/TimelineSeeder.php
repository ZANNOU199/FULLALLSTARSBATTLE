<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TimelineEvent;

class TimelineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TimelineEvent::create([
            'year' => 2024,
            'title' => 'ÉDITION 2024 - FINALE MÉMORABLE',
            'champion' => 'B-Boy Dany Dann',
            'description' => 'Une finale mémorable avec des performances exceptionnelles des meilleurs danseurs du continent.',
            'image' => 'https://picsum.photos/seed/hist1/800/450',
        ]);

        TimelineEvent::create([
            'year' => 2023,
            'title' => 'ÉDITION 2023 - EXPANSION CONTINENTALE',
            'champion' => 'B-Boy Lilou',
            'description' => 'Premier événement panafricain rassemblant plus de 40 pays.',
            'image' => 'https://picsum.photos/seed/hist2/800/450',
        ]);
    }
}
