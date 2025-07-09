<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use Illuminate\Http\Request;

class BugController extends Controller
{
    public function index(Request $request)
    {
        $query = Bug::with(['project', 'reporter', 'assignee', 'sprint'])
            ->whereHas('project.members', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });

        // Filters
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }

        if ($request->has('assignee_id')) {
            $query->where('assignee_id', $request->assignee_id);
        }

        $bugs = $query->latest()->get();

        return response()->json($bugs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'steps_to_reproduce' => 'nullable|array',
            'expected_behavior' => 'nullable|string',
            'actual_behavior' => 'nullable|string',
            'severity' => 'required|in:low,medium,high,critical',
            'priority' => 'required|in:low,medium,high',
            'project_id' => 'required|exists:projects,id',
            'assignee_id' => 'nullable|exists:users,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'environment' => 'nullable|string',
            'browser' => 'nullable|string',
            'os' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        $bug = Bug::create([
            ...$request->all(),
            'reporter_id' => $request->user()->id,
            'status' => 'open',
        ]);

        return response()->json($bug->load([
            'project', 'reporter', 'assignee', 'sprint'
        ]), 201);
    }

    public function show(Bug $bug)
    {
        return response()->json($bug->load([
            'project',
            'reporter',
            'assignee',
            'sprint',
            'comments.user'
        ]));
    }

    public function update(Request $request, Bug $bug)
    {
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'steps_to_reproduce' => 'nullable|array',
            'expected_behavior' => 'nullable|string',
            'actual_behavior' => 'nullable|string',
            'severity' => 'in:low,medium,high,critical',
            'priority' => 'in:low,medium,high',
            'status' => 'in:open,in_progress,testing,resolved,closed',
            'assignee_id' => 'nullable|exists:users,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'environment' => 'nullable|string',
            'browser' => 'nullable|string',
            'os' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        if ($request->status === 'resolved' && !$bug->resolved_at) {
            $request->merge(['resolved_at' => now()]);
        }

        $bug->update($request->all());

        return response()->json($bug->load([
            'project', 'reporter', 'assignee', 'sprint'
        ]));
    }

    public function destroy(Bug $bug)
    {
        $bug->delete();
        return response()->json(['message' => 'Bug deleted successfully']);
    }
}
