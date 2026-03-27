<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Organizer;

class OrganizerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Organizer::create([
            'name' => 'Kofi Mensah',
            'role' => 'Directeur Général',
            'bio' => 'Fondateur d\'ASB avec 15 ans d\'expérience.',
            'photo' => 'https://picsum.photos/seed/kofi/400/400',
            'social_links' => json_encode([
                'instagram' => '@kofi_asbi',
                'facebook' => '/ASB.togo',
            ]),
        ]);

        Organizer::create([
            'name' => 'Ama Boateng',
            'role' => 'Coordinatrice Événements',
            'bio' => 'Responsable de la coordination générale.',
            'photo' => 'https://picsum.photos/seed/ama/400/400',
            'social_links' => json_encode([
                'instagram' => '@ama_events',
                'linkedin' => '/ama-boateng',
            ]),
        ]);
    }
}
