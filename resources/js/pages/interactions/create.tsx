import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';

interface Friend {
    id: number;
    name: string;
}

interface Props {
    friends: Friend[];
    friend_id?: number;
    [key: string]: unknown;
}

export default function CreateInteraction({ friends, friend_id }: Props) {
    const [formData, setFormData] = useState({
        friend_id: friend_id ? friend_id.toString() : '',
        type: '',
        description: '',
        interaction_date: new Date().toISOString().split('T')[0], // Today's date
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const interactionTypes = [
        { value: 'call', label: '📞 Phone Call', icon: '📞' },
        { value: 'text', label: '💬 Text Message', icon: '💬' },
        { value: 'email', label: '📧 Email', icon: '📧' },
        { value: 'hangout', label: '🎉 Hangout', icon: '🎉' },
        { value: 'meeting', label: '🤝 Meeting', icon: '🤝' },
        { value: 'other', label: '💭 Other', icon: '💭' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post(route('interactions.store'), formData, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            },
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const selectedFriend = friends.find(f => f.id.toString() === formData.friend_id);

    return (
        <AppLayout>
            <div className="myspace-container">
                <div className="myspace-header">
                    <h1 className="myspace-title">Log New Interaction</h1>
                    <p className="myspace-subtitle">Tell me about your awesome conversation! 💭</p>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit} className="interaction-form">
                        
                        {/* Friend Selection */}
                        <div className="form-section">
                            <h3 className="section-title">👤 Who did you interact with?</h3>
                            
                            {friend_id ? (
                                <div className="selected-friend">
                                    <div className="friend-display">
                                        <div className="friend-avatar">
                                            <div className="avatar-placeholder">
                                                {selectedFriend?.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="friend-name">
                                            {selectedFriend?.name}
                                        </div>
                                    </div>
                                    <input type="hidden" name="friend_id" value={formData.friend_id} />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <Label htmlFor="friend_id" className="form-label">Select Friend *</Label>
                                    <Select 
                                        value={formData.friend_id} 
                                        onValueChange={(value) => handleInputChange('friend_id', value)}
                                    >
                                        <SelectTrigger className="myspace-select">
                                            <SelectValue placeholder="Choose a friend..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {friends.map((friend) => (
                                                <SelectItem key={friend.id} value={friend.id.toString()}>
                                                    {friend.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.friend_id && <span className="error-message">{errors.friend_id}</span>}
                                </div>
                            )}
                        </div>

                        {/* Interaction Details */}
                        <div className="form-section">
                            <h3 className="section-title">💬 Interaction Details</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <Label htmlFor="type" className="form-label">Type of Interaction *</Label>
                                    <Select 
                                        value={formData.type} 
                                        onValueChange={(value) => handleInputChange('type', value)}
                                    >
                                        <SelectTrigger className="myspace-select">
                                            <SelectValue placeholder="How did you interact?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {interactionTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <span className="error-message">{errors.type}</span>}
                                </div>

                                <div className="form-group">
                                    <Label htmlFor="interaction_date" className="form-label">Date of Interaction *</Label>
                                    <Input
                                        id="interaction_date"
                                        type="date"
                                        value={formData.interaction_date}
                                        onChange={(e) => handleInputChange('interaction_date', e.target.value)}
                                        className="myspace-input"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.interaction_date && <span className="error-message">{errors.interaction_date}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <Label htmlFor="description" className="form-label">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                                    className="myspace-textarea"
                                    placeholder="What did you talk about? How was the interaction? Any important details..."
                                    rows={6}
                                />
                                {errors.description && <span className="error-message">{errors.description}</span>}
                                <div className="character-count">
                                    {formData.description.length} characters
                                </div>
                            </div>
                        </div>

                        {/* Quick Templates */}
                        <div className="form-section">
                            <h3 className="section-title">⚡ Quick Templates</h3>
                            <div className="template-buttons">
                                <Button
                                    type="button"
                                    onClick={() => handleInputChange('description', 'Had a great catch-up call. Discussed recent life updates and made plans to meet up soon.')}
                                    className="template-btn"
                                    size="sm"
                                >
                                    Catch-up Call
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleInputChange('description', 'Spent time together and had a wonderful time. Great conversation and good laughs.')}
                                    className="template-btn"
                                    size="sm"
                                >
                                    Hangout
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleInputChange('description', 'Quick check-in via text. Everything is going well on their end.')}
                                    className="template-btn"
                                    size="sm"
                                >
                                    Quick Check-in
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleInputChange('description', 'Celebrated a special occasion together. Had a great time and created wonderful memories.')}
                                    className="template-btn"
                                    size="sm"
                                >
                                    Celebration
                                </Button>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <Button
                                type="button"
                                onClick={() => {
                                    if (selectedFriend) {
                                        router.get(route('friends.show', selectedFriend.id));
                                    } else {
                                        router.get(route('interactions.index'));
                                    }
                                }}
                                className="cancel-btn"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="submit-btn"
                                disabled={processing}
                            >
                                {processing ? 'Logging Interaction...' : '💾 Log Interaction'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .form-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    border: 3px solid #45b7d1;
                    box-shadow: 0 10px 30px rgba(69, 183, 209, 0.2);
                    overflow: hidden;
                }

                .interaction-form {
                    padding: 30px;
                }

                .form-section {
                    margin-bottom: 40px;
                    padding: 25px;
                    border-radius: 15px;
                    border: 2px solid #e0e0e0;
                    background: rgba(255, 255, 255, 0.8);
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20px;
                    text-align: center;
                    padding: 10px 0;
                    border-bottom: 2px solid #45b7d1;
                }

                .selected-friend {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .friend-display {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    background: linear-gradient(45deg, #45b7d1, #96ceb4);
                    border-radius: 15px;
                    color: white;
                    box-shadow: 0 5px 15px rgba(69, 183, 209, 0.3);
                }

                .friend-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 15px;
                    overflow: hidden;
                    border: 3px solid white;
                }

                .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #ff6b6b, #feca57);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1.5rem;
                }

                .friend-name {
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-label {
                    font-weight: bold;
                    color: #333;
                    display: block;
                    margin-bottom: 8px;
                    font-size: 1rem;
                }

                .myspace-input, .myspace-textarea, .myspace-select {
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    padding: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.9);
                    width: 100%;
                }

                .myspace-input:focus, .myspace-textarea:focus, .myspace-select:focus {
                    border-color: #45b7d1;
                    box-shadow: 0 0 10px rgba(69, 183, 209, 0.3);
                    background: white;
                }

                .character-count {
                    text-align: right;
                    font-size: 0.8rem;
                    color: #666;
                    margin-top: 5px;
                }

                .template-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }

                .template-btn {
                    background: linear-gradient(45deg, #96ceb4, #ffeaa7);
                    border: none;
                    color: #333;
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .template-btn:hover {
                    background: linear-gradient(45deg, #81c784, #ffcc02);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .error-message {
                    color: #ff1744;
                    font-size: 0.9rem;
                    margin-top: 5px;
                    display: block;
                    font-weight: bold;
                }

                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 2px solid #e0e0e0;
                }

                .cancel-btn {
                    background: linear-gradient(45deg, #95a5a6, #7f8c8d);
                    border: none;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 1.1rem;
                    flex: 1;
                }

                .submit-btn {
                    background: linear-gradient(45deg, #45b7d1, #96ceb4);
                    border: none;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 1.1rem;
                    flex: 2;
                }

                .submit-btn:hover, .cancel-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                @media (max-width: 768px) {
                    .form-container {
                        margin: 0 10px;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .template-buttons {
                        grid-template-columns: 1fr;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                    }
                    
                    .interaction-form {
                        padding: 20px;
                    }
                    
                    .form-section {
                        padding: 15px;
                    }
                }
            `}</style>
        </AppLayout>
    );
}