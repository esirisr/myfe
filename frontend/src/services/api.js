import axios from 'axios';

const api = axios.create({ 
  // ADD /api to the end of your URL
  baseURL: "https://mybe.up.railway.app/api", 
  withCredentials: true // This must be true to match your backend CORS 'credentials: true'
});

export default api;
