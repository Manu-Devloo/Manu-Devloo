import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check if user has previously set theme preference in cookies
  useEffect(() => {
    const savedTheme = Cookies.get('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      
      // Save theme preference to cookie (expires in 365 days)
      Cookies.set('theme', newMode ? 'dark' : 'light', { expires: 365 });
      
      // Add/remove dark-theme class from body
      if (newMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
