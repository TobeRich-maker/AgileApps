<?php

namespace Database\Seeders;

use App\Models\Epic;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class EpicSeeder extends Seeder
{
    public function run()
    {
        $projects = Project::all();
        $productOwners = User::where('role', 'product_owner')->get();

        $epicTemplates = [
            [
                'title' => 'User Authentication System',
                'description' => 'Complete user authentication and authorization system with role-based access control',
                'status' => 'completed',
                'priority' => 'high',
                'color' => '#10b981',
            ],
            [
                'title' => 'Project Management Dashboard',
                'description' => 'Comprehensive dashboard for project overview, metrics, and quick actions',
                'status' => 'in_progress',
                'priority' => 'high',
                'color' => '#3b82f6',
            ],
            [
                'title' => 'Real-time Collaboration',
                'description' => 'Real-time updates, notifications, and collaborative features',
                'status' => 'planned',
                'priority' => 'medium',
                'color' => '#f59e0b',
            ],
            [
                'title' => 'Advanced Reporting',
                'description' => 'Detailed analytics, charts, and reporting capabilities',
                'status' => 'planned',
                'priority' => 'medium',
                'color' => '#8b5cf6',
            ],
        ];

        foreach ($projects as $project) {
            foreach ($epicTemplates as $template) {
                Epic::create([
                    ...$template,
                    'project_id' => $project->id,
                    'owner_id' => $productOwners->random()->id,
                    'start_date' => now()->subDays(rand(1, 30)),
                    'end_date' => now()->addDays(rand(30, 90)),
                ]);
            }
        }
    }
}
