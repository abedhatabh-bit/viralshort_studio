import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FrameSequence = ({ script, onFrameUpdate }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [glitchFrame, setGlitchFrame] = useState(-1);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    // Glitch effect every 3-5 seconds
    const glitchInterval = setInterval(() => {
      const randomFrame = Math.floor(Math.random() * (script?.frames?.length || 6));
      setGlitchFrame(randomFrame);
      setTimeout(() => setGlitchFrame(-1), 200);
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(glitchInterval);
  }, [script]);

  useEffect(() => {
    // Heartbeat pulse at 70 BPM (857ms interval)
    const pulseInterval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 100);
    }, 857);

    return () => clearInterval(pulseInterval);
  }, []);

  if (!script || !script?.frames) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Film" size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-lg text-foreground">6-Frame Sequence</h3>
        </div>
        <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Generate a script to see your frame sequence</p>
        </div>
      </div>
    );
  }

  const handleFrameSelect = (index) => {
    setCurrentFrame(index);
    onFrameUpdate && onFrameUpdate(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Film" size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-lg text-foreground">6-Frame Funnel Sequence</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          Frame {currentFrame + 1} of {script?.frames?.length}
        </div>
      </div>
      <div className="grid gap-3">
        {script?.frames?.map((frame, index) => {
          const isActive = currentFrame === index;
          const isGlitching = glitchFrame === index;
          const showCTA = (index + 1) % 2 === 0; // Every 2 frames
          
          return (
            <div key={index} className="space-y-2">
              <button
                onClick={() => handleFrameSelect(index)}
                className={`
                  w-full p-4 rounded-lg border-2 text-left transition-neon
                  ${isActive 
                    ? 'border-primary bg-primary/10 neon-glow-primary' :'border-border hover:border-primary/50'
                  }
                  ${isGlitching ? 'glitch-effect' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {frame}
                    </p>
                  </div>
                </div>
              </button>
              {showCTA && (
                <div className="ml-11 space-y-2">
                  <Button
                    variant="default"
                    size="lg"
                    className={`w-full text-lg font-bold ${pulseActive ? 'pulse-cta' : ''} neon-glow-intense`}
                    iconName="Play"
                    iconPosition="left"
                  >
                    {script?.cta}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                  >
                    No, I'll skip this
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Final Binary Choice */}
      <div className="mt-6 p-4 border border-accent rounded-lg bg-accent/5">
        <h4 className="font-body font-semibold text-accent mb-3 flex items-center space-x-2">
          <Icon name="GitBranch" size={16} />
          <span>Final Choice Frame</span>
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="default"
            size="lg"
            className="neon-glow-primary"
            iconName="ThumbsUp"
          >
            YES, SHOW ME
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-muted-foreground border-muted"
            iconName="ThumbsDown"
          >
            No thanks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FrameSequence;