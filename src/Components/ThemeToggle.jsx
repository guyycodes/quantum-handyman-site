import { useState, useEffect } from 'react';
import { Wrench, Code } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const [currentWorld, setCurrentWorld] = useState(() => {
    return localStorage.getItem('qh_world') || 'technician';
  });

  useEffect(() => {
    // Apply theme on mount and changes
    document.documentElement.setAttribute('data-world', currentWorld);
    localStorage.setItem('qh_world', currentWorld);
  }, [currentWorld]);

  const toggleWorld = () => {
    const newWorld = currentWorld === 'technician' ? 'web' : 'technician';
    setCurrentWorld(newWorld);
    
    // Optional: Add a subtle animation
    document.documentElement.style.opacity = '0.95';
    setTimeout(() => {
      document.documentElement.style.opacity = '1';
    }, 150);
  };

  return (
    <button
      onClick={toggleWorld}
      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-300 hover:scale-105 ${className}`}
      aria-label={`Switch to ${currentWorld === 'technician' ? 'Web Dev' : 'Technician'} theme`}
    >
      {/* Toggle Track */}
      <div className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full">
        {/* Toggle Thumb */}
        <div 
          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center
            ${currentWorld === 'technician' ? 'left-0.5' : 'left-7'}`}
        >
          {currentWorld === 'technician' ? (
            <Wrench className="w-3 h-3 text-blue-500" />
          ) : (
            <Code className="w-3 h-3 text-purple-500" />
          )}
        </div>
      </div>
      
      {/* Label */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {currentWorld === 'technician' ? 'Technician' : 'Web Dev'}
      </span>
    </button>
  );
};

export default ThemeToggle;

/* 
Usage: Add this component to your Header or anywhere in your app:
import ThemeToggle from './components/ThemeToggle';

// In your component:
<ThemeToggle className="ml-4" />
*/
