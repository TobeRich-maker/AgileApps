<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run()
    {
        $projects = Project::all();
        $users = User::all();
        $creator = $users->where('role', 'product_owner')->first();
        
        $taskTemplates = [
            [
                'title' => 'Design login page',
                'description' => 'Create wireframes and mockups for the login page',
                'status' => 'done',
                'priority' => 'high',
                'story_points' => 3,
                'tags' => ['design', 'ui'],
            ],
            [
                'title' => 'Implement user authentication',
                'description' => 'Set up JWT authentication with login/logout functionality',
                'status' => 'in_progress',
                'priority' => 'high',
                'story_points' => 8,
                'tags' => ['backend', 'auth'],
            ],
            [
                'title' => 'Create user dashboard',
                'description' => 'Build the main dashboard interface for logged-in users',
                'status' => 'todo',
                'priority' => 'medium',
                'story_points' => 5,
                'tags' => ['frontend', 'dashboard'],
            ],
        ];

        foreach ($projects as $project) {
            foreach ($taskTemplates as $taskData) {
                Task::create([
                    ...$taskData,
                    'project_id' => $project->id,
                    'assignee_id' => $users->random()->id,
                    'creator_id' => $creator->id,
                ]);
            }
        }
    }
}
