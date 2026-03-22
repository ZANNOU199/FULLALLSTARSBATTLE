<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organizer extends Model
{
    protected $fillable = [
        'name',
        'role',
        'bio',
        'photo',
        'social_links',
    ];
}
