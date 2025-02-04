import React, { useState } from 'react';
import './index.scss';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');

    const handleLogout = () => {
        setToken('');
        setUserId('');
    };

    return (
        <div className="App">
            <h1>UbuzimaChain - Hospital Management</h1>
            {!token ? (
                <div className="auth-container">
                    <Register />
                    <Login 
                        setToken={setToken} 
                        setUserId={setUserId} 
                    />
                </div>
            ) : (
                <div className="logged-in-container">
                    <p>Welcome, User {userId}!</p>
                    <button onClick={handleLogout}>Logout</button>
                    {/* Add your logged-in dashboard/components here */}
                </div>
            )}
        </div>
    );
}

export default App;