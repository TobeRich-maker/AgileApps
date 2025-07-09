<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->json('acceptance_criteria')->nullable();
            $table->integer('story_points')->default(1);
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['backlog', 'ready', 'in_progress', 'done'])->default('backlog');
            $table->foreignId('epic_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('creator_id')->constrained('users');
            $table->foreignId('assignee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('stories');
    }
};
