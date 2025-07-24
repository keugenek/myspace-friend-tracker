import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Friend {
    id: number;
    name: string;
    email?: string;
    birthday?: string;
    last_contact_date?: string;
    profile_picture?: string;
}

interface Interaction {
    id: number;
    type: string;
    description: string;
    interaction_date: string;
    friend: Friend;
}

interface Stats {
    total_friends: number;
    interactions_this_month: number;
    upcoming_birthdays: number;
    needs_contact: number;
}

interface Props {
    upcomingBirthdays: Friend[];
    recentFriends: Friend[];
    recentInteractions: Interaction[];
    needsContact: Friend[];
    stats: Stats;
    [key: string]: unknown;
}

export default function Dashboard({ 
    upcomingBirthdays, 
    recentFriends, 
    recentInteractions, 
    needsContact, 
    stats 
}: Props) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString();
    };

    const formatBirthday = (birthday?: string) => {
        if (!birthday) return 'Unknown';
        const date = new Date(birthday);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    const getDaysUntilBirthday = (birthday?: string) => {
        if (!birthday) return 0;
        const today = new Date();
        const birthDate = new Date(birthday);
        birthDate.setFullYear(today.getFullYear());
        
        if (birthDate < today) {
            birthDate.setFullYear(today.getFullYear() + 1);
        }
        
        const diffTime = birthDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <AppLayout>
            <div className="myspace-container">
                <div className="myspace-header">
                    <h1 className="myspace-title">My Friends CRM</h1>
                    <p className="myspace-subtitle">Keep track of your friendships ✨</p>
                </div>

                {/* Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{stats.total_friends}</div>
                        <div className="stat-label">Total Friends</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.interactions_this_month}</div>
                        <div className="stat-label">Interactions This Month</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.upcoming_birthdays}</div>
                        <div className="stat-label">Upcoming Birthdays</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.needs_contact}</div>
                        <div className="stat-label">Need Contact</div>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Upcoming Birthdays */}
                    <div className="myspace-section">
                        <div className="section-header">
                            <h2>🎂 Upcoming Birthdays</h2>
                        </div>
                        <div className="section-content">
                            {upcomingBirthdays.length > 0 ? (
                                upcomingBirthdays.map((friend) => (
                                    <div key={friend.id} className="friend-item birthday-item">
                                        <div className="friend-avatar">
                                            {friend.profile_picture ? (
                                                <img src={`/storage/${friend.profile_picture}`} alt={friend.name} />
                                            ) : (
                                                <div className="avatar-placeholder">{friend.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="friend-info">
                                            <div className="friend-name">{friend.name}</div>
                                            <div className="birthday-date">
                                                {formatBirthday(friend.birthday)} 
                                                <span className="days-until">
                                                    ({getDaysUntilBirthday(friend.birthday)} days)
                                                </span>
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            className="contact-btn"
                                            onClick={() => router.get(route('friends.show', friend.id))}
                                        >
                                            View
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">No upcoming birthdays! 🎉</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Friends */}
                    <div className="myspace-section">
                        <div className="section-header">
                            <h2>👥 Recent Friends</h2>
                            <Button 
                                size="sm" 
                                onClick={() => router.get(route('friends.create'))}
                                className="add-btn"
                            >
                                Add Friend
                            </Button>
                        </div>
                        <div className="section-content">
                            {recentFriends.length > 0 ? (
                                recentFriends.map((friend) => (
                                    <div key={friend.id} className="friend-item">
                                        <div className="friend-avatar">
                                            {friend.profile_picture ? (
                                                <img src={`/storage/${friend.profile_picture}`} alt={friend.name} />
                                            ) : (
                                                <div className="avatar-placeholder">{friend.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="friend-info">
                                            <div className="friend-name">{friend.name}</div>
                                            <div className="friend-email">{friend.email || 'No email'}</div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            className="contact-btn"
                                            onClick={() => router.get(route('friends.show', friend.id))}
                                        >
                                            View
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    No friends yet! 
                                    <Button 
                                        size="sm" 
                                        onClick={() => router.get(route('friends.create'))}
                                        className="ml-2"
                                    >
                                        Add your first friend
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Interactions */}
                    <div className="myspace-section">
                        <div className="section-header">
                            <h2>💬 Recent Interactions</h2>
                            <Button 
                                size="sm" 
                                onClick={() => router.get(route('interactions.create'))}
                                className="add-btn"
                            >
                                Log Interaction
                            </Button>
                        </div>
                        <div className="section-content">
                            {recentInteractions.length > 0 ? (
                                recentInteractions.map((interaction) => (
                                    <div key={interaction.id} className="interaction-item">
                                        <div className="interaction-type">{interaction.type}</div>
                                        <div className="interaction-info">
                                            <div className="interaction-friend">{interaction.friend.name}</div>
                                            <div className="interaction-desc">{interaction.description}</div>
                                            <div className="interaction-date">{formatDate(interaction.interaction_date)}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">No interactions yet!</div>
                            )}
                        </div>
                    </div>

                    {/* Friends Needing Contact */}
                    <div className="myspace-section">
                        <div className="section-header">
                            <h2>📞 Need to Contact</h2>
                        </div>
                        <div className="section-content">
                            {needsContact.length > 0 ? (
                                needsContact.map((friend) => (
                                    <div key={friend.id} className="friend-item needs-contact">
                                        <div className="friend-avatar">
                                            {friend.profile_picture ? (
                                                <img src={`/storage/${friend.profile_picture}`} alt={friend.name} />
                                            ) : (
                                                <div className="avatar-placeholder">{friend.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="friend-info">
                                            <div className="friend-name">{friend.name}</div>
                                            <div className="last-contact">
                                                Last contact: {formatDate(friend.last_contact_date) || 'Never'}
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            className="contact-btn urgent"
                                            onClick={() => router.get(route('friends.show', friend.id))}
                                        >
                                            Contact
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">You're all caught up! 🎉</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <Button onClick={() => router.get(route('friends.index'))}>
                        View All Friends
                    </Button>
                    <Button onClick={() => router.get(route('interactions.index'))}>
                        View All Interactions
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}