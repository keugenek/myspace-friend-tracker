import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Friend {
    id: number;
    name: string;
}

interface Interaction {
    id: number;
    type: string;
    description: string;
    interaction_date: string;
    friend: Friend;
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
    interactions: {
        data: Interaction[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    [key: string]: unknown;
}

export default function InteractionsIndex({ interactions }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            call: '#4ecdc4',
            text: '#45b7d1',
            email: '#f9ca24',
            hangout: '#ff6b6b',
            meeting: '#a55eea',
            other: '#95a5a6'
        };
        return colors[type] || '#95a5a6';
    };

    return (
        <AppLayout>
            <div className="myspace-container">
                <div className="myspace-header">
                    <h1 className="myspace-title">All Interactions</h1>
                    <p className="myspace-subtitle">Your friendship history timeline! 📜</p>
                    <div className="mt-4">
                        <Button 
                            onClick={() => router.get(route('interactions.create'))}
                            className="add-btn text-lg px-6 py-3"
                        >
                            📝 Log New Interaction
                        </Button>
                    </div>
                </div>

                <div className="interactions-container">
                    {interactions.data.length > 0 ? (
                        <div className="interactions-timeline">
                            {interactions.data.map((interaction) => (
                                <div key={interaction.id} className="timeline-item">
                                    <div className="timeline-marker">
                                        <span className="interaction-icon">
                                            {getInteractionIcon(interaction.type)}
                                        </span>
                                    </div>
                                    
                                    <div className="timeline-content">
                                        <div className="interaction-card">
                                            <div className="interaction-header">
                                                <div className="interaction-info">
                                                    <h3 className="friend-name">
                                                        {interaction.friend.name}
                                                    </h3>
                                                    <div className="interaction-meta">
                                                        <span 
                                                            className="interaction-type-badge"
                                                            style={{ backgroundColor: getTypeColor(interaction.type) }}
                                                        >
                                                            {getInteractionIcon(interaction.type)} {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                                                        </span>
                                                        <span className="interaction-date">
                                                            {formatDate(interaction.interaction_date)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="interaction-actions">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => router.get(route('friends.show', interaction.friend.id))}
                                                        className="view-friend-btn"
                                                    >
                                                        View Friend
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            <div className="interaction-description">
                                                {interaction.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-interactions">
                            <div className="empty-icon">📝</div>
                            <h3>No interactions yet!</h3>
                            <p>Start logging your conversations and hangouts with friends.</p>
                            <Button 
                                onClick={() => router.get(route('interactions.create'))}
                                className="add-btn mt-4"
                            >
                                Log Your First Interaction
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {interactions.meta.last_page > 1 && (
                    <div className="pagination-container">
                        <div className="pagination-info">
                            Showing {interactions.meta.from} to {interactions.meta.to} of {interactions.meta.total} interactions
                        </div>
                        <div className="pagination-links">
                            {interactions.links.map((link, index: number) => (
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
                .interactions-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px 0;
                }

                .interactions-timeline {
                    position: relative;
                    padding-left: 40px;
                }

                .interactions-timeline::before {
                    content: '';
                    position: absolute;
                    left: 20px;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
                    border-radius: 2px;
                }

                .timeline-item {
                    position: relative;
                    margin-bottom: 30px;
                }

                .timeline-marker {
                    position: absolute;
                    left: -28px;
                    top: 20px;
                    width: 40px;
                    height: 40px;
                    background: white;
                    border: 4px solid #4ecdc4;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    z-index: 2;
                }

                .interaction-icon {
                    font-size: 1.2rem;
                }

                .timeline-content {
                    margin-left: 20px;
                }

                .interaction-card {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 15px;
                    border: 3px solid #4ecdc4;
                    box-shadow: 0 8px 25px rgba(78, 205, 196, 0.2);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .interaction-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(78, 205, 196, 0.3);
                    border-color: #ff6b6b;
                }

                .interaction-header {
                    background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                }

                .friend-name {
                    font-size: 1.3rem;
                    font-weight: bold;
                    margin: 0 0 10px 0;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
                }

                .interaction-meta {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .interaction-type-badge {
                    background: #ff6b6b;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: bold;
                    text-transform: capitalize;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .interaction-date {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 8px;
                    border-radius: 10px;
                }

                .view-friend-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    color: white;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }

                .view-friend-btn:hover {
                    background: white;
                    color: #4ecdc4;
                }

                .interaction-description {
                    padding: 25px;
                    background: rgba(255, 255, 255, 0.9);
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #333;
                }

                .empty-interactions {
                    text-align: center;
                    padding: 60px 20px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    border: 3px dashed #ccc;
                    margin: 40px 0;
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                }

                .empty-interactions h3 {
                    font-size: 2rem;
                    color: #666;
                    margin-bottom: 10px;
                }

                .empty-interactions p {
                    color: #888;
                    font-size: 1.1rem;
                }

                .pagination-container {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    padding: 20px;
                    margin: 40px auto;
                    text-align: center;
                    max-width: 800px;
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
                    margin-top: 40px;
                }

                .back-btn {
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    .interactions-container {
                        padding: 10px;
                    }
                    
                    .interactions-timeline {
                        padding-left: 30px;
                    }
                    
                    .timeline-marker {
                        left: -20px;
                        width: 30px;
                        height: 30px;
                    }
                    
                    .interaction-icon {
                        font-size: 1rem;
                    }
                    
                    .interaction-header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    
                    .interaction-meta {
                        justify-content: center;
                    }
                    
                    .timeline-content {
                        margin-left: 10px;
                    }
                }
            `}</style>
        </AppLayout>
    );
}