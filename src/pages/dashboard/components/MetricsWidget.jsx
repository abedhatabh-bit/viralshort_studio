import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MetricsWidget = ({ title, value, change, icon, color = 'primary', trend = 'up' }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setAnimatedValue(value);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 300);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const formatValue = (val) => {
    if (val >= 1000000) return `${(val / 1000000)?.toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000)?.toFixed(1)}K`;
    return val?.toLocaleString();
  };

  return (
    <div className={`
      bg-card border border-border rounded-lg p-6 transition-all duration-300
      ${pulseActive ? 'shadow-lg scale-105' : ''}
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center
          ${color === 'primary' ? 'bg-primary/20 text-primary' :
            color === 'secondary' ? 'bg-secondary/20 text-secondary' :
            color === 'accent' ? 'bg-accent/20 text-accent' :
            color === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
            'bg-primary/20 text-primary'}
        `}>
          <Icon name={icon} size={24} />
        </div>
        
        <div className={`
          flex items-center space-x-1 text-sm font-mono
          ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}
        `}>
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
            size={16} 
          />
          <span>{change}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-body text-muted-foreground">{title}</h3>
        <div className={`text-3xl font-mono font-bold transition-colors ${
          color === 'primary' ? 'text-primary' :
          color === 'secondary' ? 'text-secondary' :
          color === 'accent' ? 'text-accent' :
          color === 'warning' ? 'text-yellow-500' :
          'text-primary'
        }`}>
          {formatValue(animatedValue)}
        </div>
      </div>
    </div>
  );
};

export default MetricsWidget;