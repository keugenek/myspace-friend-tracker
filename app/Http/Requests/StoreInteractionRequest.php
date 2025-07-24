<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInteractionRequest extends FormRequest
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
            'friend_id' => 'required|exists:friends,id',
            'type' => 'required|string|in:call,text,email,hangout,meeting,other',
            'description' => 'required|string',
            'interaction_date' => 'required|date',
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
            'friend_id.required' => 'Please select a friend.',
            'friend_id.exists' => 'The selected friend does not exist.',
            'type.required' => 'Please select an interaction type.',
            'type.in' => 'Please select a valid interaction type.',
            'description.required' => 'Please provide a description of the interaction.',
            'interaction_date.required' => 'Please provide the interaction date.',
            'interaction_date.date' => 'Please provide a valid interaction date.',
        ];
    }
}