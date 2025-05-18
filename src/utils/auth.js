import { jwtDecode } from 'jwt-decode';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds
  const isExpired = decodedToken.exp < currentTime;

  if (isExpired) {
    removeToken();
  }

  return !isExpired;
};

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
}

const removeToken = () => {
  localStorage.removeItem('token');
};

export { isAuthenticated, setToken, getToken, removeToken };
