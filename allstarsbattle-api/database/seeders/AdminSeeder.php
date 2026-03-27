<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin user
        User::updateOrCreate(
            ['email' => 'admin@allstarsbattle.com'],
            [
                'name' => 'Administrateur',
                'password' => bcrypt('admin'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
        
        $this->command->info('Admin user created: admin@allstarsbattle.com / admin');
    }
}
