import React, { useState } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setMessage('');

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

            const result = await actor.register_user({
                username: username,
                password: password
            });

            if (result.Ok) {
                setMessage('Registration successful');
                setUsername('');
                setPassword('');
            } else {
                setMessage(`Registration failed: ${result.Err}`);
            }
        } catch (error) {
            console.error('Full registration error:', error);
            setMessage(`Registration error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
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
            <button onClick={handleRegister} disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;