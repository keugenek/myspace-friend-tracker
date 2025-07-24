<?php

namespace Database\Seeders;

use App\Models\Friend;
use App\Models\Interaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class CrmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a demo user if none exists
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Demo User',
                'email' => 'demo@example.com',
            ]);
        }

        // Create friends for the user
        $friends = Friend::factory(20)->create([
            'user_id' => $user->id,
        ]);

        // Create some friends with upcoming birthdays
        Friend::factory(3)->upcomingBirthday()->create([
            'user_id' => $user->id,
        ]);

        // Create some friends that need contact
        Friend::factory(4)->needsContact()->create([
            'user_id' => $user->id,
        ]);

        // Create interactions for each friend
        $allFriends = Friend::where('user_id', $user->id)->get();
        
        foreach ($allFriends as $friend) {
            // Create 3-8 random interactions per friend
            $interactionCount = fake()->numberBetween(3, 8);
            
            Interaction::factory($interactionCount)->create([
                'friend_id' => $friend->id,
            ]);

            // Ensure some recent interactions
            if (fake()->numberBetween(1, 3) === 1) { // 33% chance
                Interaction::factory(fake()->numberBetween(1, 2))->recent()->create([
                    'friend_id' => $friend->id,
                ]);
            }

            // Update the friend's last contact date based on their latest interaction
            $latestInteraction = $friend->interactions()->latest('interaction_date')->first();
            if ($latestInteraction) {
                /** @var \App\Models\Interaction $latestInteraction */
                $friend->update([
                    'last_contact_date' => $latestInteraction->interaction_date->format('Y-m-d')
                ]);
            }
        }

        $this->command->info('CRM seeder completed! Created:');
        $this->command->info('- 1 demo user');
        $this->command->info('- ' . Friend::where('user_id', $user->id)->count() . ' friends');
        $this->command->info('- ' . Interaction::whereHas('friend', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })->count() . ' interactions');
    }
}