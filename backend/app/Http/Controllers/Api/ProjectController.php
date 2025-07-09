<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::with(['owner', 'members'])
            ->forUser($request->user()->id)
            ->latest()
            ->get();

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'in:active,completed,on_hold',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'active',
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'owner_id' => $request->user()->id,
        ]);

        // Add creator as project member
        $project->members()->attach($request->user()->id);

        return response()->json($project->load(['owner', 'members']), 201);
    }

    public function show(Project $project)
    {
        return response()->json($project->load([
            'owner',
            'members',
            'sprints',
            'tasks.assignee'
        ]));
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'status' => 'in:active,completed,on_hold',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $project->update($request->only([
            'name', 'description', 'status', 'start_date', 'end_date'
        ]));

        return response()->json($project->load(['owner', 'members']));
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully']);
    }
}
