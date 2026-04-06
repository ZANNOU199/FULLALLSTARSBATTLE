<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'choreographer',
        'piece_title',
        'description',
        'bio',
        'main_image',
        'gallery',
        'performance_date',
        'performance_time',
    ];
}
