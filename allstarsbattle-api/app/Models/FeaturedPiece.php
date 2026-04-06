<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeaturedPiece extends Model
{
    protected $fillable = [
        'title', 'image', 'duration', 'choreographer', 'music',
        'description', 'full_synopsis', 'intention_quote', 'intention_author',
        'performers', 'technology',
    ];
}
