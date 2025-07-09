<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Standup;
use Illuminate\Http\Request;

class StandupController extends Controller
{
    public function index(Request $request)
    {
        $query = Standup::with(['user', 'sprint.project'])
            ->whereHas('sprint.project.members', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });

        if ($request->has('sprint_id')) {
            $query->where('sprint_id', $request->sprint_id);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $standups = $query->latest('date')->get();

        return response()->json($standups);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sprint_id' => 'required|exists:sprints,id',
            'date' => 'required|date',
            'yesterday_work' => 'nullable|string',
            'today_plan' => 'nullable|string',
            'blockers' => 'nullable|string',
        ]);

        $standup = Standup::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'sprint_id' => $request->sprint_id,
                'date' => $request->date,
            ],
            $request->only(['yesterday_work', 'today_plan', 'blockers'])
        );

        return response()->json($standup->load(['user', 'sprint']), 201);
    }

    public function show(Standup $standup)
    {
        return response()->json($standup->load(['user', 'sprint.project']));
    }

    public function update(Request $request, Standup $standup)
    {
        $request->validate([
            'yesterday_work' => 'nullable|string',
            'today_plan' => 'nullable|string',
            'blockers' => 'nullable|string',
        ]);

        $standup->update($request->only(['yesterday_work', 'today_plan', 'blockers']));

        return response()->json($standup->load(['user', 'sprint']));
    }

    public function destroy(Standup $standup)
    {
        $standup->delete();
        return response()->json(['message' => 'Standup deleted successfully']);
    }

    public function getTeamStandup(Request $request)
    {
        $request->validate([
            'sprint_id' => 'required|exists:sprints,id',
            'date' => 'required|date',
        ]);

        $standups = Standup::with(['user'])
            ->where('sprint_id', $request->sprint_id)
            ->whereDate('date', $request->date)
            ->get();

        return response()->json($standups);
    }
}
