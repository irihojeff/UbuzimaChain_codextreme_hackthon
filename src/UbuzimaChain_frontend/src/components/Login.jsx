import React, { useState } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js';

const Login = ({ setToken, setUserId }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const canisterId = process.env.CANISTER_ID_UBUZIMACHAIN_BACKEND || 'bkyz2-fmaaa-aaaaa-qaaaq-cai';

            const agent = new HttpAgent({
                host: process.env.DFX_NETWORK === 'ic' 
                    ? 'https://boundary.ic0.app' 
                    : 'http://localhost:4943'
            });

            // For local development, disable certificate verification
            if (process.env.DFX_NETWORK !== 'ic') {
                await agent.fetchRootKey();
            }

            const actor = Actor.createActor(idlFactory, {
                agent,
                canisterId,
            });

            const result = await actor.login({
                username: username,
                password: password
            });

            console.log('Login result:', result);

            if (result.Ok) {
                // Successfully logged in
                setToken(result.Ok.token);
                setUserId(result.Ok.user_id);
                
                // Clear input fields
                setUsername('');
                setPassword('');
            } else {
                // Login failed
                setError(result.Err || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
            />
            <button 
                onClick={handleLogin} 
                disabled={loading || !username || !password}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default Login;