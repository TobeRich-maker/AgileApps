<?php

namespace App\Events;

use App\Models\Sprint;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SprintUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $sprint;
    public $action;

    public function __construct(Sprint $sprint, $action = 'updated')
    {
        $this->sprint = $sprint->load(['project', 'tasks']);
        $this->action = $action;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('project.' . $this->sprint->project_id);
    }

    public function broadcastAs()
    {
        return 'sprint.updated';
    }

    public function broadcastWith()
    {
        return [
            'sprint' => $this->sprint,
            'action' => $this->action,
            'timestamp' => now()->toISOString(),
        ];
    }
}
