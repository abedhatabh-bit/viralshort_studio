import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SocialProof = () => {
  const [userCount, setUserCount] = useState(9847);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Content Creator",
      content: "Generated 2.3M views in my first week using ViralShort Studio!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "TikTok Influencer",
      content: "The AI script generator is pure magic. My horror videos went viral instantly!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "YouTube Creator",
      content: "From 100 to 100K subscribers in 3 months. This tool changed everything!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    // Animate user count
    const countInterval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);

    // Rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials?.length);
    }, 4000);

    return () => {
      clearInterval(countInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* User Count */}
      <div className="text-center p-4 bg-card border border-border rounded-lg neon-glow-primary">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Users" size={20} className="text-primary" />
          <span className="text-2xl font-heading font-bold text-primary">
            {userCount?.toLocaleString()}+
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Viral creators already inside
        </p>
      </div>
      {/* Live Success Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-card border border-border rounded-lg">
          <div className="text-lg font-heading font-bold text-accent">
            847M+
          </div>
          <p className="text-xs text-muted-foreground">Total Views Generated</p>
        </div>
        <div className="text-center p-3 bg-card border border-border rounded-lg">
          <div className="text-lg font-heading font-bold text-secondary">
            24/7
          </div>
          <p className="text-xs text-muted-foreground">AI Content Creation</p>
        </div>
      </div>
      {/* Testimonial Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
        >
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="w-full flex-shrink-0">
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="flex items-start space-x-3">
                  <img
                    src={testimonial?.avatar}
                    alt={testimonial?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-2">
                      "{testimonial?.content}"
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-primary">
                        {testimonial?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {testimonial?.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-3">
          {testimonials?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-neon ${
                index === currentTestimonial 
                  ? 'bg-primary neon-glow-primary' :'bg-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground mb-3">
          🔥 Recent Viral Hits
        </h3>
        <div className="space-y-2">
          {[
            { user: "Alex K.", views: "1.2M", time: "2 min ago" },
            { user: "Zoe M.", views: "890K", time: "5 min ago" },
            { user: "Ryan P.", views: "2.1M", time: "8 min ago" }
          ]?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-foreground">{activity?.user}</span>
                <span className="text-primary font-medium">{activity?.views} views</span>
              </div>
              <span className="text-muted-foreground">{activity?.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProof;