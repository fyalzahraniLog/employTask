<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\GroupController;
use App\Models\Task;

Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('login');

Route::get('task', function () {
    return view('newGroup');
})->middleware(['auth', 'verified'])->name('task');



Route::middleware('auth')->group(function () {

    // task routes;
    Route::post('task/TaskStatus', [TaskController::class, 'updateTaskStatus']);
    Route::post('task/completion', [TaskController::class, 'complete']);
    Route::resource('task', TaskController::class)->only(['index', 'store', 'update', 'destroy']);

    // group routes;
    Route::resource('group', GroupController::class)->only(['store', 'update', 'destroy']);
});


require __DIR__ . '/auth.php';
