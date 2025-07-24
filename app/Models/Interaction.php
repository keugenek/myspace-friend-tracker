<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Interaction
 *
 * @property int $id
 * @property int $friend_id
 * @property string $type
 * @property string $description
 * @property \Illuminate\Support\Carbon $interaction_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Friend $friend
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction query()
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereFriendId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereInteractionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Interaction whereUpdatedAt($value)
 * @method static \Database\Factories\InteractionFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Interaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'friend_id',
        'type',
        'description',
        'interaction_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'interaction_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the friend that owns the interaction.
     */
    public function friend(): BelongsTo
    {
        return $this->belongsTo(Friend::class);
    }
}