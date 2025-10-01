import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const WorldContext = createContext();

export const useWorld = () => {
  const context = useContext(WorldContext);
  if (!context) {
    throw new Error('useWorld must be used within WorldProvider');
  }
  return context;
};

export const WorldProvider = ({ children }) => {
  const location = useLocation();
  const [currentWorld, setCurrentWorld] = useState(() => {
    // First check if world was set by HTML shell
    if (window.__INITIAL_WORLD__) {
      return window.__INITIAL_WORLD__;
    }
    // Otherwise derive from URL path
    if (location.pathname.startsWith('/web')) return 'web';
    if (location.pathname.startsWith('/handyman')) return 'handyman';
    // Fallback to localStorage or default
    return localStorage.getItem('qh_world') || 'handyman';
  });

  useEffect(() => {
    // Update world when URL changes
    if (location.pathname.startsWith('/web')) {
      setCurrentWorld('web');
      localStorage.setItem('qh_world', 'web');
    } else if (location.pathname.startsWith('/handyman')) {
      setCurrentWorld('handyman');
      localStorage.setItem('qh_world', 'handyman');
    }
    // Note: data-world is already set by HTML shell, no need to update
  }, [location.pathname]);

  const value = {
    currentWorld,
    isHandyman: currentWorld === 'handyman',
    isWeb: currentWorld === 'web',
  };

  return (
    <WorldContext.Provider value={value}>
      {children}
    </WorldContext.Provider>
  );
};