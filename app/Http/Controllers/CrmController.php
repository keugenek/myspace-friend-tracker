<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Friend;
use App\Models\Interaction;
use Inertia\Inertia;

class CrmController extends Controller
{
    /**
     * Display the CRM dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get upcoming birthdays (next 30 days)
        $upcomingBirthdays = Friend::where('user_id', $user->id)
            ->upcomingBirthdays(30)
            ->orderByRaw(config('database.default') === 'mysql' 
                ? "DATE_FORMAT(birthday, '%m-%d')" 
                : "strftime('%m-%d', birthday)")
            ->get();

        // Get recent friends (last 6 added)
        $recentFriends = Friend::where('user_id', $user->id)
            ->latest()
            ->limit(6)
            ->get();

        // Get recent interactions (last 10)
        $recentInteractions = Interaction::whereHas('friend', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('friend')
            ->latest('interaction_date')
            ->limit(10)
            ->get();

        // Friends who haven't been contacted in a while (30+ days)
        $needsContact = Friend::where('user_id', $user->id)
            ->where(function ($query) {
                $query->whereNull('last_contact_date')
                      ->orWhere('last_contact_date', '<', now()->subDays(30));
            })
            ->orderBy('last_contact_date', 'asc')
            ->limit(6)
            ->get();

        // Stats
        $stats = [
            'total_friends' => Friend::where('user_id', $user->id)->count(),
            'interactions_this_month' => Interaction::whereHas('friend', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->whereMonth('interaction_date', now()->month)->count(),
            'upcoming_birthdays' => $upcomingBirthdays->count(),
            'needs_contact' => $needsContact->count(),
        ];

        return Inertia::render('crm/dashboard', [
            'upcomingBirthdays' => $upcomingBirthdays,
            'recentFriends' => $recentFriends,
            'recentInteractions' => $recentInteractions,
            'needsContact' => $needsContact,
            'stats' => $stats,
        ]);
    }
}