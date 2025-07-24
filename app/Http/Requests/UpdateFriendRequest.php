<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFriendRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'birthday' => 'nullable|date',
            'anniversary' => 'nullable|date',
            'partner' => 'nullable|string|max:255',
            'kids' => 'nullable|array',
            'kids.*' => 'string|max:255',
            'job_title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
            'last_contact_date' => 'nullable|date',
            'profile_picture' => 'nullable|image|max:2048',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Friend name is required.',
            'email.email' => 'Please provide a valid email address.',
            'birthday.date' => 'Please provide a valid birthday date.',
            'anniversary.date' => 'Please provide a valid anniversary date.',
            'last_contact_date.date' => 'Please provide a valid last contact date.',
            'profile_picture.image' => 'Profile picture must be an image file.',
            'profile_picture.max' => 'Profile picture must not exceed 2MB.',
        ];
    }
}