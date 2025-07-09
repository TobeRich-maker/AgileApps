<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            'admin',
            'scrum_master',
            'product_owner',
            'developer',
            'designer',
        ];

        foreach ($roles as $role) {
            DB::table('roles')->insertOrIgnore([
                'name' => $role,
                'display_name' => ucwords(str_replace('_', ' ', $role)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
