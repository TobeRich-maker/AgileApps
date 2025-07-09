<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        $notificationTemplates = [
            [
                'title' => 'New Task Assigned',
                'message' => 'You have been assigned a new task: "Implement user authentication"',
                'type' => 'task',
                'action_url' => '/dashboard/tasks/1',
            ],
            [
                'title' => 'Sprint Starting Soon',
                'message' => 'Sprint "Core Features" will start tomorrow. Make sure you\'re ready!',
                'type' => 'sprint',
                'action_url' => '/dashboard/sprints/2',
            ],
            [
                'title' => 'Daily Standup Reminder',
                'message' => 'Don\'t forget to log your daily standup for today',
                'type' => 'standup',
                'action_url' => '/dashboard/standups',
            ],
            [
                'title' => 'Bug Report Assigned',
                'message' => 'A new bug has been assigned to you: "Login form validation not working"',
                'type' => 'bug',
                'action_url' => '/dashboard/bugs/1',
            ],
            [
                'title' => 'System Maintenance',
                'message' => 'Scheduled maintenance will occur tonight from 2 AM to 4 AM',
                'type' => 'system',
                'action_url' => null,
            ],
        ];

        foreach ($users as $user) {
            // Create 3-5 notifications per user
            $notificationCount = rand(3, 5);
            
            for ($i = 0; $i < $notificationCount; $i++) {
                $template = $notificationTemplates[array_rand($notificationTemplates)];
                
                Notification::create([
                    'user_id' => $user->id,
                    'title' => $template['title'],
                    'message' => $template['message'],
                    'type' => $template['type'],
                    'action_url' => $template['action_url'],
                    'data' => [
                        'created_by' => 'system',
                        'priority' => rand(1, 3),
                    ],
                    'read_at' => rand(0, 1) ? now()->subHours(rand(1, 24)) : null,
                    'created_at' => now()->subHours(rand(1, 72)),
                ]);
            }
        }
    }
}
