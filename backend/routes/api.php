<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\SprintController;
use App\Http\Controllers\Api\StandupController;
use App\Http\Controllers\Api\BugController;
use App\Http\Controllers\Api\NotificationController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Team routes
    Route::apiResource('teams', TeamController::class);
    Route::post('/teams/{team}/members', [TeamController::class, 'addMember']);
    Route::delete('/teams/{team}/members', [TeamController::class, 'removeMember']);

    // Project routes
    Route::apiResource('projects', ProjectController::class);

    // Sprint routes
    Route::apiResource('sprints', SprintController::class);
    Route::post('/sprints/{sprint}/start', [SprintController::class, 'start']);
    Route::post('/sprints/{sprint}/complete', [SprintController::class, 'complete']);
    Route::get('/sprints/{sprint}/burndown', [SprintController::class, 'burndown']);

    // Task routes
    Route::apiResource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);

    // Standup routes
    Route::apiResource('standups', StandupController::class);
    Route::get('/standups/team/daily', [StandupController::class, 'getTeamStandup']);

    // Bug routes
    Route::apiResource('bugs', BugController::class);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount']);
});
