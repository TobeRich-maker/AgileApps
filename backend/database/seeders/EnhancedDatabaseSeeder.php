<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EnhancedDatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            TeamSeeder::class,
            ProjectSeeder::class,
            EpicSeeder::class,
            StorySeeder::class,
            SprintSeeder::class,
            TaskSeeder::class,
            BugSeeder::class,
            StandupSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
