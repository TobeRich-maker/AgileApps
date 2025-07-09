<?php

namespace Database\Seeders;

use App\Models\Bug;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\User;
use Illuminate\Database\Seeder;

class BugSeeder extends Seeder
{
    public function run()
    {
        $projects = Project::all();
        $sprints = Sprint::all();
        $users = User::all();

        $bugTemplates = [
            [
                'title' => 'Login form validation not working',
                'description' => 'The login form accepts empty email and password fields',
                'steps_to_reproduce' => [
                    'Navigate to login page',
                    'Leave email and password fields empty',
                    'Click login button',
                    'Form submits without validation',
                ],
                'expected_behavior' => 'Form should show validation errors for empty fields',
                'actual_behavior' => 'Form submits and shows server error',
                'severity' => 'medium',
                'priority' => 'high',
                'status' => 'open',
                'environment' => 'Production',
                'browser' => 'Chrome 120.0',
                'os' => 'Windows 11',
            ],
            [
                'title' => 'Kanban board drag and drop not working on mobile',
                'description' => 'Tasks cannot be dragged between columns on mobile devices',
                'steps_to_reproduce' => [
                    'Open Kanban board on mobile device',
                    'Try to drag a task to different column',
                    'Task does not move',
                ],
                'expected_behavior' => 'Tasks should be draggable on mobile devices',
                'actual_behavior' => 'Drag and drop functionality is not working',
                'severity' => 'high',
                'priority' => 'medium',
                'status' => 'in_progress',
                'environment' => 'Production',
                'browser' => 'Safari Mobile',
                'os' => 'iOS 17',
            ],
            [
                'title' => 'Sprint burndown chart showing incorrect data',
                'description' => 'The burndown chart is not reflecting actual task completion',
                'steps_to_reproduce' => [
                    'Complete several tasks in active sprint',
                    'Navigate to sprint reports',
                    'Check burndown chart',
                    'Chart shows old data',
                ],
                'expected_behavior' => 'Chart should update in real-time with task completion',
                'actual_behavior' => 'Chart shows stale data from previous day',
                'severity' => 'medium',
                'priority' => 'medium',
                'status' => 'testing',
                'environment' => 'Staging',
                'browser' => 'Firefox 121.0',
                'os' => 'Ubuntu 22.04',
            ],
        ];

        foreach ($projects as $project) {
            foreach ($bugTemplates as $template) {
                Bug::create([
                    ...$template,
                    'project_id' => $project->id,
                    'reporter_id' => $users->random()->id,
                    'assignee_id' => $users->random()->id,
                    'sprint_id' => $sprints->where('project_id', $project->id)->random()->id ?? null,
                ]);
            }
        }
    }
}
