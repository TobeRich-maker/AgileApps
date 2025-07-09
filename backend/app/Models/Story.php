<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Story extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'acceptance_criteria',
        'story_points',
        'priority',
        'status',
        'epic_id',
        'project_id',
        'creator_id',
        'assignee_id',
    ];

    protected $casts = [
        'story_points' => 'integer',
        'acceptance_criteria' => 'array',
    ];

    // Relationships
    public function epic()
    {
        return $this->belongsTo(Epic::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Accessors
    public function getProgressAttribute()
    {
        $totalTasks = $this->tasks()->count();
        if ($totalTasks === 0) return 0;
        
        $completedTasks = $this->tasks()->where('status', 'done')->count();
        return round(($completedTasks / $totalTasks) * 100, 2);
    }
}
