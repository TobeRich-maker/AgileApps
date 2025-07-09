<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Standup extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'sprint_id',
        'date',
        'yesterday_work',
        'today_plan',
        'blockers',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    // Scopes
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeForSprint($query, $sprintId)
    {
        return $query->where('sprint_id', $sprintId);
    }
}
