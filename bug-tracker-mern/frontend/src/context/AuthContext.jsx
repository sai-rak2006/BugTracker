import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { token: newToken, data } = res.data;
        // Support both response shapes
        const userData = data || res.data;
        const tok = newToken || userData.token;

        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
        setToken(tok);
        setUser(userData);
    };

    const register = async (name, email, password, role) => {
        await authAPI.register({ name, email, password, role });
    };

    const updateProfile = async (id, updateData) => {
        const res = await userAPI.update(id, updateData);
        const updatedUser = res.data.data;
        const merged = { ...user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(merged));
        setUser(merged);
        return updatedUser;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
