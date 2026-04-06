<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageBackground extends Model
{
    protected $fillable = ['page_name', 'image_url', 'video_url', 'width', 'height', 'last_modified'];
}
