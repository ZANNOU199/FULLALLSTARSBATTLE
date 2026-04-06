<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Participant;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Participant::create([
            'name' => 'B-Boy Lilou',
            'country' => 'France',
            'country_code' => 'fr',
            'specialty' => 'Breaking',
            'bio' => 'Double champion du Red Bull BC One.',
            'photo' => 'https://picsum.photos/seed/lilou/400/400',
            'social_links' => json_encode(['instagram' => '@lilou_officiel']),
            'category' => 'judge',
        ]);

        Participant::create([
            'name' => 'B-Girl Shorty Mack',
            'country' => 'USA',
            'country_code' => 'us',
            'specialty' => 'Breaking',
            'bio' => 'Champion du Red Bull BC One 2015 feminin.',
            'photo' => 'https://picsum.photos/seed/shortymack/400/400',
            'social_links' => json_encode(['instagram' => '@shortymack']),
            'category' => 'judge',
        ]);

        Participant::create([
            'name' => 'DJ Amir',
            'country' => 'Togo',
            'country_code' => 'tg',
            'specialty' => 'DJ',
            'bio' => 'DJ officiel de l\'événement.',
            'photo' => 'https://picsum.photos/seed/djamir/400/400',
            'social_links' => json_encode(['instagram' => '@dj_amir']),
            'category' => 'dj',
        ]);
    }
}
