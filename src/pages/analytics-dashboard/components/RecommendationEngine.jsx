import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationEngine = ({ recommendations, onApplyRecommendation }) => {
  const [activeRecommendation, setActiveRecommendation] = useState(0);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 857);
    }, 3000);

    return () => clearInterval(pulseInterval);
  }, []);

  const createConfetti = () => {
    const newConfetti = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#39FF14', '#FF00FF', '#00FFFF']?.[Math.floor(Math.random() * 3)],
      size: Math.random() * 4 + 2,
      duration: 2000 + Math.random() * 1000
    }));

    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 3000);
  };

  const handleApplyRecommendation = (recommendation) => {
    createConfetti();
    onApplyRecommendation(recommendation);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'primary';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Lightbulb';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'viral': return 'Zap';
      case 'engagement': return 'Heart';
      case 'reach': return 'Users';
      case 'conversion': return 'Target';
      default: return 'TrendingUp';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 surface-elevation relative overflow-hidden">
      {/* Confetti Effect */}
      {confetti?.map(particle => (
        <div
          key={particle?.id}
          className="absolute pointer-events-none animate-bounce"
          style={{
            left: `${particle?.x}%`,
            top: `${particle?.y}%`,
            width: `${particle?.size}px`,
            height: `${particle?.size}px`,
            backgroundColor: particle?.color,
            borderRadius: '50%',
            animation: `confettiFall ${particle?.duration}ms ease-out forwards`
          }}
        />
      ))}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-primary/20 neon-glow-primary ${pulseEffect ? 'pulse-cta' : ''}`}>
              <Icon name="Brain" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">AI Recommendations</h3>
              <p className="text-xs text-muted-foreground">Optimization strategies for viral growth</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">AI Powered</span>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations?.map((recommendation, index) => {
            const isActive = index === activeRecommendation;
            const priorityColor = getPriorityColor(recommendation?.priority);
            
            return (
              <div
                key={recommendation?.id}
                className={`p-4 rounded-lg border transition-all duration-500 cursor-pointer ${
                  isActive 
                    ? `border-${priorityColor} bg-${priorityColor}/5 neon-glow-${priorityColor}` 
                    : 'border-border bg-muted/20 hover:border-primary hover:bg-primary/5'
                }`}
                onClick={() => setActiveRecommendation(index)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-${priorityColor}/20 border border-${priorityColor}/30`}>
                      <Icon name={getPriorityIcon(recommendation?.priority)} size={16} className={`text-${priorityColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-card-foreground mb-1">
                        {recommendation?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {recommendation?.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full bg-${priorityColor}/20 text-${priorityColor} border border-${priorityColor}/30`}>
                      {recommendation?.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Impact Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Icon name={getImpactIcon(recommendation?.impact?.type)} size={14} className="text-primary" />
                      <span className="text-xs text-muted-foreground">Impact</span>
                    </div>
                    <div className="text-sm font-bold text-primary">
                      +{recommendation?.impact?.value}%
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Icon name="Clock" size={14} className="text-accent" />
                      <span className="text-xs text-muted-foreground">Time</span>
                    </div>
                    <div className="text-sm font-bold text-accent">
                      {recommendation?.timeToImplement}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Icon name="BarChart3" size={14} className="text-secondary" />
                      <span className="text-xs text-muted-foreground">Effort</span>
                    </div>
                    <div className="text-sm font-bold text-secondary">
                      {recommendation?.effort}
                    </div>
                  </div>
                </div>
                {/* Detailed Steps (shown when active) */}
                {isActive && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <h5 className="text-sm font-medium text-card-foreground mb-2">
                        Implementation Steps:
                      </h5>
                      <ol className="space-y-2">
                        {recommendation?.steps?.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-2">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-${priorityColor}/20 text-${priorityColor} text-xs flex items-center justify-center font-bold`}>
                              {stepIndex + 1}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Dopamine Formula Copy */}
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <h6 className="text-sm font-medium text-primary mb-2">
                        🧠 Viral Copy Formula:
                      </h6>
                      <p className="text-sm text-card-foreground italic">
                        "{recommendation?.copyFormula}"
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        {recommendation?.tags?.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full border border-accent/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="BookOpen"
                          iconPosition="left"
                          className="text-xs"
                        >
                          Learn More
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          iconName="Zap"
                          iconPosition="left"
                          className={`text-xs ${pulseEffect ? 'pulse-cta' : ''}`}
                          onClick={() => handleApplyRecommendation(recommendation)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Success Stories */}
        <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Trophy" size={16} className="text-success" />
            <h4 className="text-sm font-semibold text-success">Success Story</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            "Following AI recommendations increased my horror content engagement by 340% in just 2 weeks! 
            The dopamine-formula hooks are pure gold." - @ViralCreator2024
          </p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
            <span>📈 +340% Engagement</span>
            <span>🔥 2.1M Views</span>
            <span>⚡ 14 Days</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RecommendationEngine;