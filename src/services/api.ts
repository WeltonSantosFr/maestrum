import axios from 'axios';

const api = axios.create({
  baseURL: 'https://guitaa-api.onrender.com',
});

export default api;