import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkingVideoCreator = ({ script, selectedNiche, customizationSettings, onVideoGenerated }) => {
  const canvasRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [quality, setQuality] = useState('1080p');
  const [backgroundStyle, setBackgroundStyle] = useState('subway');

  const qualitySettings = {
    '720p': { width: 720, height: 1280, bitrate: 2500000 },
    '1080p': { width: 1080, height: 1920, bitrate: 5000000 },
    '4K': { width: 2160, height: 3840, bitrate: 15000000 }
  };

  const backgroundStyles = {
    subway: {
      primary: '#1e3a8a',
      secondary: '#fbbf24', 
      accent: '#10b981',
      name: 'Subway Surfers'
    },
    minecraft: {
      primary: '#0f172a',
      secondary: '#22c55e',
      accent: '#f59e0b', 
      name: 'Minecraft'
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas();
    }
  }, [quality, backgroundStyle]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const settings = qualitySettings[quality];
    
    canvas.width = settings.width;
    canvas.height = settings.height;

    drawBackground(ctx, canvas);
  };

  const drawBackground = (ctx, canvas) => {
    const style = backgroundStyles[backgroundStyle];
    
    if (backgroundStyle === 'subway') {
      // Subway tunnel background
      ctx.fillStyle = style.primary;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Railway tracks
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 5) * i;
        ctx.strokeStyle = style.secondary;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    } else if (backgroundStyle === 'minecraft') {
      // Minecraft blocks background
      const blockSize = 60;
      const colors = [style.primary, '#1e293b', '#334155'];
      
      for (let x = 0; x < canvas.width; x += blockSize) {
        for (let y = 0; y < canvas.height; y += blockSize) {
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.fillRect(x, y, blockSize, blockSize);
          
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, blockSize, blockSize);
        }
      }
    }
  };

  const drawFrame = (frameIndex, timestamp = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || !script) return;

    const ctx = canvas.getContext('2d');
    const style = backgroundStyles[backgroundStyle];
    
    // Clear and redraw background
    drawBackground(ctx, canvas);

    // Add animated elements
    drawAnimatedElements(ctx, canvas, timestamp);

    // Draw text content
    if (script.frames && script.frames[frameIndex]) {
      drawText(ctx, canvas, script.frames[frameIndex], style);
    }

    // Draw hook
    if (script.hook) {
      drawHook(ctx, canvas, script.hook, style);
    }

    // Draw CTA
    if (script.cta) {
      drawCTA(ctx, canvas, script.cta, style);
    }
  };

  const drawAnimatedElements = (ctx, canvas, timestamp) => {
    const style = backgroundStyles[backgroundStyle];
    
    if (backgroundStyle === 'subway') {
      // Moving coins
      for (let i = 0; i < 6; i++) {
        const x = (canvas.width / 6) * i + 50;
        const y = (timestamp * 0.3 + i * 100) % (canvas.height + 50);
        
        ctx.fillStyle = style.secondary;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Shine effect
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x - 8, y - 8, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (backgroundStyle === 'minecraft') {
      // Falling blocks
      for (let i = 0; i < 4; i++) {
        const x = (canvas.width / 4) * i + 100;
        const y = (timestamp * 0.2 + i * 150) % (canvas.height + 40);
        
        ctx.fillStyle = style.secondary;
        ctx.fillRect(x, y, 40, 40);
        ctx.strokeStyle = style.accent;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, 40, 40);
      }
    }
  };

  const drawText = (ctx, canvas, text, style) => {
    const fontSize = quality === '4K' ? 72 : quality === '1080p' ? 54 : 36;
    
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    
    // Text shadow
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Word wrap
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

    // Draw lines
    const startY = canvas.height / 2 - (lines.length * (fontSize + 20)) / 2;
    lines.forEach((line, index) => {
      const y = startY + index * (fontSize + 20);
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
    });
  };

  const drawHook = (ctx, canvas, hook, style) => {
    const fontSize = quality === '4K' ? 64 : quality === '1080p' ? 48 : 32;
    
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = style.accent;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    
    ctx.shadowColor = style.accent;
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
      const y = 150 + index * (fontSize + 15);
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
    });
  };

  const drawCTA = (ctx, canvas, cta, style) => {
    const fontSize = quality === '4K' ? 48 : quality === '1080p' ? 36 : 24;
    
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    
    const buttonY = canvas.height - 200;
    const buttonWidth = Math.min(600, canvas.width - 80);
    const buttonHeight = fontSize + 40;
    const buttonX = (canvas.width - buttonWidth) / 2;

    // Button background
    ctx.fillStyle = style.accent;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Button border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Button text
    ctx.fillStyle = '#fff';
    ctx.fillText(cta, canvas.width / 2, buttonY + buttonHeight / 2 + fontSize / 3);
  };

  const startRecording = async () => {
    if (!script || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    try {
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: qualitySettings[quality].bitrate
      });

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

      // Animation loop
      const frameDuration = 3000;
      const totalFrames = script.frames?.length || 1;
      const totalDuration = totalFrames * frameDuration;
      let startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min(100, (elapsed / totalDuration) * 100);
        setProgress(progressPercent);

        const frameIndex = Math.floor(elapsed / frameDuration);
        setCurrentFrame(frameIndex);

        if (frameIndex < totalFrames) {
          drawFrame(frameIndex, elapsed);
          requestAnimationFrame(animate);
        } else {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      };

      requestAnimationFrame(animate);
    } catch (error) {
      console.error('Recording failed:', error);
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    if (!videoBlob) return;

    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-tips-${backgroundStyle}-${quality}-${Date.now()}.webm`;
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
          <h3 className="font-heading font-bold text-lg text-foreground">Health Tips Video Creator</h3>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Video Quality</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="720p">720p HD</option>
            <option value="1080p">1080p Full HD</option>
            <option value="4K">4K Ultra HD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Background Style</label>
          <select
            value={backgroundStyle}
            onChange={(e) => setBackgroundStyle(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="subway">Subway Surfers Theme</option>
            <option value="minecraft">Minecraft Theme</option>
          </select>
        </div>
      </div>

      {/* Canvas */}
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
            controls
            className="w-full max-w-md mx-auto rounded-lg"
            src={videoBlob ? URL.createObjectURL(videoBlob) : undefined}
          />
          <div className="text-sm text-muted-foreground text-center">
            Quality: {quality} • Background: {backgroundStyles[backgroundStyle].name} • Ready for upload
          </div>
        </div>
      )}

      {/* Specs */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Info" size={16} />
          <span>Video Specifications</span>
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Resolution:</span>
            <span className="ml-2 text-foreground">{qualitySettings[quality].width}x{qualitySettings[quality].height}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Background:</span>
            <span className="ml-2 text-foreground">{backgroundStyles[backgroundStyle].name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Bitrate:</span>
            <span className="ml-2 text-foreground">{(qualitySettings[quality].bitrate / 1000000).toFixed(1)}Mbps</span>
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <span className="ml-2 text-foreground">{((script?.frames?.length || 0) * 3).toFixed(1)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingVideoCreator;