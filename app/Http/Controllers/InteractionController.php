<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInteractionRequest;
use App\Models\Friend;
use App\Models\Interaction;
use Inertia\Inertia;

class InteractionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $interactions = Interaction::whereHas('friend', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->with('friend')
            ->latest('interaction_date')
            ->paginate(20);

        return Inertia::render('interactions/index', [
            'interactions' => $interactions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $friends = Friend::where('user_id', auth()->id())
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('interactions/create', [
            'friends' => $friends,
            'friend_id' => request('friend_id')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInteractionRequest $request)
    {
        $data = $request->validated();
        
        // Verify the friend belongs to the authenticated user
        $friend = Friend::where('id', $data['friend_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $interaction = Interaction::create($data);

        // Update the friend's last contact date
        $friend->update(['last_contact_date' => $data['interaction_date']]);

        return redirect()->route('friends.show', $friend)
            ->with('success', 'Interaction logged successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Interaction $interaction)
    {
        $interaction->load('friend');
        
        // Ensure the interaction belongs to the authenticated user's friend
        if ($interaction->friend->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('interactions/show', [
            'interaction' => $interaction
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Interaction $interaction)
    {
        $interaction->load('friend');
        
        // Ensure the interaction belongs to the authenticated user's friend
        if ($interaction->friend->user_id !== auth()->id()) {
            abort(403);
        }

        $interaction->delete();

        return redirect()->route('friends.show', $interaction->friend)
            ->with('success', 'Interaction deleted successfully.');
    }
}