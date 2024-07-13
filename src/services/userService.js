import axios from 'axios';

const userService = axios.create({
  baseURL: 'http://localhost:3000/api/users',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

userService.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const getRecentRooms = async () => {
  const response = await userService.get('/recent-rooms');
  return response.data;
};
