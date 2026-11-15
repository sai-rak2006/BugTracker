import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired, please log in again.');
        } else {
            const message = error.response?.data?.message || 'An unexpected error occurred';
            toast.error(message);
        }
        return Promise.reject(error);
    }
);

// ── WORK PACKAGES ──────────────────────────────────
export const workPackageAPI = {
    getAll: (params) => api.get('/work-packages', { params }),
    getById: (id) => api.get(`/work-packages/${id}`),
    // We delegate comments to commentAPI, but keeping workPackage aliases for backward compatibility if needed, though better to remove them if we refactor completely
    getComments: (id) => api.get(`/comments/${id}`),
    addComment: (id, data) => api.post(`/comments`, { bugId: id, text: data.text }),
    deleteComment: (id, commentId) => api.delete(`/comments/${commentId}`),
    getTimeLogs: (id) => api.get(`/work-packages/${id}/timelogs`),
    logTime: (id, data) => api.post(`/timelog`, { bugId: id, ...data }),
    create: (data) => api.post('/work-packages', data),
    update: (id, data) => api.put(`/work-packages/${id}`, data),
    delete: (id) => api.delete(`/work-packages/${id}`),
    deleteBug: (id) => api.delete(`/bugs/${id}`),
    getAnalytics: () => api.get('/work-packages/analytics'),
};

// ── ACTIVITY ──────────────────────────────────────
export const activityAPI = {
    getAll: (params) => api.get('/activity', { params }),
};

// ── COMMENTS ──────────────────────────────────────
export const commentAPI = {
    getByWorkPackage: (wpId) => api.get(`/comments/${wpId}`),
    add: (wpId, text) => api.post(`/comments`, { bugId: wpId, text }),
    delete: (wpId, commentId) => api.delete(`/comments/${commentId}`),
};

// ── TIME LOGS ─────────────────────────────────────
export const timeLogAPI = {
    getByWorkPackage: (wpId) => api.get(`/work-packages/${wpId}/timelogs`),
    log: (wpId, data) => api.post(`/work-packages/${wpId}/timelogs`, data),
    getSummary: (wpId) => api.get(`/work-packages/${wpId}/timelogs/summary`),
    getAll: () => api.get('/time-logs'),
    getGlobalSummary: () => api.get('/time-logs/summary'),
};

// ── USERS ─────────────────────────────────────────
export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// ── AUTH ──────────────────────────────────────────
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
};

// ── PROJECTS ──────────────────────────────────────
export const projectAPI = {
    get: () => api.get('/projects'),
    update: (id, data) => api.put(`/projects/${id}`, data),
    getMembers: () => api.get('/projects/members'),
    addMember: (id, data) => api.post(`/projects/${id}/members`, data),
    removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
};

// ── SUPPORT ───────────────────────────────────────
export const supportAPI = {
    submit: (data) => api.post('/support', data),
    getAll: () => api.get('/support'),
};

export default api;
