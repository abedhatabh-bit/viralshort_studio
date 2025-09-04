import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const SocialProofSection = () => {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [sparkAnimation, setSparkAnimation] = useState(false);

  const targetCount = 12847;
  const creatorFaces = [
    {
      id: 1,
      name: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      success: "2.3M views in 30 days"
    },
    {
      id: 2,
      name: "Jake R.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      success: "850K followers gained"
    },
    {
      id: 3,
      name: "Maya L.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      success: "1.7M viral video"
    },
    {
      id: 4,
      name: "Alex K.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      success: "500K in 7 days"
    }
  ];

  const testimonials = [
    {
      text: "This tool made my horror stories go viral overnight! 2.3M views and counting!",
      author: "Sarah M.",
      metric: "2.3M views"
    },
    {
      text: "From 0 to 850K followers using their fairy tale templates. Absolutely insane results!",
      author: "Jake R.",
      metric: "850K followers"
    },
    {
      text: "My funny shorts hit 1.7M views. The AI script generator is pure magic!",
      author: "Maya L.",
      metric: "1.7M views"
    }
  ];

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setAnimatedCount(targetCount);
        clearInterval(timer);
        setSparkAnimation(true);
        setTimeout(() => setSparkAnimation(false), 1000);
      } else {
        setAnimatedCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Creator Success Counter */}
      <div className="text-center space-y-2">
        <div className={`relative inline-block ${sparkAnimation ? 'animate-pulse' : ''}`}>
          <h3 className="text-3xl font-bold text-primary neon-glow-primary">
            {animatedCount?.toLocaleString()}+
          </h3>
          {sparkAnimation && (
            <div className="absolute -top-2 -right-2 text-accent animate-bounce">
              <Icon name="Sparkles" size={16} />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Creators already making viral content
        </p>
      </div>
      {/* Creator Faces Grid */}
      <div className="flex justify-center space-x-2">
        {creatorFaces?.map((creator, index) => (
          <div 
            key={creator?.id}
            className="relative group"
            style={{ 
              animationDelay: `${index * 200}ms`,
              animation: 'fadeIn 0.5s ease-out forwards'
            }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-300 neon-glow-primary">
              <Image
                src={creator?.avatar}
                alt={creator?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {creator?.name}: {creator?.success}
            </div>
          </div>
        ))}
      </div>
      {/* Rotating Testimonial */}
      <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary animate-pulse" />
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Icon name="Quote" size={16} className="text-accent mt-1 flex-shrink-0" />
            <p className="text-sm text-card-foreground italic">
              "{testimonials?.[currentTestimonial]?.text}"
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              — {testimonials?.[currentTestimonial]?.author}
            </span>
            <span className="text-xs text-primary font-bold">
              {testimonials?.[currentTestimonial]?.metric}
            </span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-3">
          {testimonials?.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-primary neon-glow-primary' :'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
      {/* Scarcity Message */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 text-warning">
          <Icon name="Clock" size={16} className="animate-pulse" />
          <span className="text-sm font-medium">
            Join before spots fill up!
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Limited beta access - Only 847 spots remaining
        </p>
      </div>
    </div>
  );
};

export default SocialProofSection;