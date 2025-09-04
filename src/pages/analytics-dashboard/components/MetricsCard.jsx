import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, neonColor = 'primary', isAnimated = true }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (isAnimated && value) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, isAnimated]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 surface-elevation transition-neon hover:neon-glow-${neonColor} ${glitchActive ? 'glitch-effect' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${neonColor}/10 neon-glow-${neonColor}`}>
          <Icon name={icon} size={24} className={`text-${neonColor}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`text-3xl font-bold text-${neonColor} font-mono`}>
          {typeof displayValue === 'number' ? displayValue?.toLocaleString() : displayValue}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;