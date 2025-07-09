<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('epics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('status', ['planned', 'in_progress', 'completed', 'cancelled'])->default('planned');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('owner_id')->constrained('users');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('color', 7)->default('#3b82f6');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('epics');
    }
};
