<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Legend extends Model
{
    protected $fillable = ['name', 'bio', 'photo', 'title', 'category', 'year', 'type'];
}
