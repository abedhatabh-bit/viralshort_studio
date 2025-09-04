import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PreviewModal = ({ template, isOpen, onClose, onSelect }) => {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [flickerEffect, setFlickerEffect] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Pattern interrupt glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 4000);

    // Neon flicker animation
    const flickerInterval = setInterval(() => {
      setFlickerEffect(true);
      setTimeout(() => setFlickerEffect(false), 150);
    }, 6000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(flickerInterval);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isPlaying || !template) return;

    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % template?.frames?.length);
    }, 1000);

    return () => clearInterval(frameInterval);
  }, [isPlaying, template]);

  const handleUseTemplate = () => {
    onSelect(template);
    navigate('/video-creator', { state: { selectedTemplate: template } });
    onClose();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isOpen || !template) return null;

  const currentFrameData = template?.frames?.[currentFrame];

  return (
    <div className="fixed inset-0 z-200 bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className={`
        bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden surface-elevation
        ${glitchEffect ? 'glitch-effect' : ''}
        ${flickerEffect ? 'animate-pulse' : ''}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              {template?.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {template?.niche} • {template?.difficulty} • {template?.duration}s
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Preview Area */}
          <div className="flex-1 p-6">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-w-sm mx-auto">
              {/* Frame Display */}
              <div className="absolute inset-0">
                <Image
                  src={currentFrameData?.image || template?.thumbnail}
                  alt={`Frame ${currentFrame + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Text Overlay */}
                {currentFrameData?.text && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-bold mb-2 neon-glow-primary">
                        {currentFrameData?.text}
                      </h3>
                      {currentFrameData?.subtitle && (
                        <p className="text-gray-300 text-lg">
                          {currentFrameData?.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-50 rounded-full h-1">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-1000 neon-glow-primary"
                      style={{ width: `${((currentFrame + 1) / template?.frames?.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Play Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                <Button
                  variant="default"
                  size="lg"
                  iconName={isPlaying ? "Pause" : "Play"}
                  onClick={handlePlayPause}
                  className="neon-glow-primary"
                />
              </div>
            </div>

            {/* Frame Navigation */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronLeft"
                onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                disabled={currentFrame === 0}
              />
              
              <div className="flex space-x-1">
                {template?.frames?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFrame(index)}
                    className={`w-2 h-2 rounded-full transition-neon ${
                      index === currentFrame 
                        ? 'bg-primary neon-glow-primary' :'bg-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronRight"
                onClick={() => setCurrentFrame(Math.min(template?.frames?.length - 1, currentFrame + 1))}
                disabled={currentFrame === template?.frames?.length - 1}
              />
            </div>
          </div>

          {/* Template Details */}
          <div className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-border">
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-mono font-bold text-primary">
                    {template?.views?.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-mono font-bold text-success">
                    {template?.viralRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">Viral Rate</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {template?.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Features</h4>
                <ul className="space-y-2">
                  {template?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Icon name="Check" size={14} className="text-success" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {template?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  iconName="Zap"
                  iconPosition="left"
                  onClick={handleUseTemplate}
                  className="neon-glow-primary pulse-cta"
                >
                  Use This Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Heart"
                  iconPosition="left"
                  className="text-muted-foreground hover:text-error"
                >
                  Add to Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;