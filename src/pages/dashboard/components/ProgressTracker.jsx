import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTracker = () => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [urgencyPulse, setUrgencyPulse] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const dailyGoal = 5;
  const completed = 3;
  const progressPercentage = (completed / dailyGoal) * 100;

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => {
      setCurrentProgress(progressPercentage);
    }, 500);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  useEffect(() => {
    // Urgency simulation pulse
    const urgencyInterval = setInterval(() => {
      setUrgencyPulse(true);
      setTimeout(() => setUrgencyPulse(false), 300);
    }, 2000);

    return () => clearInterval(urgencyInterval);
  }, []);

  useEffect(() => {
    // Confetti burst for achievements
    if (completed >= dailyGoal) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 1000);
    }
  }, [completed, dailyGoal]);

  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight?.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">
          Daily Progress
        </h2>
        <div className={`
          flex items-center space-x-2 text-warning
          ${urgencyPulse ? 'neon-glow-warning scale-105' : ''}
          transition-all duration-300
        `}>
          <Icon name="Clock" size={20} />
          <span className="text-sm font-mono">{getTimeUntilMidnight()}</span>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-primary">
            {completed}
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-secondary">
            {dailyGoal - completed}
          </div>
          <div className="text-xs text-muted-foreground">Remaining</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-accent">
            {dailyGoal}
          </div>
          <div className="text-xs text-muted-foreground">Goal</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-body text-muted-foreground">
            Daily Creation Goal
          </span>
          <span className="text-sm font-mono text-primary">
            {Math.round(currentProgress)}%
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className={`
              h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out
              ${completed >= dailyGoal ? 'neon-glow-primary' : ''}
            `}
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      {/* Achievement Status */}
      <div className={`
        p-4 rounded-lg border transition-neon
        ${completed >= dailyGoal 
          ? 'border-success bg-success bg-opacity-20 text-success' :'border-warning bg-warning bg-opacity-20 text-warning'
        }
        ${confettiActive ? 'neon-glow-success' : ''}
      `}>
        <div className="flex items-center space-x-3">
          <Icon 
            name={completed >= dailyGoal ? 'CheckCircle' : 'Target'} 
            size={24} 
          />
          <div>
            <div className="font-body font-semibold">
              {completed >= dailyGoal 
                ? 'Daily Goal Achieved! 🎉' :'Keep Going! You\'re Almost There!'
              }
            </div>
            <div className="text-sm opacity-80">
              {completed >= dailyGoal 
                ? 'Congratulations on reaching your daily creation goal!' 
                : `Create ${dailyGoal - completed} more videos to reach your goal`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Hooks */}
      <div className="mt-4 p-3 bg-muted bg-opacity-50 rounded-lg">
        <p className="text-sm text-center text-muted-foreground italic">
          "Every viral video starts with a single creation..."
        </p>
      </div>
    </div>
  );
};

export default ProgressTracker;