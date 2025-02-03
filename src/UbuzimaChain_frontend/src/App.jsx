import React, { useState } from 'react';
import './index.scss';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    const [token, setToken] = useState('');

    return (
        <div className="App">
            <h1>UbuzimaChain - Hospital Management</h1>
            {!token ? (
                <>
                    <Register />
                    <Login setToken={setToken} />
                </>
            ) : (
                <div>Welcome, you are logged in!</div>
            )}
        </div>
    );
}

export default App;