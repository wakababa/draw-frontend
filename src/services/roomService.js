import axios from 'axios';

const roomService = axios.create({
  baseURL: 'http://localhost:3000/api/rooms',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

roomService.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const getRecentRooms = async () => {
  const response = await roomService.get('/recent');
  return response.data;
};

export const getMyRooms = async () => {
  const response = await roomService.get('/myrooms');
  return response.data;
};
