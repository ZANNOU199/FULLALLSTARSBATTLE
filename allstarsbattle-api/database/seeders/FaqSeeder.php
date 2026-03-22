<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FAQ;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FAQ::create([
            'question' => 'Où se déroule l\'événement ?',
            'answer' => 'Au Palais des Congrès de Lomé, Togo.',
            'category' => 'Venue',
        ]);

        FAQ::create([
            'question' => 'Quand l\'événement aura-t-il lieu ?',
            'answer' => '14-16 Août 2026',
            'category' => 'Date',
        ]);

        FAQ::create([
            'question' => 'Comment acheter des tickets ?',
            'answer' => 'Vous pouvez acheter des tickets en ligne via notre plateforme de paiement sécurisée.',
            'category' => 'Tickets',
        ]);
    }
}
