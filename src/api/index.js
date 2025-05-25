import axios from 'axios';
import { getToken } from '../utils/auth';
import { getCachedData, setCachedData } from './cacheDB';
import { SECTIONS } from '../../netlify/functions/utils/constants';

const baseURL = import.meta.env.VITE_NETLIFY_API_URL || 'http://localhost:8888/.netlify'

const api = axios.create({
  baseURL: `${baseURL}/functions`,
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
    
    let url;

    if (section) {
      url = `/setData/?section=${section}`;
    } else {
      return new Error("Section needs to be used");
    }

    const response = await api.post(url, data, config);

    setCachedData(section, data);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getData = async (section = 'all') => {
  try {
    const cache = await getCachedData(section);

    if (cache) {
      return cache;
    }

    let url = section !== 'all' ? `/getData/?section=${section}` : '/getData';

    const response = await api.get(url);

    const data = response.data;
    
    await setCachedData(section, data);
    
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};