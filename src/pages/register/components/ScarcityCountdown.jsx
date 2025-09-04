import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ScarcityCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 47,
    seconds: 32
  });
  const [pulseActive, setPulseActive] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(847);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 500);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  useEffect(() => {
    const spotsInterval = setInterval(() => {
      setSpotsLeft(prev => Math.max(prev - Math.floor(Math.random() * 3), 500));
    }, 15000);

    return () => clearInterval(spotsInterval);
  }, []);

  const formatTime = (time) => String(time)?.padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-destructive/10 via-warning/10 to-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-4">
      {/* Urgency Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Icon 
            name="AlertTriangle" 
            size={20} 
            className={`text-warning ${pulseActive ? 'animate-pulse scale-110' : ''} transition-all duration-300`} 
          />
          <h3 className="text-lg font-bold text-warning">
            Limited Time Beta Access
          </h3>
          <Icon 
            name="AlertTriangle" 
            size={20} 
            className={`text-warning ${pulseActive ? 'animate-pulse scale-110' : ''} transition-all duration-300`} 
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Exclusive early access ends soon
        </p>
      </div>
      {/* Countdown Timer */}
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <div className={`bg-card border border-border rounded-lg p-3 min-w-[60px] ${
            pulseActive ? 'neon-glow-intense scale-105' : 'neon-glow-primary'
          } transition-all duration-300`}>
            <div className="text-2xl font-bold text-primary font-mono">
              {formatTime(timeLeft?.hours)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Hours</div>
        </div>
        
        <div className="flex items-center text-primary text-2xl font-bold animate-pulse">:</div>
        
        <div className="text-center">
          <div className={`bg-card border border-border rounded-lg p-3 min-w-[60px] ${
            pulseActive ? 'neon-glow-intense scale-105' : 'neon-glow-primary'
          } transition-all duration-300`}>
            <div className="text-2xl font-bold text-primary font-mono">
              {formatTime(timeLeft?.minutes)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Minutes</div>
        </div>
        
        <div className="flex items-center text-primary text-2xl font-bold animate-pulse">:</div>
        
        <div className="text-center">
          <div className={`bg-card border border-border rounded-lg p-3 min-w-[60px] ${
            pulseActive ? 'neon-glow-intense scale-105' : 'neon-glow-primary'
          } transition-all duration-300`}>
            <div className="text-2xl font-bold text-primary font-mono">
              {formatTime(timeLeft?.seconds)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Seconds</div>
        </div>
      </div>
      {/* Spots Remaining */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Users" size={16} className="text-accent" />
          <span className="text-sm text-foreground">
            Only <span className="text-destructive font-bold">{spotsLeft}</span> spots remaining
          </span>
        </div>
        
        {/* Visual spots indicator */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-destructive to-warning transition-all duration-1000"
            style={{ width: `${(spotsLeft / 1000) * 100}%` }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground">
          Join thousands of creators already making viral content
        </p>
      </div>
      {/* Urgency Message */}
      <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
        <p className="text-sm text-destructive font-medium">
          🔥 Don't miss out on exclusive viral templates and AI tools
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Price increases after beta period ends
        </p>
      </div>
    </div>
  );
};

export default ScarcityCountdown;