import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProofSection = () => {
  const [animatedCounters, setAnimatedCounters] = useState({
    totalViews: 0,
    templatesUsed: 0,
    viralVideos: 0,
    activeCreators: 0
  });

  const targetStats = {
    totalViews: 2847392,
    templatesUsed: 15847,
    viralVideos: 3247,
    activeCreators: 8934
  };

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "Content Creator",
      content: `These templates are insane! My horror shorts went from 500 views to 2.3M in just one week. The psychological hooks actually work!`,
      viralCount: "2.3M views",
      platform: "TikTok"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "YouTuber",
      content: `The fairy tale templates with neon effects are pure gold. My engagement rate jumped 340% and I gained 50K subscribers in 2 months.`,
      viralCount: "50K subscribers",
      platform: "YouTube"
    },
    {
      id: 3,
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      role: "Digital Marketer",
      content: `The comedy templates are genius! The pattern interrupts and micro-rewards keep viewers hooked. Best ROI I've ever seen.`,
      viralCount: "890% ROI",
      platform: "Multiple"
    }
  ];

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedCounters({
          totalViews: Math.floor(targetStats?.totalViews * easeOut),
          templatesUsed: Math.floor(targetStats?.templatesUsed * easeOut),
          viralVideos: Math.floor(targetStats?.viralVideos * easeOut),
          activeCreators: Math.floor(targetStats?.activeCreators * easeOut)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-12">
      {/* Stats Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
          Trusted by <span className="text-primary neon-glow-primary">Viral Creators</span>
        </h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of creators who've achieved viral success with our templates
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-card border border-border rounded-lg surface-elevation">
            <div className="text-3xl font-mono font-bold text-primary mb-1">
              {animatedCounters?.totalViews?.toLocaleString()}+
            </div>
            <div className="text-sm text-muted-foreground">Total Views Generated</div>
          </div>
          
          <div className="text-center p-4 bg-card border border-border rounded-lg surface-elevation">
            <div className="text-3xl font-mono font-bold text-success mb-1">
              {animatedCounters?.templatesUsed?.toLocaleString()}+
            </div>
            <div className="text-sm text-muted-foreground">Templates Used</div>
          </div>
          
          <div className="text-center p-4 bg-card border border-border rounded-lg surface-elevation">
            <div className="text-3xl font-mono font-bold text-accent mb-1">
              {animatedCounters?.viralVideos?.toLocaleString()}+
            </div>
            <div className="text-sm text-muted-foreground">Viral Videos Created</div>
          </div>
          
          <div className="text-center p-4 bg-card border border-border rounded-lg surface-elevation">
            <div className="text-3xl font-mono font-bold text-secondary mb-1">
              {animatedCounters?.activeCreators?.toLocaleString()}+
            </div>
            <div className="text-sm text-muted-foreground">Active Creators</div>
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials?.map((testimonial) => (
          <div
            key={testimonial?.id}
            className="bg-card border border-border rounded-lg p-6 surface-elevation hover:neon-glow-primary transition-neon"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
              </div>
              <div>
                <h4 className="font-medium text-foreground">{testimonial?.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial?.role}</p>
              </div>
            </div>
            
            <blockquote className="text-sm text-muted-foreground mb-4 italic">
              "{testimonial?.content}"
            </blockquote>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={14} className="text-success" />
                <span className="text-sm font-medium text-success">
                  {testimonial?.viralCount}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {testimonial?.platform}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProofSection;