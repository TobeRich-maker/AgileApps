<?php

namespace Database\Seeders;

use App\Models\Story;
use App\Models\Epic;
use App\Models\User;
use Illuminate\Database\Seeder;

class StorySeeder extends Seeder
{
    public function run()
    {
        $epics = Epic::all();
        $users = User::all();

        $storyTemplates = [
            [
                'title' => 'User Registration',
                'description' => 'As a new user, I want to register an account so that I can access the platform',
                'acceptance_criteria' => [
                    'User can enter name, email, and password',
                    'Email validation is performed',
                    'Password strength requirements are enforced',
                    'Confirmation email is sent',
                ],
                'story_points' => 5,
                'priority' => 'high',
                'status' => 'done',
            ],
            [
                'title' => 'User Login',
                'description' => 'As a registered user, I want to login to my account so that I can use the platform',
                'acceptance_criteria' => [
                    'User can enter email and password',
                    'Authentication is validated',
                    'User is redirected to dashboard',
                    'Session is maintained',
                ],
                'story_points' => 3,
                'priority' => 'high',
                'status' => 'done',
            ],
            [
                'title' => 'Create Project',
                'description' => 'As a product owner, I want to create a new project so that I can organize work',
                'acceptance_criteria' => [
                    'User can enter project name and description',
                    'Project status can be set',
                    'Team members can be assigned',
                    'Project is saved to database',
                ],
                'story_points' => 8,
                'priority' => 'high',
                'status' => 'in_progress',
            ],
            [
                'title' => 'Task Management',
                'description' => 'As a team member, I want to create and manage tasks so that I can track my work',
                'acceptance_criteria' => [
                    'User can create new tasks',
                    'Tasks can be assigned to team members',
                    'Task status can be updated',
                    'Tasks are displayed on Kanban board',
                ],
                'story_points' => 13,
                'priority' => 'high',
                'status' => 'ready',
            ],
        ];

        foreach ($epics as $epic) {
            foreach ($storyTemplates as $template) {
                Story::create([
                    ...$template,
                    'epic_id' => $epic->id,
                    'project_id' => $epic->project_id,
                    'creator_id' => $users->random()->id,
                    'assignee_id' => $users->random()->id,
                ]);
            }
        }
    }
}
