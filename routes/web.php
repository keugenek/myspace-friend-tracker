<?php

use App\Http\Controllers\CrmController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\InteractionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - show CRM dashboard for authenticated users, redirect guests to login
Route::get('/', function () {
    if (auth()->check()) {
        return app(CrmController::class)->index();
    }
    return redirect()->route('login');
})->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Friends resource routes
    Route::resource('friends', FriendController::class);

    // Interactions routes
    Route::resource('interactions', InteractionController::class)->except(['edit', 'update']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';