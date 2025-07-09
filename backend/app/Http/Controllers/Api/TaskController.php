<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['project', 'sprint', 'assignee', 'creator'])
            ->whereHas('project.members', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });

        // Filters
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('sprint_id')) {
            $query->where('sprint_id', $request->sprint_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('assignee_id')) {
            $query->where('assignee_id', $request->assignee_id);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        $tasks = $query->latest()->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'in:todo,in_progress,done',
            'priority' => 'in:low,medium,high',
            'story_points' => 'integer|min:1|max:100',
            'project_id' => 'required|exists:projects,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assignee_id' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'tags' => 'nullable|array',
        ]);

        $task = Task::create([
            ...$request->all(),
            'creator_id' => $request->user()->id,
        ]);

        return response()->json($task->load([
            'project', 'sprint', 'assignee', 'creator'
        ]), 201);
    }

    public function show(Task $task)
    {
        return response()->json($task->load([
            'project',
            'sprint',
            'assignee',
            'creator',
            'comments.user'
        ]));
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'status' => 'in:todo,in_progress,done',
            'priority' => 'in:low,medium,high',
            'story_points' => 'integer|min:1|max:100',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assignee_id' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'tags' => 'nullable|array',
        ]);

        $task->update($request->all());

        return response()->json($task->load([
            'project', 'sprint', 'assignee', 'creator'
        ]));
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function updateStatus(Request $request, Task $task)
    {
        $request->validate([
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $task->update(['status' => $request->status]);

        return response()->json($task->load([
            'project', 'sprint', 'assignee', 'creator'
        ]));
    }
}
