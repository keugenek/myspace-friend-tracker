<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('friend_id')->constrained()->onDelete('cascade');
            $table->string('type')->comment('Type of interaction: call, text, email, hangout, etc.');
            $table->text('description');
            $table->date('interaction_date')->comment('Date of the interaction');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['friend_id', 'interaction_date']);
            $table->index('interaction_date');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interactions');
    }
};