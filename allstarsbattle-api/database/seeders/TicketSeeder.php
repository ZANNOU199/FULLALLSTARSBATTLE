<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ticket;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ticket::create([
            'name' => 'Pass Standard',
            'price' => '5000 FCFA',
            'benefits' => json_encode(['Accès 2 jours', 'Placement libre']),
            'payment_link' => '#',
        ]);

        Ticket::create([
            'name' => 'Pass VIP',
            'price' => '15000 FCFA',
            'benefits' => json_encode(['Accès 2 jours', 'Front row', 'Meet & Greet', 'T-Shirt']),
            'payment_link' => '#',
        ]);

        Ticket::create([
            'name' => 'Pass One Day',
            'price' => '3000 FCFA',
            'benefits' => json_encode(['Accès 1 jour', 'Entrée générale']),
            'payment_link' => '#',
        ]);
    }
}
