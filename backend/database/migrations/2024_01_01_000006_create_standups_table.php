<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('standups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('sprint_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->text('yesterday_work')->nullable();
            $table->text('today_plan')->nullable();
            $table->text('blockers')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'sprint_id', 'date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('standups');
    }
};
