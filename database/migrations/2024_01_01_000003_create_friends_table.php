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
        Schema::create('friends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->date('birthday')->nullable()->comment('Friend\'s birthday');
            $table->date('anniversary')->nullable()->comment('Anniversary date');
            $table->string('partner')->nullable()->comment('Partner/spouse name');
            $table->json('kids')->nullable()->comment('Kids names and info');
            $table->string('job_title')->nullable();
            $table->string('company')->nullable();
            $table->text('address')->nullable();
            $table->text('notes')->nullable();
            $table->date('last_contact_date')->nullable()->comment('Last time we contacted');
            $table->string('profile_picture')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'name']);
            $table->index(['user_id', 'birthday']);
            $table->index(['user_id', 'last_contact_date']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('friends');
    }
};