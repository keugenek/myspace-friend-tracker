import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Interaction {
    id: number;
    type: string;
    description: string;
    interaction_date: string;
}

interface Friend {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    birthday?: string;
    anniversary?: string;
    partner?: string;
    kids?: string[];
    job_title?: string;
    company?: string;
    address?: string;
    notes?: string;
    last_contact_date?: string;
    profile_picture?: string;
    interactions: Interaction[];
}

interface Props {
    friend: Friend;
    [key: string]: unknown;
}

export default function ShowFriend({ friend }: Props) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    const formatBirthday = (birthday?: string) => {
        if (!birthday) return 'Unknown';
        const date = new Date(birthday);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();
        
        const finalAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
        
        return `${date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        })} (Age ${finalAge})`;
    };

    const getInteractionIcon = (type: string) => {
        const icons: Record<string, string> = {
            call: '📞',
            text: '💬',
            email: '📧',
            hangout: '🎉',
            meeting: '🤝',
            other: '💭'
        };
        return icons[type] || '💭';
    };

    const handleDeleteFriend = () => {
        if (confirm(`Are you sure you want to delete ${friend.name}? This action cannot be undone.`)) {
            router.delete(route('friends.destroy', friend.id));
        }
    };

    return (
        <AppLayout>
            <div className="myspace-container">
                {/* Friend Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {friend.profile_picture ? (
                            <img src={`/storage/${friend.profile_picture}`} alt={friend.name} />
                        ) : (
                            <div className="avatar-placeholder-xl">
                                {friend.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{friend.name}</h1>
                        {friend.job_title && friend.company && (
                            <p className="profile-job">
                                {friend.job_title} at {friend.company}
                            </p>
                        )}
                        <div className="profile-actions">
                            <Button 
                                onClick={() => router.get(route('interactions.create', { friend_id: friend.id }))}
                                className="action-btn primary"
                            >
                                📝 Log Interaction
                            </Button>
                            <Button 
                                onClick={() => router.get(route('friends.edit', friend.id))}
                                className="action-btn secondary"
                            >
                                ✏️ Edit Friend
                            </Button>
                            <Button 
                                onClick={handleDeleteFriend}
                                className="action-btn danger"
                            >
                                🗑️ Delete
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    {/* Contact Information */}
                    <div className="info-section">
                        <h2 className="section-title">📞 Contact Information</h2>
                        <div className="info-grid">
                            {friend.email && (
                                <div className="info-item">
                                    <span className="info-icon">📧</span>
                                    <div>
                                        <strong>Email:</strong>
                                        <a href={`mailto:${friend.email}`} className="contact-link">
                                            {friend.email}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {friend.phone && (
                                <div className="info-item">
                                    <span className="info-icon">📱</span>
                                    <div>
                                        <strong>Phone:</strong>
                                        <a href={`tel:${friend.phone}`} className="contact-link">
                                            {friend.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="info-icon">💬</span>
                                <div>
                                    <strong>Last Contact:</strong>
                                    <span className={friend.last_contact_date ? 'contact-date' : 'no-contact'}>
                                        {formatDate(friend.last_contact_date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="info-section">
                        <h2 className="section-title">🎂 Personal Information</h2>
                        <div className="info-grid">
                            {friend.birthday && (
                                <div className="info-item birthday-item">
                                    <span className="info-icon">🎂</span>
                                    <div>
                                        <strong>Birthday:</strong>
                                        <span className="birthday-text">{formatBirthday(friend.birthday)}</span>
                                    </div>
                                </div>
                            )}
                            {friend.anniversary && (
                                <div className="info-item">
                                    <span className="info-icon">💕</span>
                                    <div>
                                        <strong>Anniversary:</strong>
                                        <span>{formatDate(friend.anniversary)}</span>
                                    </div>
                                </div>
                            )}
                            {friend.partner && (
                                <div className="info-item">
                                    <span className="info-icon">💑</span>
                                    <div>
                                        <strong>Partner:</strong>
                                        <span>{friend.partner}</span>
                                    </div>
                                </div>
                            )}
                            {friend.kids && friend.kids.length > 0 && (
                                <div className="info-item">
                                    <span className="info-icon">👶</span>
                                    <div>
                                        <strong>Kids:</strong>
                                        <div className="kids-list">
                                            {friend.kids.map((kid, index) => (
                                                <span key={index} className="kid-tag">{kid}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    {(friend.address || friend.notes) && (
                        <div className="info-section">
                            <h2 className="section-title">📍 Additional Information</h2>
                            <div className="info-grid">
                                {friend.address && (
                                    <div className="info-item full-width">
                                        <span className="info-icon">🏠</span>
                                        <div>
                                            <strong>Address:</strong>
                                            <div className="address-text">{friend.address}</div>
                                        </div>
                                    </div>
                                )}
                                {friend.notes && (
                                    <div className="info-item full-width">
                                        <span className="info-icon">📝</span>
                                        <div>
                                            <strong>Notes:</strong>
                                            <div className="notes-text">{friend.notes}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recent Interactions */}
                    <div className="info-section">
                        <h2 className="section-title">💬 Recent Interactions</h2>
                        {friend.interactions && friend.interactions.length > 0 ? (
                            <div className="interactions-list">
                                {friend.interactions.slice(0, 10).map((interaction) => (
                                    <div key={interaction.id} className="interaction-card">
                                        <div className="interaction-header">
                                            <span className="interaction-icon">
                                                {getInteractionIcon(interaction.type)}
                                            </span>
                                            <span className="interaction-type-text">
                                                {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                                            </span>
                                            <span className="interaction-date">
                                                {formatDate(interaction.interaction_date)}
                                            </span>
                                        </div>
                                        <div className="interaction-description">
                                            {interaction.description}
                                        </div>
                                    </div>
                                ))}
                                {friend.interactions.length > 10 && (
                                    <div className="more-interactions">
                                        <Button 
                                            onClick={() => router.get(route('interactions.index', { friend: friend.id }))}
                                            className="view-all-btn"
                                        >
                                            View All {friend.interactions.length} Interactions
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-interactions">
                                <p>No interactions recorded yet.</p>
                                <Button 
                                    onClick={() => router.get(route('interactions.create', { friend_id: friend.id }))}
                                    className="first-interaction-btn"
                                >
                                    Log First Interaction
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back to Friends List */}
                <div className="back-actions">
                    <Button 
                        onClick={() => router.get(route('friends.index'))}
                        className="back-btn"
                    >
                        👥 Back to Friends List
                    </Button>
                    <Button 
                        onClick={() => router.get(route('home'))}
                        className="home-btn"
                    >
                        🏠 Back to Dashboard
                    </Button>
                </div>
            </div>

            <style>{`
                .profile-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px;
                    border-radius: 20px;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    color: white;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                }

                .profile-avatar {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    margin-right: 40px;
                    overflow: hidden;
                    border: 5px solid white;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                }

                .profile-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-placeholder-xl {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #ff6b6b, #feca57);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 4rem;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                }

                .profile-name {
                    font-size: 3rem;
                    font-weight: bold;
                    margin: 0 0 10px 0;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                }

                .profile-job {
                    font-size: 1.3rem;
                    margin-bottom: 20px;
                    opacity: 0.9;
                }

                .profile-actions {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .action-btn {
                    border: none;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 25px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }

                .action-btn.primary {
                    background: linear-gradient(45deg, #4ecdc4, #44a08d);
                }

                .action-btn.secondary {
                    background: linear-gradient(45deg, #f9ca24, #f0932b);
                }

                .action-btn.danger {
                    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                }

                .action-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                }

                .profile-content {
                    display: grid;
                    gap: 30px;
                }

                .info-section {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    border: 3px solid #4ecdc4;
                    box-shadow: 0 8px 25px rgba(78, 205, 196, 0.2);
                    overflow: hidden;
                }

                .section-title {
                    background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                    color: white;
                    font-size: 1.5rem;
                    font-weight: bold;
                    padding: 20px 30px;
                    margin: 0;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                }

                .info-grid {
                    padding: 30px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                }

                .info-item {
                    display: flex;
                    align-items: flex-start;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 15px;
                    border: 1px solid #e0e0e0;
                    transition: all 0.3s ease;
                }

                .info-item:hover {
                    background: rgba(255, 255, 255, 0.95);
                    border-color: #4ecdc4;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }

                .info-item.full-width {
                    grid-column: 1 / -1;
                }

                .info-item.birthday-item {
                    border-color: #f9ca24;
                    animation: birthday-highlight 3s infinite;
                }

                @keyframes birthday-highlight {
                    0%, 100% { box-shadow: 0 0 5px rgba(249, 202, 36, 0.3); }
                    50% { box-shadow: 0 0 20px rgba(249, 202, 36, 0.6); }
                }

                .info-icon {
                    font-size: 1.5rem;
                    margin-right: 15px;
                    margin-top: 2px;
                }

                .contact-link {
                    color: #4ecdc4;
                    text-decoration: none;
                    font-weight: bold;
                    transition: color 0.3s ease;
                }

                .contact-link:hover {
                    color: #ff6b6b;
                    text-decoration: underline;
                }

                .contact-date {
                    color: #666;
                }

                .no-contact {
                    color: #ff6b6b;
                    font-style: italic;
                }

                .birthday-text {
                    color: #f9ca24;
                    font-weight: bold;
                }

                .kids-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 5px;
                }

                .kid-tag {
                    background: linear-gradient(45deg, #ff6b6b, #feca57);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 15px;
                    font-size: 0.9rem;
                    font-weight: bold;
                }

                .address-text, .notes-text {
                    margin-top: 8px;
                    color: #666;
                    line-height: 1.5;
                }

                .interactions-list {
                    padding: 30px;
                }

                .interaction-card {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    border: 1px solid #e0e0e0;
                    padding: 20px;
                    margin-bottom: 15px;
                    transition: all 0.3s ease;
                }

                .interaction-card:hover {
                    border-color: #4ecdc4;
                    transform: translateX(5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }

                .interaction-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    gap: 10px;
                }

                .interaction-icon {
                    font-size: 1.2rem;
                }

                .interaction-type-text {
                    font-weight: bold;
                    color: #333;
                    text-transform: capitalize;
                }

                .interaction-date {
                    color: #666;
                    font-size: 0.9rem;
                    margin-left: auto;
                }

                .interaction-description {
                    color: #555;
                    line-height: 1.5;
                }

                .no-interactions {
                    text-align: center;
                    padding: 40px;
                    color: #666;
                }

                .first-interaction-btn, .view-all-btn {
                    background: linear-gradient(45deg, #4ecdc4, #44a08d);
                    border: none;
                    color: white;
                    margin-top: 15px;
                }

                .more-interactions {
                    text-align: center;
                    margin-top: 20px;
                }

                .back-actions {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 40px;
                }

                .back-btn, .home-btn {
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border: none;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    .profile-header {
                        flex-direction: column;
                        text-align: center;
                        padding: 30px 20px;
                    }
                    
                    .profile-avatar {
                        margin-right: 0;
                        margin-bottom: 20px;
                        width: 120px;
                        height: 120px;
                    }
                    
                    .profile-name {
                        font-size: 2rem;
                    }
                    
                    .profile-actions {
                        justify-content: center;
                    }
                    
                    .info-grid {
                        grid-template-columns: 1fr;
                        padding: 20px;
                    }
                    
                    .back-actions {
                        flex-direction: column;
                        align-items: center;
                    }
                }
            `}</style>
        </AppLayout>
    );
}