<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFriendRequest;
use App\Http\Requests\UpdateFriendRequest;
use App\Models\Friend;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FriendController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $friends = Friend::where('user_id', auth()->id())
            ->with('interactions')
            ->latest()
            ->paginate(12);
        
        return Inertia::render('friends/index', [
            'friends' => $friends
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('friends/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFriendRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        if ($request->hasFile('profile_picture')) {
            $data['profile_picture'] = $request->file('profile_picture')->store('profile-pictures', 'public');
        }

        $friend = Friend::create($data);

        return redirect()->route('friends.show', $friend)
            ->with('success', 'Friend added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Friend $friend)
    {
        // Ensure the friend belongs to the authenticated user
        if ($friend->user_id !== auth()->id()) {
            abort(403);
        }
        
        $friend->load(['interactions' => function ($query) {
            $query->latest('interaction_date');
        }]);

        return Inertia::render('friends/show', [
            'friend' => $friend
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Friend $friend)
    {
        // Ensure the friend belongs to the authenticated user
        if ($friend->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('friends/edit', [
            'friend' => $friend
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFriendRequest $request, Friend $friend)
    {
        // Ensure the friend belongs to the authenticated user
        if ($friend->user_id !== auth()->id()) {
            abort(403);
        }
        
        $data = $request->validated();

        if ($request->hasFile('profile_picture')) {
            $data['profile_picture'] = $request->file('profile_picture')->store('profile-pictures', 'public');
        }

        $friend->update($data);

        return redirect()->route('friends.show', $friend)
            ->with('success', 'Friend updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Friend $friend)
    {
        // Ensure the friend belongs to the authenticated user
        if ($friend->user_id !== auth()->id()) {
            abort(403);
        }
        
        $friend->delete();

        return redirect()->route('friends.index')
            ->with('success', 'Friend deleted successfully.');
    }
}