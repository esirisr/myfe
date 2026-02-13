import axios from 'axios';
const api = axios.create({ 
  baseURL: "https://mybe.up.railway.app" 
});
export default api
