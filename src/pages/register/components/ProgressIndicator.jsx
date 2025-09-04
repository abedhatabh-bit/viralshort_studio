import React, { useState, useEffect } from 'react';

const ProgressIndicator = ({ currentStep, totalSteps, completedFields }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [urgencyPulse, setUrgencyPulse] = useState(false);
  
  const progressPercentage = (completedFields / 5) * 100; // 5 total fields
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setUrgencyPulse(true);
      setTimeout(() => setUrgencyPulse(false), 300);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="w-full space-y-3">
      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-700 ease-out neon-glow-primary ${
            urgencyPulse ? 'animate-pulse' : ''
          }`}
          style={{ width: `${animatedProgress}%` }}
        />
        
        {/* Animated shimmer effect */}
        <div 
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
          style={{ 
            transform: `translateX(${animatedProgress * 4}px)`,
            transition: 'transform 0.7s ease-out'
          }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          Profile Completion
        </span>
        <span className={`font-bold transition-colors ${
          animatedProgress === 100 
            ? 'text-primary neon-glow-primary' :'text-accent'
        }`}>
          {Math.round(animatedProgress)}%
        </span>
      </div>
      
      {/* Urgency Message */}
      {animatedProgress < 100 && (
        <div className={`text-center transition-all duration-300 ${
          urgencyPulse ? 'scale-105 text-secondary' : 'text-muted-foreground'
        }`}>
          <p className="text-xs">
            Complete your profile to unlock viral templates
          </p>
        </div>
      )}
      
      {/* Success Message */}
      {animatedProgress === 100 && (
        <div className="text-center text-primary animate-pulse">
          <p className="text-sm font-medium">
            🎉 Ready to create viral content!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;