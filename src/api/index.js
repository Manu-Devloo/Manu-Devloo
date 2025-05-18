import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_NETLIFY_API_URL || 'http://localhost:8888/.netlify/functions',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const setData = async (data, section = null) => {
  try {
    const token = getToken();
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    var response;
    if (section) {
      response = await api.post(`/setData/?section=${section}`, data, config);
    } else {
      response = await api.post('/setData', data, config);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getData = async (section = null) => {
  try {
    var response;
    if (section) {
      response = await api.get(`/getData/?section=${section}`);
    } else {
      response = await api.get('/getData');
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
