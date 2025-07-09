<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run()
    {
        $admin = User::where('role', 'admin')->first();
        $scrumMaster = User::where('role', 'scrum_master')->first();
        
        $teams = [
            [
                'name' => 'Frontend Team',
                'description' => 'Responsible for user interface and user experience',
                'created_by' => $admin->id,
            ],
            [
                'name' => 'Backend Team',
                'description' => 'Handles server-side logic and database management',
                'created_by' => $admin->id,
            ],
            [
                'name' => 'Full Stack Team',
                'description' => 'Cross-functional team handling both frontend and backend',
                'created_by' => $scrumMaster->id,
            ],
        ];

        foreach ($teams as $teamData) {
            $team = Team::create($teamData);
            
            // Add random members to each team
            $users = User::inRandomOrder()->limit(rand(3, 6))->get();
            $team->members()->attach($users->pluck('id'));
        }
    }
}
