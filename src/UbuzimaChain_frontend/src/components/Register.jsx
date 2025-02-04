import React, { useState } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', content: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.username || !formData.password || !formData.confirmPassword) {
            setMessage({ type: 'error', content: 'All fields are required' });
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', content: 'Passwords do not match' });
            return false;
        }

        if (formData.password.length < 8) {
            setMessage({ type: 'error', content: 'Password must be at least 8 characters long' });
            return false;
        }

        return true;
    };

    const createActor = async () => {
        const canisterId = process.env.CANISTER_ID_UBUZIMACHAIN_BACKEND || 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
        const host = process.env.DFX_NETWORK === 'ic' 
            ? 'https://boundary.ic0.app' 
            : 'http://localhost:4943';

        const agent = new HttpAgent({ host });

        if (process.env.DFX_NETWORK !== 'ic') {
            try {
                await agent.fetchRootKey();
            } catch (err) {
                console.error('Failed to fetch root key:', err);
                throw new Error('Network configuration error');
            }
        }

        return Actor.createActor(idlFactory, {
            agent,
            canisterId,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
            const actor = await createActor();

            const result = await actor.register_user({
                username: formData.username,
                password: formData.password
            });

            if ('Ok' in result) {
                setMessage({ 
                    type: 'success', 
                    content: 'Registration successful! You can now log in.' 
                });
                setFormData({ username: '', password: '', confirmPassword: '' });
            } else {
                const errorMessage = result.Err;
                setMessage({ 
                    type: 'error', 
                    content: `Registration failed: ${errorMessage}` 
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage({ 
                type: 'error', 
                content: `Registration failed: ${error.message || 'Unknown error occurred'}` 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {message.content && (
                        <div className={`rounded-md p-4 ${
                            message.type === 'error' 
                                ? 'bg-red-50 text-red-700' 
                                : 'bg-green-50 text-green-700'
                        }`}>
                            {message.content}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading 
                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;