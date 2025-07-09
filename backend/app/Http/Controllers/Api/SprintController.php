<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sprint;
use App\Events\SprintUpdated;
use Illuminate\Http\Request;

class SprintController extends Controller
{
    public function index(Request $request)
    {
        $query = Sprint::with(['project', 'tasks.assignee'])
            ->whereHas('project.members', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $sprints = $query->latest()->get();

        return response()->json($sprints);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'goal' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'project_id' => 'required|exists:projects,id',
            'story_points_planned' => 'integer|min:0',
        ]);

        $sprint = Sprint::create($request->all());

        event(new SprintUpdated($sprint, 'created'));

        return response()->json($sprint->load(['project', 'tasks']), 201);
    }

    public function show(Sprint $sprint)
    {
        return response()->json($sprint->load([
            'project',
            'tasks.assignee',
            'tasks.creator',
            'standups.user',
        ]));
    }

    public function update(Request $request, Sprint $sprint)
    {
        $request->validate([
            'name' => 'string|max:255',
            'goal' => 'string',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'status' => 'in:planned,active,completed',
            'story_points_planned' => 'integer|min:0',
            'story_points_completed' => 'integer|min:0',
        ]);

        $sprint->update($request->all());

        event(new SprintUpdated($sprint, 'updated'));

        return response()->json($sprint->load(['project', 'tasks']));
    }

    public function destroy(Sprint $sprint)
    {
        $sprint->delete();

        event(new SprintUpdated($sprint, 'deleted'));

        return response()->json(['message' => 'Sprint deleted successfully']);
    }

    public function start(Sprint $sprint)
    {
        $sprint->update(['status' => 'active']);

        event(new SprintUpdated($sprint, 'started'));

        return response()->json($sprint->load(['project', 'tasks']));
    }

    public function complete(Sprint $sprint)
    {
        $completedPoints = $sprint->tasks()
            ->where('status', 'done')
            ->sum('story_points');

        $sprint->update([
            'status' => 'completed',
            'story_points_completed' => $completedPoints,
        ]);

        event(new SprintUpdated($sprint, 'completed'));

        return response()->json($sprint->load(['project', 'tasks']));
    }

    public function burndown(Sprint $sprint)
    {
        $tasks = $sprint->tasks()->with('creator')->get();
        $totalPoints = $tasks->sum('story_points');
        
        $burndownData = [];
        $currentDate = $sprint->start_date->copy();
        $endDate = $sprint->end_date;

        while ($currentDate <= $endDate) {
            $completedPoints = $tasks->filter(function ($task) use ($currentDate) {
                return $task->status === 'done' && 
                       $task->updated_at->toDateString() <= $currentDate->toDateString();
            })->sum('story_points');

            $remainingPoints = $totalPoints - $completedPoints;
            
            $burndownData[] = [
                'date' => $currentDate->toDateString(),
                'remaining' => $remainingPoints,
                'ideal' => $this->calculateIdealBurndown($totalPoints, $sprint->start_date, $sprint->end_date, $currentDate),
            ];

            $currentDate->addDay();
        }

        return response()->json($burndownData);
    }

    private function calculateIdealBurndown($totalPoints, $startDate, $endDate, $currentDate)
    {
        $totalDays = $startDate->diffInDays($endDate);
        $daysPassed = $startDate->diffInDays($currentDate);
        
        if ($totalDays === 0) return 0;
        
        return max(0, $totalPoints - ($totalPoints * ($daysPassed / $totalDays)));
    }
}
