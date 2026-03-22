<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'program_day_id', 'time', 'title', 'location', 'description', 'category',
    ];

    public function day()
    {
        return $this->belongsTo(ProgramDay::class, 'program_day_id');
    }
}
