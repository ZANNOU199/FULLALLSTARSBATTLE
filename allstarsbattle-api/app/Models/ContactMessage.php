<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'status',
        'read_at',
        'source'
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    // Scope pour les messages non lus
    public function scopeUnread($query)
    {
        return $query->where('status', 'unread');
    }

    // Scope pour les messages lus
    public function scopeRead($query)
    {
        return $query->where('status', 'read');
    }

    // Marquer comme lu
    public function markAsRead()
    {
        $this->update([
            'status' => 'read',
            'read_at' => now()
        ]);
    }

    // Marquer comme répondu
    public function markAsReplied()
    {
        $this->update(['status' => 'replied']);
    }
}
