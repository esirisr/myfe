import api from './api';

// These paths are relative to the baseURL in api.js
export const fetchStudents = () => api.get('/api/services');
export const addStudent = (data) => api.post('/api/services', data);
