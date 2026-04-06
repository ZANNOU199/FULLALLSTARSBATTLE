<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $fillable = [
        'name',
        'country',
        'country_code',
        'specialty',
        'bio',
        'photo',
        'social_links',
        'category',
    ];
}
