<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $teams = Team::with(['creator', 'members'])
            ->when($request->has('active'), function ($query) {
                return $query->active();
            })
            ->latest()
            ->get();

        return response()->json($teams);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:teams',
            'description' => 'nullable|string',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
        ]);

        $team = Team::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => $request->user()->id,
        ]);

        // Gabungkan member + creator, tanpa duplikat
        $allMemberIds = collect($request->member_ids ?? [])
            ->push($request->user()->id)
            ->unique()
            ->values();

        $team->members()->syncWithoutDetaching($allMemberIds);

        return response()->json($team->load(['creator', 'members']), 201);
    }


    public function show(Team $team)
    {
        return response()->json($team->load([
            'creator',
            'members',
            'projects.sprints',
        ]));
    }

    public function update(Request $request, Team $team)
    {
        $request->validate([
            'name' => 'string|max:255|unique:teams,name,' . $team->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $team->update($request->only(['name', 'description', 'is_active']));

        return response()->json($team->load(['creator', 'members']));
    }

    public function destroy(Team $team)
    {
        $team->delete();
        return response()->json(['message' => 'Team deleted successfully']);
    }

    public function addMember(Request $request, Team $team)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $team->members()->syncWithoutDetaching([$request->user_id]);

        return response()->json($team->load(['members']));
    }

    public function removeMember(Request $request, Team $team)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $team->members()->detach($request->user_id);

        return response()->json($team->load(['members']));
    }
}
