import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ViralBranding = () => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [sparklePositions, setSparklePositions] = useState([]);

  useEffect(() => {
    // Glitch effect every 4-6 seconds
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }, Math.random() * 2000 + 4000);

    // Generate random sparkle positions
    const generateSparkles = () => {
      const sparkles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setSparklePositions(sparkles);
    };

    generateSparkles();
    const sparkleInterval = setInterval(generateSparkles, 6000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(sparkleInterval);
    };
  }, []);

  return (
    <div className="relative text-center mb-12">
      {/* Background Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparklePositions?.map((sparkle) => (
          <div
            key={sparkle?.id}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              left: `${sparkle?.x}%`,
              top: `${sparkle?.y}%`,
              animationDelay: `${sparkle?.delay}s`
            }}
          />
        ))}
      </div>
      {/* Main Logo */}
      <div className={`relative z-10 mb-6 ${glitchActive ? 'glitch-effect' : ''}`}>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <Icon 
              name="Zap" 
              size={48} 
              className="text-primary neon-glow-primary" 
            />
            <div className="absolute -top-1 -right-1">
              <Icon 
                name="Sparkles" 
                size={16} 
                className="text-secondary animate-pulse" 
              />
            </div>
          </div>
          <div className="font-heading font-black text-4xl">
            <span className="text-primary">Viral</span>
            <span className="text-secondary">Short</span>
            <span className="text-accent"> Studio</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-lg text-muted-foreground font-body mb-2">
          AI-Powered Viral Video Creation
        </p>
        
        {/* Subtitle with animated elements */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="TrendingUp" size={16} className="text-primary animate-pulse" />
          <span>Create • Captivate • Go Viral</span>
          <Icon name="TrendingUp" size={16} className="text-primary animate-pulse" />
        </div>
      </div>
      {/* Feature Highlights */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 neon-glow-primary">
            <Icon name="Brain" size={20} className="text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">AI Scripts</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2 neon-glow-secondary">
            <Icon name="Palette" size={20} className="text-secondary" />
          </div>
          <p className="text-xs text-muted-foreground">Neon Design</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2 neon-glow-accent">
            <Icon name="Rocket" size={20} className="text-accent" />
          </div>
          <p className="text-xs text-muted-foreground">Instant Viral</p>
        </div>
      </div>
      {/* Trust Badges */}
      <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} className="text-success" />
          <span>SSL Secured</span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={14} className="text-accent" />
          <span>24/7 AI</span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
        <div className="flex items-center space-x-1">
          <Icon name="Star" size={14} className="text-warning" />
          <span>Free Forever</span>
        </div>
      </div>
    </div>
  );
};

export default ViralBranding;