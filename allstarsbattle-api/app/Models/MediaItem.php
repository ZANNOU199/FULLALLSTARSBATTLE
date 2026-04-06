<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaItem extends Model
{
    protected $fillable = ['title', 'url', 'type', 'duration', 'thumbnail', 'tags', 'year', 'description', 'tag'];
}
