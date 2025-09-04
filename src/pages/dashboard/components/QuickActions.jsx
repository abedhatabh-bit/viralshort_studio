import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();
  const [heartbeatActive, setHeartbeatActive] = useState(false);
  const [sparkEffect, setSparkEffect] = useState(false);

  useEffect(() => {
    // Heartbeat animation at 70 BPM (857ms interval)
    const heartbeatInterval = setInterval(() => {
      setHeartbeatActive(true);
      setTimeout(() => setHeartbeatActive(false), 200);
    }, 857);

    return () => clearInterval(heartbeatInterval);
  }, []);

  useEffect(() => {
    // Spark effects for secondary actions
    const sparkInterval = setInterval(() => {
      setSparkEffect(true);
      setTimeout(() => setSparkEffect(false), 500);
    }, 3000);

    return () => clearInterval(sparkInterval);
  }, []);

  const handleCreateVideo = () => {
    navigate('/video-creator');
  };

  const handleTemplateLibrary = () => {
    navigate('/template-library');
  };

  const handleAnalytics = () => {
    navigate('/analytics-dashboard');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-heading font-bold text-foreground mb-6">
        Quick Actions
      </h2>

      <div className="space-y-4">
        {/* Primary Action - Create New Video */}
        <Button
          variant="default"
          size="lg"
          fullWidth
          iconName="Video"
          iconPosition="left"
          onClick={handleCreateVideo}
          className={`
            bg-secondary text-secondary-foreground font-heading font-bold text-lg
            ${heartbeatActive ? 'pulse-cta scale-105' : ''}
            transition-all duration-200
          `}
        >
          Create New Video
        </Button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="default"
            iconName="Library"
            iconPosition="left"
            onClick={handleTemplateLibrary}
            className={`
              border-accent text-accent hover:bg-accent hover:text-accent-foreground
              ${sparkEffect ? 'neon-glow-accent' : ''}
            `}
          >
            Templates
          </Button>

          <Button
            variant="outline"
            size="default"
            iconName="BarChart3"
            iconPosition="left"
            onClick={handleAnalytics}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Analytics
          </Button>
        </div>

        {/* Batch Actions */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-body font-medium text-muted-foreground mb-3">
            Batch Operations
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="ghost"
              size="sm"
              iconName="Copy"
              iconPosition="left"
              className="justify-start text-muted-foreground hover:text-foreground"
            >
              Duplicate Project
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
              className="justify-start text-muted-foreground hover:text-foreground"
            >
              Export All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;