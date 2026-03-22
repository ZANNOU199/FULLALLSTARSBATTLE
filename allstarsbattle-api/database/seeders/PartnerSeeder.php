<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Partner;

class PartnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Partner::create([
            'name' => 'Institut Français',
            'logo' => 'https://picsum.photos/seed/if/200/100',
            'category' => 'Institutional',
            'website' => '#',
        ]);

        Partner::create([
            'name' => 'Red Bull',
            'logo' => 'https://picsum.photos/seed/redbull/200/100',
            'category' => 'Sponsor',
            'website' => '#',
        ]);

        Partner::create([
            'name' => 'Ministère de la Culture',
            'logo' => 'https://picsum.photos/seed/culture/200/100',
            'category' => 'Institutional',
            'website' => '#',
        ]);
    }
}
