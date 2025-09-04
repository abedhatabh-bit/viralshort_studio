import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const EnhancedVideoCreator = ({ script, selectedNiche, customizationSettings, onVideoGenerated, autoStartFormat }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationFrameId, setAnimationFrameId] = useState(null);
  const [quality, setQuality] = useState('1080p');
  const [format, setFormat] = useState('mp4');
  const [backgroundType, setBackgroundType] = useState('gradient');

  // Quality settings
  const qualitySettings = {
    '720p': { width: 720, height: 1280, bitrate: 2500000 },
    '1080p': { width: 1080, height: 1920, bitrate: 5000000 },
    '4K': { width: 2160, height: 3840, bitrate: 15000000 }
  };

  // Enhanced niche configurations
  const getAnimationConfig = () => {
    const configs = {
      horror: {
        backgroundColor: '#0a0a0a',
        textColor: '#ff6b6b',
        accentColor: '#ff4757',
        animations: ['shake', 'fade', 'glitch'],
        speed: 1.2,
        particles: 'blood',
        font: 'Creepster'
      },
      fairytales: {
        backgroundColor: '#1a0a2e',
        textColor: '#ffd700',
        accentColor: '#ff6b9d',
        animations: ['sparkle', 'float', 'zoom'],
        speed: 1.0,
        particles: 'stars',
        font: 'Cinzel'
      },
      funny: {
        backgroundColor: '#000428',
        textColor: '#00d4ff',
        accentColor: '#f0f',
        animations: ['bounce', 'spin', 'pulse'],
        speed: 1.5,
        particles: 'confetti',
        font: 'Comic Sans MS'
      },
      subway: {
        backgroundColor: '#1e3a8a',
        textColor: '#fbbf24',
        accentColor: '#10b981',
        animations: ['slide', 'jump', 'dash'],
        speed: 2.0,
        particles: 'coins',
        font: 'Orbitron'
      },
      minecraft: {
        backgroundColor: '#0f172a',
        textColor: '#22c55e',
        accentColor: '#f59e0b',
        animations: ['pixelate', 'build', 'mine'],
        speed: 1.3,
        particles: 'blocks',
        font: 'Minecraft'
      }
    };
    return configs[selectedNiche] || configs.funny;
  };

  const config = getAnimationConfig();
  const currentQuality = qualitySettings[quality];

  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas();
    }
  }, [script, selectedNiche, quality, backgroundType]);

  useEffect(() => {
    if (autoStartFormat && script) {
      startRecording();
    }
  }, [autoStartFormat, script]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = currentQuality.width;
    canvas.height = currentQuality.height;

    // Enhanced background rendering
    drawBackground(ctx);
  };

  const drawBackground = (ctx) => {
    const canvas = canvasRef.current;
    
    switch (backgroundType) {
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, config.backgroundColor);
        gradient.addColorStop(0.5, `${config.accentColor}40`);
        gradient.addColorStop(1, config.backgroundColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
        
      case 'subway':
        drawSubwayBackground(ctx);
        break;
        
      case 'minecraft':
        drawMinecraftBackground(ctx);
        break;
        
      default:
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const drawSubwayBackground = (ctx) => {
    const canvas = canvasRef.current;
    
    // Subway tunnel effect
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Railway tracks
    for (let i = 0; i < 5; i++) {
      const y = (canvas.height / 5) * i;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Moving train effect
    const trainX = (Date.now() * 0.1) % (canvas.width + 200) - 200;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(trainX, canvas.height * 0.7, 150, 80);
  };

  const drawMinecraftBackground = (ctx) => {
    const canvas = canvasRef.current;
    const blockSize = 40;
    
    // Pixelated background
    for (let x = 0; x < canvas.width; x += blockSize) {
      for (let y = 0; y < canvas.height; y += blockSize) {
        const colors = ['#0f172a', '#1e293b', '#334155', '#475569'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, blockSize, blockSize);
        
        // Block borders
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, blockSize, blockSize);
      }
    }
  };

  const drawFrame = (frameIndex, timestamp = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || !script) return;

    const ctx = canvas.getContext('2d');
    
    // Clear and redraw background
    drawBackground(ctx);

    // Add animated elements based on niche
    drawAnimatedElements(ctx, timestamp);

    // Draw text content with enhanced styling
    if (script.frames[frameIndex]) {
      drawEnhancedText(ctx, script.frames[frameIndex], frameIndex, timestamp);
    }

    // Draw hook at the top
    if (script.hook) {
      drawHook(ctx, script.hook, timestamp);
    }

    // Draw CTA at the bottom
    if (script.cta) {
      drawCTA(ctx, script.cta, timestamp);
    }

    // Add particle effects
    drawParticleEffects(ctx, timestamp);
  };

  const drawAnimatedElements = (ctx, timestamp) => {
    const canvas = canvasRef.current;
    
    switch (selectedNiche) {
      case 'subway':
        // Moving coins
        for (let i = 0; i < 8; i++) {
          const x = (canvas.width / 8) * i;
          const y = (timestamp * 0.5 + i * 100) % (canvas.height + 50);
          
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fill();
          
          // Coin shine effect
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x - 5, y - 5, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'minecraft':
        // Falling blocks
        for (let i = 0; i < 6; i++) {
          const x = (canvas.width / 6) * i;
          const y = (timestamp * 0.3 + i * 150) % (canvas.height + 40);
          
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(x, y, 30, 30);
          ctx.strokeStyle = '#16a34a';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, 30, 30);
        }
        break;
        
      default:
        // Default animated streaks
        for (let i = 0; i < 5; i++) {
          const x = (canvas.width / 6) * (i + 1);
          const speed = 2 + i * 0.5;
          const offset = (timestamp * speed) % (canvas.height + 100);
          
          const gradient = ctx.createLinearGradient(0, offset - 50, 0, offset + 50);
          gradient.addColorStop(0, 'transparent');
          gradient.addColorStop(0.5, config.accentColor + '80');
          gradient.addColorStop(1, 'transparent');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, offset - 50);
          ctx.lineTo(x, offset + 50);
          ctx.stroke();
        }
    }
  };

  const drawEnhancedText = (ctx, text, frameIndex, timestamp) => {
    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    
    // Apply niche-specific animations
    if (config.animations.includes('shake')) {
      const shakeX = Math.sin(timestamp * 0.01) * 8;
      const shakeY = Math.cos(timestamp * 0.01) * 5;
      ctx.translate(shakeX, shakeY);
    }

    if (config.animations.includes('pulse')) {
      const scale = 1 + Math.sin(timestamp * 0.005) * 0.15;
      ctx.scale(scale, scale);
    }

    if (config.animations.includes('pixelate') && selectedNiche === 'minecraft') {
      // Pixelated text effect for Minecraft
      ctx.imageSmoothingEnabled = false;
    }

    // Enhanced text styling based on quality
    const fontSize = quality === '4K' ? 64 : quality === '1080p' ? 48 : 32;
    ctx.font = `bold ${fontSize}px ${config.font || 'Arial'}`;
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = quality === '4K' ? 4 : quality === '1080p' ? 3 : 2;

    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Word wrap with enhanced spacing
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = canvas.width - 120;

    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);

    // Draw lines with typewriter effect
    lines.forEach((line, index) => {
      const y = centerY + (index - lines.length / 2) * (fontSize + 10);
      const delay = index * 800;
      const opacity = Math.min(1, Math.max(0, (timestamp - delay) / 1200));
      
      ctx.globalAlpha = opacity;
      ctx.strokeText(line, centerX, y);
      ctx.fillText(line, centerX, y);
    });

    ctx.restore();
  };

  const drawHook = (ctx, hook, timestamp) => {
    const canvas = canvasRef.current;
    
    ctx.save();
    const fontSize = quality === '4K' ? 56 : quality === '1080p' ? 42 : 28;
    ctx.font = `bold ${fontSize}px ${config.font || 'Arial'}`;
    ctx.fillStyle = config.accentColor;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = quality === '4K' ? 4 : 3;

    // Enhanced pulsing effect
    const scale = 1 + Math.sin(timestamp * 0.008) * 0.2;
    ctx.scale(scale, scale);

    // Add glow effect
    ctx.shadowColor = config.accentColor;
    ctx.shadowBlur = 20;

    const words = hook.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = canvas.width - 80;

    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);

    lines.forEach((line, index) => {
      const y = 120 + index * (fontSize + 15);
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
    });

    ctx.restore();
  };

  const drawCTA = (ctx, cta, timestamp) => {
    const canvas = canvasRef.current;
    
    ctx.save();
    const fontSize = quality === '4K' ? 48 : quality === '1080p' ? 36 : 24;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    
    // Enhanced button with better positioning
    const buttonY = canvas.height - 200;
    const buttonWidth = Math.min(600, canvas.width - 80);
    const buttonHeight = fontSize + 40;
    const buttonX = (canvas.width - buttonWidth) / 2;

    // Animated glow with rainbow effect for certain niches
    const glowIntensity = 0.7 + Math.sin(timestamp * 0.01) * 0.3;
    if (selectedNiche === 'funny') {
      const hue = (timestamp * 0.1) % 360;
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
    } else {
      ctx.shadowColor = config.accentColor;
    }
    ctx.shadowBlur = 30 * glowIntensity;
    
    // Gradient button background
    const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
    gradient.addColorStop(0, config.accentColor);
    gradient.addColorStop(1, config.backgroundColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Button border
    ctx.strokeStyle = config.textColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Button text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.fillText(cta, canvas.width / 2, buttonY + buttonHeight / 2 + fontSize / 3);

    ctx.restore();
  };

  const drawParticleEffects = (ctx, timestamp) => {
    const canvas = canvasRef.current;
    
    switch (config.particles) {
      case 'stars':
        for (let i = 0; i < 15; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const opacity = Math.sin(timestamp * 0.01 + i) * 0.5 + 0.5;
          
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        break;
        
      case 'confetti':
        for (let i = 0; i < 20; i++) {
          const x = (timestamp * 0.5 + i * 50) % (canvas.width + 20);
          const y = (timestamp * 0.3 + i * 30) % (canvas.height + 20);
          const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
          
          ctx.fillStyle = colors[i % colors.length];
          ctx.fillRect(x, y, 8, 8);
        }
        break;
        
      case 'blood':
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * canvas.width;
          const y = (timestamp * 0.2 + i * 100) % (canvas.height + 50);
          
          ctx.fillStyle = '#8b0000';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }
  };

  const startRecording = () => {
    if (!script || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);

    try {
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: currentQuality.bitrate
      };

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        onVideoGenerated?.(blob);
      };

      setIsRecording(true);
      setProgress(0);
      setCurrentFrame(0);
      mediaRecorder.start();

      // Enhanced animation loop
      const frameDuration = 3500;
      const totalDuration = (script.frames?.length || 1) * frameDuration;
      let startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min(100, (elapsed / totalDuration) * 100);
        setProgress(progressPercent);

        const frameIndex = Math.floor(elapsed / frameDuration);
        setCurrentFrame(frameIndex);

        if (frameIndex < (script.frames?.length || 0)) {
          drawFrame(frameIndex, elapsed);
          setAnimationFrameId(requestAnimationFrame(animate));
        } else {
          stopRecording();
        }
      };

      setAnimationFrameId(requestAnimationFrame(animate));
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    setIsRecording(false);
  };

  const downloadVideo = () => {
    if (!videoBlob) return;

    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral-${selectedNiche}-${quality}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Video" size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-lg text-foreground">Enhanced Video Creator</h3>
        </div>
      </div>

      {/* Quality and Format Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Video Quality"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          options={[
            { value: '720p', label: '720p HD' },
            { value: '1080p', label: '1080p Full HD' },
            { value: '4K', label: '4K Ultra HD' }
          ]}
        />
        
        <Select
          label="Background Type"
          value={backgroundType}
          onChange={(e) => setBackgroundType(e.target.value)}
          options={[
            { value: 'gradient', label: 'Gradient' },
            { value: 'subway', label: 'Subway Surfers' },
            { value: 'minecraft', label: 'Minecraft' }
          ]}
        />
        
        <Select
          label="Export Format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={[
            { value: 'webm', label: 'WebM (Recommended)' },
            { value: 'mp4', label: 'MP4 (Universal)' }
          ]}
        />
      </div>

      {/* Canvas Container */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-h-[600px] object-contain"
        />
        
        {isRecording && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white font-bold">Creating {quality} Video...</p>
              <p className="text-primary text-sm">{Math.round(progress)}%</p>
              <div className="w-48 bg-gray-800 rounded-full h-2 mt-2">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={startRecording}
          disabled={!script || isRecording}
          variant="default"
          iconName="Play"
          className="flex-1 sm:flex-none"
        >
          {isRecording ? 'Recording...' : `Create ${quality} Video`}
        </Button>

        {videoBlob && (
          <>
            <Button
              onClick={downloadVideo}
              variant="outline"
              iconName="Download"
            >
              Download Video
            </Button>
            <Button
              variant="ghost"
              iconName="Play"
              onClick={() => {
                const url = URL.createObjectURL(videoBlob);
                window.open(url, '_blank');
              }}
            >
              Preview
            </Button>
          </>
        )}
      </div>

      {/* Video Preview */}
      {videoBlob && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Generated Video</h4>
          <video
            ref={videoRef}
            controls
            className="w-full max-w-md mx-auto rounded-lg"
            src={videoBlob ? URL.createObjectURL(videoBlob) : undefined}
          />
          <div className="text-sm text-muted-foreground text-center">
            Quality: {quality} • Format: {format.toUpperCase()} • Ready for upload
          </div>
        </div>
      )}

      {/* Enhanced Technical Info */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Info" size={16} />
          <span>Video Specifications</span>
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Resolution:</span>
            <span className="ml-2 text-foreground">{currentQuality.width}x{currentQuality.height}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Bitrate:</span>
            <span className="ml-2 text-foreground">{(currentQuality.bitrate / 1000000).toFixed(1)}Mbps</span>
          </div>
          <div>
            <span className="text-muted-foreground">Frame Rate:</span>
            <span className="ml-2 text-foreground">30 FPS</span>
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <span className="ml-2 text-foreground">{((script?.frames?.length || 0) * 3.5).toFixed(1)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoCreator;