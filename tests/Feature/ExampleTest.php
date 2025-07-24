<?php

it('returns a successful response', function () {
    $user = \App\Models\User::factory()->create();
    $this->actingAs($user);
    
    $response = $this->get('/');

    $response->assertOk();
});
