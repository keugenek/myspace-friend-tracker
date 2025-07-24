import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';

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
}

interface Props {
    friend: Friend;
    [key: string]: unknown;
}

export default function EditFriend({ friend }: Props) {
    const [formData, setFormData] = useState({
        name: friend.name || '',
        email: friend.email || '',
        phone: friend.phone || '',
        birthday: friend.birthday || '',
        anniversary: friend.anniversary || '',
        partner: friend.partner || '',
        kids: friend.kids || [''],
        job_title: friend.job_title || '',
        company: friend.company || '',
        address: friend.address || '',
        notes: friend.notes || '',
        last_contact_date: friend.last_contact_date || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Filter out empty kids
        const cleanedKids = formData.kids.filter(kid => kid.trim() !== '');

        const submitData = {
            ...formData,
            kids: cleanedKids.length > 0 ? cleanedKids : undefined,
        };

        router.put(route('friends.update', friend.id), submitData, {
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

    const handleKidsChange = (index: number, value: string) => {
        const newKids = [...formData.kids];
        newKids[index] = value;
        setFormData(prev => ({ ...prev, kids: newKids }));
    };

    const addKidField = () => {
        setFormData(prev => ({ ...prev, kids: [...prev.kids, ''] }));
    };

    const removeKidField = (index: number) => {
        const newKids = formData.kids.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, kids: newKids }));
    };

    return (
        <AppLayout>
            <div className="myspace-container">
                <div className="myspace-header">
                    <h1 className="myspace-title">Edit {friend.name}</h1>
                    <p className="myspace-subtitle">Update your friend's information! ✏️</p>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit} className="friend-form">
                        {/* Basic Info Section */}
                        <div className="form-section">
                            <h3 className="section-title">👤 Basic Information</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <Label htmlFor="name" className="form-label">Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="myspace-input"
                                        placeholder="What's their name?"
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <Label htmlFor="email" className="form-label">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="myspace-input"
                                        placeholder="friend@example.com"
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <Label htmlFor="phone" className="form-label">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="myspace-input"
                                        placeholder="(555) 123-4567"
                                    />
                                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                                </div>

                                <div className="form-group">
                                    <Label htmlFor="last_contact_date" className="form-label">Last Contact Date</Label>
                                    <Input
                                        id="last_contact_date"
                                        type="date"
                                        value={formData.last_contact_date}
                                        onChange={(e) => handleInputChange('last_contact_date', e.target.value)}
                                        className="myspace-input"
                                    />
                                    {errors.last_contact_date && <span className="error-message">{errors.last_contact_date}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Personal Info Section */}
                        <div className="form-section">
                            <h3 className="section-title">🎂 Personal Information</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <Label htmlFor="birthday" className="form-label">Birthday</Label>
                                    <Input
                                        id="birthday"
                                        type="date"
                                        value={formData.birthday}
                                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                                        className="myspace-input"
                                    />
                                    {errors.birthday && <span className="error-message">{errors.birthday}</span>}
                                </div>

                                <div className="form-group">
                                    <Label htmlFor="anniversary" className="form-label">Anniversary</Label>
                                    <Input
                                        id="anniversary"
                                        type="date"
                                        value={formData.anniversary}
                                        onChange={(e) => handleInputChange('anniversary', e.target.value)}
                                        className="myspace-input"
                                    />
                                    {errors.anniversary && <span className="error-message">{errors.anniversary}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <Label htmlFor="partner" className="form-label">Partner/Spouse</Label>
                                <Input
                                    id="partner"
                                    type="text"
                                    value={formData.partner}
                                    onChange={(e) => handleInputChange('partner', e.target.value)}
                                    className="myspace-input"
                                    placeholder="Their partner's name"
                                />
                                {errors.partner && <span className="error-message">{errors.partner}</span>}
                            </div>

                            <div className="form-group">
                                <Label className="form-label">Kids</Label>
                                {formData.kids.map((kid, index) => (
                                    <div key={index} className="kids-input-group">
                                        <Input
                                            type="text"
                                            value={kid}
                                            onChange={(e) => handleKidsChange(index, e.target.value)}
                                            className="myspace-input kids-input"
                                            placeholder={`Kid ${index + 1} name`}
                                        />
                                        {formData.kids.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => removeKidField(index)}
                                                className="remove-kid-btn"
                                                size="sm"
                                            >
                                                ❌
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={addKidField}
                                    className="add-kid-btn"
                                    size="sm"
                                >
                                    ➕ Add Kid
                                </Button>
                                {errors.kids && <span className="error-message">{errors.kids}</span>}
                            </div>
                        </div>

                        {/* Work Info Section */}
                        <div className="form-section">
                            <h3 className="section-title">💼 Work Information</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <Label htmlFor="job_title" className="form-label">Job Title</Label>
                                    <Input
                                        id="job_title"
                                        type="text"
                                        value={formData.job_title}
                                        onChange={(e) => handleInputChange('job_title', e.target.value)}
                                        className="myspace-input"
                                        placeholder="Software Engineer, Teacher, etc."
                                    />
                                    {errors.job_title && <span className="error-message">{errors.job_title}</span>}
                                </div>

                                <div className="form-group">
                                    <Label htmlFor="company" className="form-label">Company</Label>
                                    <Input
                                        id="company"
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        className="myspace-input"
                                        placeholder="Where do they work?"
                                    />
                                    {errors.company && <span className="error-message">{errors.company}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className="form-section">
                            <h3 className="section-title">📍 Additional Information</h3>
                            
                            <div className="form-group">
                                <Label htmlFor="address" className="form-label">Address</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('address', e.target.value)}
                                    className="myspace-textarea"
                                    placeholder="Their address (optional)"
                                    rows={3}
                                />
                                {errors.address && <span className="error-message">{errors.address}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="notes" className="form-label">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
                                    className="myspace-textarea"
                                    placeholder="Any additional notes about your friend..."
                                    rows={4}
                                />
                                {errors.notes && <span className="error-message">{errors.notes}</span>}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <Button
                                type="button"
                                onClick={() => router.get(route('friends.show', friend.id))}
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
                                {processing ? 'Updating Friend...' : '💾 Update Friend'}
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
                    border: 3px solid #f9ca24;
                    box-shadow: 0 10px 30px rgba(249, 202, 36, 0.2);
                    overflow: hidden;
                }

                .friend-form {
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
                    border-bottom: 2px solid #f9ca24;
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

                .myspace-input, .myspace-textarea {
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    padding: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.9);
                }

                .myspace-input:focus, .myspace-textarea:focus {
                    border-color: #f9ca24;
                    box-shadow: 0 0 10px rgba(249, 202, 36, 0.3);
                    background: white;
                }

                .kids-input-group {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                    align-items: center;
                }

                .kids-input {
                    flex: 1;
                }

                .remove-kid-btn {
                    background: #ff6b6b;
                    border: none;
                    color: white;
                    border-radius: 50%;
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .add-kid-btn {
                    background: linear-gradient(45deg, #4ecdc4, #44a08d);
                    border: none;
                    color: white;
                    border-radius: 10px;
                    padding: 8px 15px;
                    font-size: 0.9rem;
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
                    background: linear-gradient(45deg, #f9ca24, #f0932b);
                    border: none;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 1.1rem;
                    flex: 2;
                }

                .submit-btn:hover, .cancel-btn:hover, .add-kid-btn:hover {
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
                    
                    .form-actions {
                        flex-direction: column;
                    }
                    
                    .friend-form {
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