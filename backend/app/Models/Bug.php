<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bug extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'steps_to_reproduce',
        'expected_behavior',
        'actual_behavior',
        'severity',
        'priority',
        'status',
        'project_id',
        'reporter_id',
        'assignee_id',
        'sprint_id',
        'environment',
        'browser',
        'os',
        'attachments',
        'resolved_at',
    ];

    protected $casts = [
        'steps_to_reproduce' => 'array',
        'attachments' => 'array',
        'resolved_at' => 'datetime',
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['open', 'in_progress', 'testing']);
    }

    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }
}
