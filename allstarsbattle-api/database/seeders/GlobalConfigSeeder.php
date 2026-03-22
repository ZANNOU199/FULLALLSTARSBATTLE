<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GlobalConfig;

class GlobalConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GlobalConfig::create([
            'key' => 'contact_email',
            'value' => 'contact@asbi.com',
        ]);

        GlobalConfig::create([
            'key' => 'contact_phone',
            'value' => '+228 90 00 00 00',
        ]);

        GlobalConfig::create([
            'key' => 'contact_address',
            'value' => 'Lomé, Togo',
        ]);

        GlobalConfig::create([
            'key' => 'instagram',
            'value' => 'https://instagram.com/asbi_togo',
        ]);

        GlobalConfig::create([
            'key' => 'facebook',
            'value' => 'https://facebook.com/asbi_togo',
        ]);
    }
}
