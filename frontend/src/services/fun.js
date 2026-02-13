import api from './api';

// All paths now start with /services
export const fetchStudents = () => api.get('/services');
export const addStudent = (data) => api.post('/services', data);
