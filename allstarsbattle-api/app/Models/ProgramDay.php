<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramDay extends Model
{
    protected $fillable = ['date', 'label'];

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}
