<?php

namespace Database\Seeders;

use App\Models\Standup;
use App\Models\Sprint;
use App\Models\User;
use Illuminate\Database\Seeder;

class StandupSeeder extends Seeder
{
    public function run()
    {
        $activeSprints = Sprint::where('status', 'active')->get();
        $users = User::all();

        $standupTemplates = [
            [
                'yesterday_work' => 'Completed user authentication API endpoints and wrote unit tests',
                'today_plan' => 'Working on frontend login component and form validation',
                'blockers' => null,
            ],
            [
                'yesterday_work' => 'Fixed bugs in the Kanban board drag and drop functionality',
                'today_plan' => 'Implementing real-time updates for task status changes',
                'blockers' => 'Waiting for WebSocket server configuration from DevOps team',
            ],
            [
                'yesterday_work' => 'Designed mockups for the sprint planning interface',
                'today_plan' => 'Creating interactive prototypes and gathering feedback',
                'blockers' => null,
            ],
            [
                'yesterday_work' => 'Reviewed pull requests and conducted code reviews',
                'today_plan' => 'Refactoring database queries for better performance',
                'blockers' => 'Need clarification on new database schema requirements',
            ],
        ];

        foreach ($activeSprints as $sprint) {
            // Get team members for this sprint's project
            $teamMembers = $sprint->project->members;
            
            // Create standups for the last 5 days
            for ($i = 4; $i >= 0; $i--) {
                $date = now()->subDays($i)->toDateString();
                
                foreach ($teamMembers as $user) {
                    $template = $standupTemplates[array_rand($standupTemplates)];
                    
                    Standup::create([
                        'user_id' => $user->id,
                        'sprint_id' => $sprint->id,
                        'date' => $date,
                        'yesterday_work' => $template['yesterday_work'],
                        'today_plan' => $template['today_plan'],
                        'blockers' => $template['blockers'],
                    ]);
                }
            }
        }
    }
}
