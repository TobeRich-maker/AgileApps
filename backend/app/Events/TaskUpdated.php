<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;
    public $action;

    public function __construct(Task $task, $action = 'updated')
    {
        $this->task = $task->load(['assignee', 'creator', 'project', 'sprint']);
        $this->action = $action;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('project.' . $this->task->project_id);
    }

    public function broadcastAs()
    {
        return 'task.updated';
    }

    public function broadcastWith()
    {
        return [
            'task' => $this->task,
            'action' => $this->action,
            'timestamp' => now()->toISOString(),
        ];
    }
}
