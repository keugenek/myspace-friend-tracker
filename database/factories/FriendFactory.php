<?php

namespace Database\Factories;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Friend>
 */
class FriendFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $hasKids = $this->faker->boolean(30); // 30% chance of having kids
        $kids = $hasKids ? $this->faker->randomElements([
            'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James',
            'Isabella', 'Benjamin', 'Charlotte', 'Lucas', 'Mia', 'Henry', 'Amelia'
        ], $this->faker->numberBetween(1, 3)) : null;

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->name(),
            'email' => $this->faker->optional(0.8)->email(),
            'phone' => $this->faker->optional(0.7)->phoneNumber(),
            'birthday' => $this->faker->optional(0.6)->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'anniversary' => $this->faker->optional(0.3)->dateTimeBetween('-20 years', 'now')->format('Y-m-d'),
            'partner' => $this->faker->optional(0.4)->name(),
            'kids' => $kids,
            'job_title' => $this->faker->optional(0.7)->jobTitle(),
            'company' => $this->faker->optional(0.7)->company(),
            'address' => $this->faker->optional(0.5)->address(),
            'notes' => $this->faker->optional(0.6)->paragraph(),
            'last_contact_date' => $this->faker->optional(0.8)->dateTimeBetween('-90 days', 'now')->format('Y-m-d'),
        ];
    }

    /**
     * Indicate that the friend has upcoming birthday.
     */
    public function upcomingBirthday(): static
    {
        return $this->state(fn (array $attributes) => [
            'birthday' => $this->faker->dateTimeBetween('-40 years', '-20 years')->format('Y-m-d'),
        ]);
    }

    /**
     * Indicate that the friend needs contact.
     */
    public function needsContact(): static
    {
        return $this->state(fn (array $attributes) => [
            'last_contact_date' => $this->faker->dateTimeBetween('-90 days', '-31 days')->format('Y-m-d'),
        ]);
    }
}