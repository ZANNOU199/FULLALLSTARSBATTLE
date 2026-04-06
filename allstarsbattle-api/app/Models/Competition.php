<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Competition extends Model
{
    protected $fillable = ['name', 'rules', 'prize_pool', 'brackets'];
    protected $casts = [
        'prize_pool' => 'array',
        'brackets' => 'array',
    ];
}
