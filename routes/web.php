<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\GroupController;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/', [AuthenticatedSessionController::class, 'create']);
Route::get('/loginPage', function () {
    return view('loginPage');
});

Route::middleware('auth')->group(function () {

    // task routes;
    Route::get('task', [TaskController::class, 'index'])->name('task');
    Route::post('task/create', [TaskController::class, 'create'])->name('task.create');
    Route::post('task/edit', [TaskController::class, 'edit'])->name('task.edit.save');
    Route::get('task/delete/{id}', [TaskController::class, 'delete'])->name('task.delete');
    Route::get('task/complete/{id}', [TaskController::class, 'complete'])->name('task.complete');

    // group routes;
    Route::post('group/create', [GroupController::class, 'create'])->name('group.create');
    Route::get('group/delete/{id}', [GroupController::class, 'delete'])->name('group.delete');
    Route::post('group/update/{id}', [GroupController::class, 'update'])->name('group.update');
});
// Route::get('/dashboard', function () {
//     return view('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__ . '/auth.php';
