<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Legend;

class LegendSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Legend::create([
            'name' => 'B-Boy Lilou',
            'bio' => 'Légende du breaking et double champion du Red Bull BC One.',
            'photo' => 'https://picsum.photos/seed/lilou/400/400',
            'title' => 'B-Boy Champion 2015',
            'category' => 'bboy',
            'year' => 2015,
            'type' => 'champion-1v1',
        ]);

        Legend::create([
            'name' => 'B-Girl Shorty Mack',
            'bio' => 'Pionnière du breaking féminin.',
            'photo' => 'https://picsum.photos/seed/shortymack/400/400',
            'title' => 'B-Girl Champion 2016',
            'category' => 'bgirl',
            'year' => 2016,
            'type' => 'champion-1v1',
        ]);
    }
}
