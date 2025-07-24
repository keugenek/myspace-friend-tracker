import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Friend {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    birthday?: string;
    last_contact_date?: string;
    profile_picture?: string;
    company?: string;
    job_title?: string;
}

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    from: number;
    to: number;
    total: number;
    last_page: number;
}

interface Props {
    friends: {
        data: Friend[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    [key: string]: unknown;
}

export default function FriendsIndex({ friends }: Props) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    const formatBirthday = (birthday?: string) => {
        if (!birthday) return 'Unknown';
        const date = new Date(birthday);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    return (
        <AppLayout>
            <div className="myspace-container">
                <div className="myspace-header">
                    <h1 className="myspace-title">My Friends List</h1>
                    <p className="myspace-subtitle">All my awesome friends! 👫</p>
                    <div className="mt-4">
                        <Button 
                            onClick={() => router.get(route('friends.create'))}
                            className="add-btn text-lg px-6 py-3"
                        >
                            ✨ Add New Friend
                        </Button>
                    </div>
                </div>

                <div className="friends-grid">
                    {friends.data.length > 0 ? (
                        friends.data.map((friend) => (
                            <div key={friend.id} className="friend-card">
                                <div className="friend-card-header">
                                    <div className="friend-avatar-large">
                                        {friend.profile_picture ? (
                                            <img src={`/storage/${friend.profile_picture}`} alt={friend.name} />
                                        ) : (
                                            <div className="avatar-placeholder-large">
                                                {friend.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="friend-card-info">
                                        <h3 className="friend-card-name">{friend.name}</h3>
                                        {friend.job_title && friend.company && (
                                            <p className="friend-job">
                                                {friend.job_title} at {friend.company}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="friend-card-details">
                                    {friend.email && (
                                        <div className="detail-item">
                                            <span className="detail-icon">📧</span>
                                            <span className="detail-text">{friend.email}</span>
                                        </div>
                                    )}
                                    {friend.phone && (
                                        <div className="detail-item">
                                            <span className="detail-icon">📱</span>
                                            <span className="detail-text">{friend.phone}</span>
                                        </div>
                                    )}
                                    {friend.birthday && (
                                        <div className="detail-item">
                                            <span className="detail-icon">🎂</span>
                                            <span className="detail-text">Birthday: {formatBirthday(friend.birthday)}</span>
                                        </div>
                                    )}
                                    <div className="detail-item">
                                        <span className="detail-icon">💬</span>
                                        <span className="detail-text">
                                            Last contact: {formatDate(friend.last_contact_date)}
                                        </span>
                                    </div>
                                </div>

                                <div className="friend-card-actions">
                                    <Button 
                                        size="sm" 
                                        onClick={() => router.get(route('friends.show', friend.id))}
                                        className="view-btn"
                                    >
                                        View Profile
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        onClick={() => router.get(route('friends.edit', friend.id))}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-friends">
                            <div className="empty-icon">😔</div>
                            <h3>No friends yet!</h3>
                            <p>Start building your network by adding your first friend.</p>
                            <Button 
                                onClick={() => router.get(route('friends.create'))}
                                className="add-btn mt-4"
                            >
                                Add Your First Friend
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {friends.meta.last_page > 1 && (
                    <div className="pagination-container">
                        <div className="pagination-info">
                            Showing {friends.meta.from} to {friends.meta.to} of {friends.meta.total} friends
                        </div>
                        <div className="pagination-links">
                            {friends.links.map((link, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`pagination-btn ${link.active ? 'active' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="back-to-home">
                    <Button 
                        onClick={() => router.get(route('home'))}
                        className="back-btn"
                    >
                        🏠 Back to Dashboard
                    </Button>
                </div>
            </div>

            <style>{`
                .friends-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                    margin-bottom: 40px;
                }

                .friend-card {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    border: 3px solid #4ecdc4;
                    box-shadow: 0 8px 25px rgba(78, 205, 196, 0.2);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .friend-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(78, 205, 196, 0.3);
                    border-color: #ff6b6b;
                }

                .friend-card-header {
                    background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    color: white;
                }

                .friend-avatar-large {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin-right: 20px;
                    overflow: hidden;
                    border: 3px solid white;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .friend-avatar-large img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-placeholder-large {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #ff6b6b, #feca57);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 2rem;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                }

                .friend-card-name {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 0;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
                }

                .friend-job {
                    font-size: 1rem;
                    opacity: 0.9;
                    margin: 5px 0 0 0;
                }

                .friend-card-details {
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.8);
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 0.95rem;
                }

                .detail-icon {
                    font-size: 1.2rem;
                    margin-right: 10px;
                    width: 25px;
                    text-align: center;
                }

                .friend-card-actions {
                    padding: 15px 20px;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    gap: 10px;
                    justify-content: space-between;
                }

                .view-btn {
                    background: linear-gradient(45deg, #45b7d1, #96ceb4);
                    border: none;
                    color: white;
                    flex: 1;
                }

                .edit-btn {
                    background: linear-gradient(45deg, #f9ca24, #f0932b);
                    border: none;
                    color: white;
                    flex: 1;
                }

                .empty-friends {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    border: 3px dashed #ccc;
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                }

                .empty-friends h3 {
                    font-size: 2rem;
                    color: #666;
                    margin-bottom: 10px;
                }

                .empty-friends p {
                    color: #888;
                    font-size: 1.1rem;
                }

                .pagination-container {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: center;
                }

                .pagination-info {
                    color: #666;
                    margin-bottom: 15px;
                    font-size: 0.9rem;
                }

                .pagination-links {
                    display: flex;
                    justify-content: center;
                    gap: 5px;
                    flex-wrap: wrap;
                }

                .pagination-btn {
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .pagination-btn:hover:not(:disabled) {
                    background: #4ecdc4;
                    color: white;
                    border-color: #4ecdc4;
                }

                .pagination-btn.active {
                    background: #ff6b6b;
                    color: white;
                    border-color: #ff6b6b;
                }

                .pagination-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .back-to-home {
                    text-align: center;
                }

                .back-btn {
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    .friends-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .friend-card-header {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .friend-avatar-large {
                        margin-right: 0;
                        margin-bottom: 15px;
                    }
                }
            `}</style>
        </AppLayout>
    );
}