import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TemplateCard = ({ template, onPreview, onSelect }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [sparkAnimation, setSparkAnimation] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    if (template?.featured) {
      const pulseInterval = setInterval(() => {
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 857);
      }, 1714); // 70 BPM heartbeat

      return () => clearInterval(pulseInterval);
    }
  }, [template?.featured]);

  const handleSelect = () => {
    setSparkAnimation(true);
    setTimeout(() => {
      onSelect(template);
      navigate('/video-creator', { state: { selectedTemplate: template } });
    }, 300);
  };

  const handlePreview = (e) => {
    e?.stopPropagation();
    onPreview(template);
  };

  const getNicheColor = (niche) => {
    switch (niche) {
      case 'horror': return 'border-error text-error';
      case 'fairy-tales': return 'border-secondary text-secondary';
      case 'funny': return 'border-accent text-accent';
      default: return 'border-primary text-primary';
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'text-success';
      case 'intermediate': return 'text-warning';
      case 'advanced': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={`
        relative bg-card border rounded-lg overflow-hidden transition-neon cursor-pointer
        ${template?.featured ? 'border-primary neon-glow-primary' : 'border-border hover:border-primary'}
        ${pulseActive ? 'pulse-cta' : ''}
        ${sparkAnimation ? 'animate-pulse' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
    >
      {/* Featured Badge */}
      {template?.featured && (
        <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold neon-glow-primary">
          SECRET FORMULA
        </div>
      )}
      {/* Template Preview */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={template?.thumbnail}
          alt={template?.title}
          className={`w-full h-full object-cover transition-smooth ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              iconName="Play"
              iconPosition="left"
              onClick={handlePreview}
              className="neon-glow-primary"
            >
              Preview
            </Button>
          </div>
        )}

        {/* Niche Category Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold border ${getNicheColor(template?.niche)}`}>
          {template?.niche?.toUpperCase()}
        </div>
      </div>
      {/* Template Info */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg text-foreground mb-2 line-clamp-2">
          {template?.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {template?.description}
        </p>

        {/* Metrics Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} className="text-primary" />
              <span className="text-xs text-foreground font-mono">
                {template?.views?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="TrendingUp" size={14} className="text-success" />
              <span className="text-xs text-success font-mono">
                {template?.viralRate}%
              </span>
            </div>
          </div>
          
          <div className={`text-xs font-medium ${getDifficultyColor(template?.difficulty)}`}>
            {template?.difficulty?.toUpperCase()}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template?.tags?.slice(0, 3)?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="Zap"
            iconPosition="left"
            className="neon-glow-primary"
          >
            Use Template
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Heart"
            onClick={(e) => {
              e?.stopPropagation();
              // Handle favorite
            }}
            className="text-muted-foreground hover:text-error"
          />
        </div>
      </div>
      {/* Spark Animation */}
      {sparkAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;