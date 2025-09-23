import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const TypewriterDisplay = ({ text, speed = 20, onComplete, title = "AI Analysis" }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayText('');
    setIndex(0);
    setIsComplete(false);
  }, [text]);

  // Typing effect
  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, index + 1));
        setIndex(prevIndex => prevIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (index === text.length && text.length > 0) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [index, text, speed, onComplete]);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <div className="bg-white rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          <div className="whitespace-pre-wrap text-gray-800 font-mono text-sm leading-relaxed">
            {displayText}
            {!isComplete && text && (
              <span className="inline-block w-2 h-4 bg-purple-600 animate-pulse ml-1" />
            )}
          </div>
        </div>

        {isComplete && (
          <div className="mt-3 text-center">
            <span className="text-sm text-green-600 font-medium">
              ✨ Analysis Complete
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Simpler version for inline use
export const InlineTypewriter = ({ text, speed = 30, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, index + 1));
        setIndex(prevIndex => prevIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {index < text.length && (
        <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5" />
      )}
    </span>
  );
};

export default TypewriterDisplay;
