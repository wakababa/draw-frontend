import axios from 'axios';

const apiService = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiService.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const createRoom = async () => {
  const response = await apiService.post('/draw/create-room');
  return response.data;
};

export const login = async (username, password) => {
  const response = await apiService.post('/auth/login', { username, password });
  return response.data;
};
