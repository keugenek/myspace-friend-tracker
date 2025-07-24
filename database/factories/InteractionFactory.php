<?php

namespace Database\Factories;

use App\Models\Friend;
use App\Models\Interaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Interaction>
 */
class InteractionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['call', 'text', 'email', 'hangout', 'meeting', 'other'];
        $type = $this->faker->randomElement($types);
        
        $descriptions = [
            'call' => [
                'Had a great catch-up call. Discussed recent life updates and work.',
                'Quick phone call to check in and see how they\'re doing.',
                'Long conversation about family and upcoming plans.',
                'Called to wish them luck with their new project.',
                'Phone call to discuss weekend plans and catch up.',
            ],
            'text' => [
                'Exchanged texts about weekend plans.',
                'Quick text check-in to see how they\'re doing.',
                'Shared some funny memes and had a good laugh.',
                'Texted about the latest news and current events.',
                'Brief text conversation about work and life.',
            ],
            'email' => [
                'Sent a detailed email catching up on recent events.',
                'Email exchange about a shared interest or hobby.',
                'Forwarded an interesting article and discussed it.',
                'Email about planning a future get-together.',
                'Professional email about a potential collaboration.',
            ],
            'hangout' => [
                'Spent the afternoon together, had coffee and great conversation.',
                'Went out for dinner and had an amazing time.',
                'Hung out at their place, watched movies and relaxed.',
                'Met up for lunch and caught up on everything.',
                'Spent the evening together, lots of laughs and good times.',
            ],
            'meeting' => [
                'Professional meeting to discuss potential collaboration.',
                'Met for coffee to talk about a shared project.',
                'Business meeting that turned into a great catch-up.',
                'Formal meeting that was both productive and friendly.',
                'Work-related meeting where we also caught up personally.',
            ],
            'other' => [
                'Bumped into them at the store and had a quick chat.',
                'Saw them at an event and had a great conversation.',
                'Connected through social media and exchanged messages.',
                'Met through mutual friends and hit it off immediately.',
                'Random encounter that led to a wonderful conversation.',
            ],
        ];

        return [
            'friend_id' => Friend::factory(),
            'type' => $type,
            'description' => $this->faker->randomElement($descriptions[$type]),
            'interaction_date' => $this->faker->dateTimeBetween('-90 days', 'now')->format('Y-m-d'),
        ];
    }

    /**
     * Indicate that this is a recent interaction.
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'interaction_date' => $this->faker->dateTimeBetween('-7 days', 'now')->format('Y-m-d'),
        ]);
    }

    /**
     * Indicate that this is a phone call interaction.
     */
    public function phoneCall(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'call',
            'description' => $this->faker->randomElement([
                'Had an amazing phone call catching up on life.',
                'Long conversation about work and family updates.',
                'Quick call to check in and see how things are going.',
                'Called to share some exciting news.',
                'Phone call about planning our next get-together.',
            ]),
        ]);
    }
}