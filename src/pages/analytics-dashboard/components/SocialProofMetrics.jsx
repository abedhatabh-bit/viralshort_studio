import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SocialProofMetrics = ({ metrics }) => {
  const [counters, setCounters] = useState({});
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Initialize counters
    const initialCounters = {};
    metrics?.forEach(metric => {
      initialCounters[metric.id] = 0;
    });
    setCounters(initialCounters);

    // Animate counters
    metrics?.forEach(metric => {
      const duration = 2500;
      const steps = 100;
      const increment = metric?.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= metric?.value) {
          setCounters(prev => ({ ...prev, [metric?.id]: metric?.value }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [metric?.id]: Math.floor(current) }));
        }
      }, duration / steps);
    });
  }, [metrics]);

  useEffect(() => {
    const createSparkle = () => {
      const sparkle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: 2000 + Math.random() * 1000
      };
      
      setSparkles(prev => [...prev, sparkle]);
      
      setTimeout(() => {
        setSparkles(prev => prev?.filter(s => s?.id !== sparkle?.id));
      }, sparkle?.duration);
    };

    const sparkleInterval = setInterval(createSparkle, 1500);
    return () => clearInterval(sparkleInterval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000)?.toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000)?.toFixed(1)}K`;
    return num?.toString();
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return 'ArrowUp';
    if (growth < 0) return 'ArrowDown';
    return 'Minus';
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'success';
    if (growth < 0) return 'destructive';
    return 'muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 surface-elevation relative overflow-hidden">
      {/* Sparkle Effects */}
      {sparkles?.map(sparkle => (
        <div
          key={sparkle?.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle?.x}%`,
            top: `${sparkle?.y}%`,
            width: `${sparkle?.size}px`,
            height: `${sparkle?.size}px`,
          }}
        >
          <div className="w-full h-full bg-primary rounded-full animate-ping opacity-75" />
        </div>
      ))}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Social Proof Metrics</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics?.map((metric) => (
            <div
              key={metric?.id}
              className={`p-4 rounded-lg border border-${metric?.color}/30 bg-${metric?.color}/5 transition-neon hover:neon-glow-${metric?.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${metric?.color}/20 neon-glow-${metric?.color}`}>
                  <Icon name={metric?.icon} size={20} className={`text-${metric?.color}`} />
                </div>
                
                {metric?.growth !== undefined && (
                  <div className={`flex items-center space-x-1 text-${getGrowthColor(metric?.growth)}`}>
                    <Icon name={getGrowthIcon(metric?.growth)} size={14} />
                    <span className="text-xs font-medium">
                      {Math.abs(metric?.growth)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {metric?.label}
                </h4>
                <div className={`text-2xl font-bold text-${metric?.color} font-mono`}>
                  {formatNumber(counters?.[metric?.id] || 0)}
                </div>
                
                {metric?.subtitle && (
                  <p className="text-xs text-muted-foreground">
                    {metric?.subtitle}
                  </p>
                )}
              </div>

              {/* Progress indicator for goals */}
              {metric?.goal && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Goal Progress</span>
                    <span>{Math.round((counters?.[metric?.id] / metric?.goal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-full bg-${metric?.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${Math.min((counters?.[metric?.id] / metric?.goal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Recent activity indicator */}
              {metric?.recentActivity && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 bg-${metric?.color} rounded-full animate-pulse`} />
                    <span className="text-xs text-muted-foreground">
                      {metric?.recentActivity}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Audience Demographics */}
        <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-card-foreground mb-4">
            Audience Demographics
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">18-24</div>
              <div className="text-xs text-muted-foreground">Top Age Group</div>
              <div className="text-sm text-card-foreground">35%</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">Mobile</div>
              <div className="text-xs text-muted-foreground">Primary Device</div>
              <div className="text-sm text-card-foreground">78%</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-accent">Evening</div>
              <div className="text-xs text-muted-foreground">Peak Time</div>
              <div className="text-sm text-card-foreground">7-9 PM</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-success">Horror</div>
              <div className="text-xs text-muted-foreground">Top Category</div>
              <div className="text-sm text-card-foreground">42%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofMetrics;