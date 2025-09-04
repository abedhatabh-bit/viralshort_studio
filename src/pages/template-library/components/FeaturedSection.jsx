import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import TemplateCard from './TemplateCard';

const FeaturedSection = ({ featuredTemplates, onPreview, onSelect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || featuredTemplates?.length <= 1) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredTemplates?.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [autoPlay, featuredTemplates?.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredTemplates?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredTemplates?.length) % featuredTemplates?.length);
  };

  if (!featuredTemplates?.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading font-bold text-foreground flex items-center space-x-2">
          <Icon name="Star" size={24} className="text-warning" />
          <span>Featured Templates</span>
          <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded neon-glow-primary">
            SECRET FORMULAS
          </div>
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-2 rounded transition-neon ${
              autoPlay 
                ? 'text-primary neon-glow-primary' :'text-muted-foreground hover:text-foreground'
            }`}
            title={autoPlay ? 'Pause autoplay' : 'Start autoplay'}
          >
            <Icon name={autoPlay ? "Pause" : "Play"} size={16} />
          </button>
          
          <div className="flex space-x-1">
            <button
              onClick={prevSlide}
              className="p-2 text-muted-foreground hover:text-foreground hover:neon-glow-primary transition-neon"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 text-muted-foreground hover:text-foreground hover:neon-glow-primary transition-neon"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Featured Carousel */}
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {featuredTemplates?.map((template, index) => (
            <div key={template?.id} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                <div className="md:col-span-2 lg:col-span-1">
                  <TemplateCard
                    template={template}
                    onPreview={onPreview}
                    onSelect={onSelect}
                  />
                </div>
                
                {/* Featured Template Details */}
                <div className="md:col-span-2 flex flex-col justify-center p-6 bg-card border border-primary rounded-lg neon-glow-primary">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Zap" size={20} className="text-primary" />
                      <span className="text-sm font-medium text-primary">VIRAL FORMULA REVEALED</span>
                    </div>
                    
                    <h3 className="text-2xl font-heading font-bold text-foreground">
                      {template?.title}
                    </h3>
                    
                    <p className="text-muted-foreground">
                      {template?.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold text-primary">
                          {template?.views?.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold text-success">
                          {template?.viralRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Viral Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold text-accent">
                          {template?.usageCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Times Used</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      <span>Created by top viral creators</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredTemplates?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-neon ${
                index === currentSlide 
                  ? 'bg-primary neon-glow-primary' :'bg-muted-foreground hover:bg-foreground'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;