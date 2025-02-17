import React, { useState } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js';

const Login = ({ onLogin, onError }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setMessage({ type: '', content: '' }); // Clear error on input change
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
                throw new Error('Network configuration error');
            }
        }

        return Actor.createActor(idlFactory, {
            agent,
            canisterId,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setMessage({ type: 'error', content: 'Please enter both username and password' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
            const actor = await createActor();
            const result = await actor.login({
                username: formData.username,
                password: formData.password
            });

            // Handle the Result type properly
            if ('Ok' in result) {
                onLogin(result); // Pass the result to the parent component
                setFormData({ username: '', password: '' });
                setMessage({ type: 'success', content: 'Login successful!' });
            } else if ('Err' in result) {
                // Handle specific error types from your Rust backend
                let errorMessage;
                switch (result.Err) {
                    case 'UserNotFound':
                        errorMessage = 'User not found';
                        break;
                    case 'InvalidCredentials':
                        errorMessage = 'Invalid username or password';
                        break;
                    case 'EmptyFields':
                        errorMessage = 'All fields are required';
                        break;
                    case 'SystemError':
                        errorMessage = 'A system error occurred. Please try again later';
                        break;
                    default:
                        errorMessage = result.Err.toString();
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle different types of errors
            let errorMessage;
            if (error.message.includes('Network configuration error')) {
                errorMessage = 'Unable to connect to the service. Please check your connection.';
            } else if (error.message === '[object Object]') {
                // Handle case where error is an object
                errorMessage = 'Check your credentials.';
            } else {
                errorMessage = error.message;
            }
            
            setMessage({ 
                type: 'error', 
                content: errorMessage
            });
            if (onError) onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
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
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;