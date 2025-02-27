import { createContext, useState, useContext } from 'react';
import { createActor } from '../utils/actorUtils';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
    const [error, setError] = useState(null);
    const [actor, setActor] = useState(null);

    const initActor = async () => {
        try {
            const newActor = await createActor();
            setActor(newActor);
            return newActor;
        } catch (err) {
            console.error('Actor initialization failed:', err);
            setError('Failed to initialize the application');
            return null;
        }
    };

    const login = async (result) => {
        try {
            if ('Ok' in result) {
                const { token, user_id, role } = result.Ok;
                
                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', user_id);
                localStorage.setItem('userRole', JSON.stringify(role));

                // Update state
                setToken(token);
                setUserId(user_id);
                setUserRole(role);
                setError(null);

                return true;
            } else {
                throw new Error(result.Err || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        
        setToken('');
        setUserId('');
        setUserRole(null);
        setError(null);
        setActor(null);
    };

    const getActor = async () => {
        if (!actor) {
            return await initActor();
        }
        return actor;
    };

    return (
        <AuthContext.Provider value={{
            token,
            userId,
            userRole,
            error,
            login,
            logout,
            getActor,
            isAuthenticated: !!token,
            setError
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};