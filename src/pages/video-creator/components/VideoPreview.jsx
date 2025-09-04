import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import VideoCreator from './VideoCreator';

const VideoPreview = ({ script, selectedNiche, currentFrame, customizationSettings, exportFormat }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [colorInvert, setColorInvert] = useState(false);
  const [sparkEffect, setSparkEffect] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showVideoCreator, setShowVideoCreator] = useState(false);
  const [generatedVideoBlob, setGeneratedVideoBlob] = useState(null);

  useEffect(() => {
    let interval;
    if (isPlaying && script) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, script]);

  useEffect(() => {
    // Color inversion effect every 4-6 seconds
    const inversionInterval = setInterval(() => {
      setColorInvert(true);
      setTimeout(() => setColorInvert(false), 300);
    }, Math.random() * 2000 + 4000);

    return () => clearInterval(inversionInterval);
  }, []);

  useEffect(() => {
    // Spark micro-reward animation
    const sparkInterval = setInterval(() => {
      setSparkEffect(true);
      setTimeout(() => setSparkEffect(false), 500);
    }, 3000);

    return () => clearInterval(sparkInterval);
  }, []);

  useEffect(() => {
    // Countdown timer
    let countdownInterval;
    if (isPlaying) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => prev > 0 ? prev - 1 : 10);
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (exportFormat) {
      setShowVideoCreator(true);
    }
  }, [exportFormat]);

  const getNicheTheme = () => {
    const themes = {
      horror: {
        bgGradient: 'from-red-900/20 to-black',
        textColor: 'text-destructive',
        accentColor: 'destructive'
      },
      fairytales: {
        bgGradient: 'from-purple-900/20 to-black',
        textColor: 'text-secondary',
        accentColor: 'secondary'
      },
      funny: {
        bgGradient: 'from-cyan-900/20 to-black',
        textColor: 'text-accent',
        accentColor: 'accent'
      }
    };
    return themes?.[selectedNiche] || themes?.funny;
  };

  const theme = getNicheTheme();

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    setProgress(0);
  };

  const handleExport = (format) => {
    // Simulate export process
    console.log(`Exporting video in ${format} format...`);
  };

  const handleVideoGenerated = (videoBlob) => {
    setGeneratedVideoBlob(videoBlob);
  };

  const handleCreateActualVideo = () => {
    setShowVideoCreator(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Monitor" size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-lg text-foreground">Live Preview</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={() => setProgress(0)}
          >
            Reset
          </Button>
        </div>
      </div>
      {/* Video Preview Container */}
      <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden border-2 border-border">
        {/* Background with neon gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${theme?.bgGradient} ${colorInvert ? 'invert' : ''}`}>
          
          {/* Motion Streaks */}
          <div className="absolute inset-0">
            {[...Array(5)]?.map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 bg-gradient-to-b from-transparent via-${theme?.accentColor} to-transparent opacity-30`}
                style={{
                  left: `${20 + i * 15}%`,
                  height: '100%',
                  animation: `moveDown ${2 + i * 0.5}s linear infinite`
                }}
              />
            ))}
          </div>

          {/* Content Area */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            
            {/* Header with countdown */}
            <div className="flex justify-between items-start">
              <div className={`px-3 py-1 rounded-full bg-${theme?.accentColor}/20 border border-${theme?.accentColor}`}>
                <span className={`text-sm font-bold ${theme?.textColor}`}>
                  {countdown}s left
                </span>
              </div>
              {sparkEffect && (
                <div className="text-2xl animate-bounce">✨</div>
              )}
            </div>

            {/* Main Content */}
            <div className="text-center space-y-4">
              {script && (
                <>
                  <div className={`text-sm font-bold ${theme?.textColor} neon-glow-${theme?.accentColor}`}>
                    {script?.opener}
                  </div>
                  <div className="text-lg font-bold text-white leading-tight">
                    {script?.hook}
                  </div>
                  {script?.frames && script?.frames?.[currentFrame] && (
                    <div className="text-base text-gray-300 leading-relaxed">
                      {script?.frames?.[currentFrame]}
                    </div>
                  )}
                </>
              )}
              
              {!script && (
                <div className="text-center text-gray-500">
                  <Icon name="Play" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Generate a script to see preview</p>
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="space-y-3">
              {script && (
                <Button
                  variant="default"
                  size="lg"
                  className="w-full text-lg font-bold pulse-cta neon-glow-intense"
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  {script?.cta}
                </Button>
              )}
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className={`h-2 bg-${theme?.accentColor} rounded-full transition-all duration-100 neon-glow-${theme?.accentColor}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePlay}
          variant={isPlaying ? "destructive" : "default"}
          iconName={isPlaying ? "Pause" : "Play"}
          iconPosition="left"
        >
          {isPlaying ? 'Pause' : 'Play Preview'}
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => handleExport('tiktok')}
            disabled={!script}
          >
            TikTok
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => handleExport('youtube')}
            disabled={!script}
          >
            YouTube
          </Button>
        </div>
      </div>
      {/* Format Options */}
      {script && (
        <div className="grid grid-cols-2 gap-3 p-4 bg-card rounded-lg border border-border">
          <div className="text-center">
            <div className="text-sm font-medium text-card-foreground mb-1">TikTok Format</div>
            <div className="text-xs text-muted-foreground">9:16 • 60s max</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-card-foreground mb-1">YouTube Shorts</div>
            <div className="text-xs text-muted-foreground">9:16 • 60s max</div>
          </div>
        </div>
      )}

      {/* New Video Creation Section */}
      {script && (
        <div className="space-y-4">
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground flex items-center space-x-2">
                <Icon name="Video" size={16} />
                <span>Actual Video Creation</span>
              </h4>
              <Button
                variant="outline"
                size="sm"
                iconName="Wand2"
                onClick={handleCreateActualVideo}
              >
                Open Creator
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Generate real video files using HTML5 Canvas and open source tools
            </p>
            
            {showVideoCreator && (
              <VideoCreator
                script={script}
                selectedNiche={selectedNiche}
                customizationSettings={customizationSettings}
                onVideoGenerated={handleVideoGenerated}
                autoStartFormat={exportFormat}
              />
            )}

            {generatedVideoBlob && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Video Generated Successfully!
                  </span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Your video is ready for download and social media sharing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;