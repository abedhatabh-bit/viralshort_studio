import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TrendingAnalysis = ({ trends, onTrendClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionStreaks, setMotionStreaks] = useState([]);

  useEffect(() => {
    if (!trends || trends.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % trends.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [trends]);

  useEffect(() => {
    const createMotionStreak = () => {
      const streak = {
        id: Date.now(),
        x: Math.random() * 100,
        duration: 2000 + Math.random() * 1000
      };
      
      setMotionStreaks(prev => [...prev, streak]);
      
      setTimeout(() => {
        setMotionStreaks(prev => prev?.filter(s => s?.id !== streak?.id));
      }, streak?.duration);
    };

    const streakInterval = setInterval(createMotionStreak, 3000);
    return () => clearInterval(streakInterval);
  }, []);

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return 'TrendingUp';
    if (trend === 'falling') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'rising') return 'success';
    if (trend === 'falling') return 'destructive';
    return 'muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 surface-elevation relative overflow-hidden">
      {/* Motion Streaks */}
      {motionStreaks?.map(streak => (
        <div
          key={streak?.id}
          className="absolute top-0 w-0.5 h-full bg-gradient-to-b from-primary/60 via-primary/30 to-transparent animate-pulse"
          style={{
            left: `${streak?.x}%`,
            animation: `slideDown ${streak?.duration}ms linear`
          }}
        />
      ))}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Trending Analysis</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Live Data</span>
          </div>
        </div>

        <div className="space-y-4">
          {trends?.map((trend, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={trend?.id}
                className={`p-4 rounded-lg border transition-all duration-500 cursor-pointer ${
                  isActive 
                    ? 'border-primary bg-primary/5 neon-glow-primary' :'border-border bg-muted/20 hover:border-accent hover:bg-accent/5'
                }`}
                onClick={() => onTrendClick(trend)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${trend?.categoryColor}/20 border border-${trend?.categoryColor}/30`}>
                      <Icon name={trend?.icon} size={16} className={`text-${trend?.categoryColor}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-card-foreground">{trend?.title}</h4>
                      <p className="text-xs text-muted-foreground">{trend?.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getTrendIcon(trend?.direction)} 
                      size={16} 
                      className={`text-${getTrendColor(trend?.direction)}`} 
                    />
                    <span className={`text-sm font-bold text-${getTrendColor(trend?.direction)}`}>
                      {trend?.change}%
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Viral Potential</span>
                    <span>{trend?.viralPotential}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${trend?.categoryColor} to-${trend?.categoryColor}/60 transition-all duration-1000 ${
                        isActive ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        width: `${trend?.viralPotential}%`,
                        animation: isActive ? 'pulse 2s infinite' : 'none'
                      }}
                    />
                  </div>
                </div>
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-bold text-card-foreground">
                      {trend?.engagement?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-card-foreground">
                      {trend?.reach?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Reach</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-card-foreground">
                      {trend?.shares?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Shares</div>
                  </div>
                </div>
                {/* Hashtags */}
                {isActive && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                      {trend?.hashtags?.map((hashtag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full border border-accent/30"
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TrendingAnalysis;