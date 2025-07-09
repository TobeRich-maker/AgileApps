<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        $owner = $users->where('role', 'product_owner')->first();
        
        $projects = [
            [
                'name' => 'E-commerce Platform',
                'description' => 'Building a modern e-commerce platform with React and Laravel',
                'status' => 'active',
                'start_date' => '2024-01-15',
                'owner_id' => $owner->id,
            ],
            [
                'name' => 'Mobile App',
                'description' => 'Cross-platform mobile application using React Native',
                'status' => 'active',
                'start_date' => '2024-02-01',
                'owner_id' => $owner->id,
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create($projectData);
            
            // Add all users as members
            $project->members()->attach($users->pluck('id'));
        }
    }
}
