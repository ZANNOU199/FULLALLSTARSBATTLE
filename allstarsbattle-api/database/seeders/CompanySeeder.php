<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Company::create([
            'name' => 'Pockemon Crew',
            'choreographer' => 'Riyad Fghani',
            'piece_title' => 'Silence on tourne',
            'description' => 'Une pièce qui rend hommage au cinéma.',
            'bio' => 'Compagnie légendaire de Lyon.',
            'main_image' => 'https://picsum.photos/seed/pockemon/800/600',
            'gallery' => json_encode([]),
            'performance_date' => '2026-08-15',
            'performance_time' => '20:00',
        ]);

        Company::create([
            'name' => 'Urban Dance Project',
            'choreographer' => 'Alex Dupont',
            'piece_title' => 'Métropolis',
            'description' => 'Expression de la vie urbaine contemporaine.',
            'bio' => 'Groupe basé à Paris spécialisé en danse urbaine.',
            'main_image' => 'https://picsum.photos/seed/urban/800/600',
            'gallery' => json_encode([]),
            'performance_date' => '2026-08-16',
            'performance_time' => '18:30',
        ]);
    }
}
