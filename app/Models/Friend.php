<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Friend
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $email
 * @property string|null $phone
 * @property \Illuminate\Support\Carbon|null $birthday
 * @property \Illuminate\Support\Carbon|null $anniversary
 * @property string|null $partner
 * @property array|null $kids
 * @property string|null $job_title
 * @property string|null $company
 * @property string|null $address
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $last_contact_date
 * @property string|null $profile_picture
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Interaction> $interactions
 * @property-read int|null $interactions_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Friend newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Friend newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Friend query()
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereBirthday($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereAnniversary($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend wherePartner($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereKids($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereJobTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereCompany($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereLastContactDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereProfilePicture($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Friend upcomingBirthdays()
 * @method static \Database\Factories\FriendFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Friend extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'birthday',
        'anniversary',
        'partner',
        'kids',
        'job_title',
        'company',
        'address',
        'notes',
        'last_contact_date',
        'profile_picture',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birthday' => 'date',
        'anniversary' => 'date',
        'last_contact_date' => 'date',
        'kids' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the friend.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the interactions for the friend.
     */
    public function interactions(): HasMany
    {
        return $this->hasMany(Interaction::class);
    }

    /**
     * Scope a query to include friends with upcoming birthdays.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $days
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUpcomingBirthdays($query, $days = 30)
    {
        $today = now();
        $endDate = $today->copy()->addDays($days);
        
        // Use database-agnostic approach
        return $query->whereNotNull('birthday')
            ->where(function ($query) use ($today, $endDate) {
                if (config('database.default') === 'mysql') {
                    $query->whereRaw("DATE_FORMAT(birthday, '%m-%d') >= DATE_FORMAT(?, '%m-%d')", [$today])
                          ->whereRaw("DATE_FORMAT(birthday, '%m-%d') <= DATE_FORMAT(?, '%m-%d')", [$endDate]);
                } else {
                    // SQLite compatible version
                    $query->whereRaw("strftime('%m-%d', birthday) >= strftime('%m-%d', ?)", [$today])
                          ->whereRaw("strftime('%m-%d', birthday) <= strftime('%m-%d', ?)", [$endDate]);
                }
            });
    }
}