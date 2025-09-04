import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulletproofVideoCreator = ({ script, selectedNiche, customizationSettings, onVideoGenerated }) => {
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [quality, setQuality] = useState('1080p');
  const [backgroundStyle, setBackgroundStyle] = useState('subway');
  const [error, setError] = useState(null);
  const [systemReady, setSystemReady] = useState(false);

  // Quality configurations
  const qualityConfigs = {
    '720p': { width: 720, height: 1280, bitrate: 2500000, fontSize: 36 },
    '1080p': { width: 1080, height: 1920, bitrate: 5000000, fontSize: 54 },
    '4K': { width: 2160, height: 3840, bitrate: 15000000, fontSize: 108 }
  };

  // Background themes
  const backgroundThemes = {
    subway: {
      primary: '#1e3a8a',
      secondary: '#fbbf24',
      accent: '#10b981',
      name: 'Subway Surfers',
      particleColor: '#fbbf24'
    },
    minecraft: {
      primary: '#0f172a',
      secondary: '#22c55e',
      accent: '#f59e0b',
      name: 'Minecraft',
      particleColor: '#22c55e'
    }
  };

  // System compatibility check
  const checkSystemCompatibility = useCallback(() => {
    try {
      // Test Canvas API
      const testCanvas = document.createElement('canvas');
      const testCtx = testCanvas.getContext('2d');
      if (!testCtx) {
        throw new Error('Canvas 2D context not supported');
      }

      // Test MediaRecorder API
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder API not supported');
      }

      // Test stream capture
      testCanvas.width = 100;
      testCanvas.height = 100;
      if (!testCanvas.captureStream) {
        throw new Error('Canvas stream capture not supported');
      }

      // Test supported formats
      const supportedFormats = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ].filter(format => MediaRecorder.isTypeSupported(format));

      if (supportedFormats.length === 0) {
        throw new Error('No supported video formats');
      }

      setSystemReady(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      setSystemReady(false);
      return false;
    }
  }, []);

  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;

      const config = qualityConfigs[quality];
      canvas.width = config.width;
      canvas.height = config.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw initial background
      drawBackground(ctx, canvas, 0);
      
      return true;
    } catch (err) {
      console.error('Canvas initialization failed:', err);
      return false;
    }
  }, [quality]);

  // Draw background based on theme
  const drawBackground = (ctx, canvas, timestamp) => {
    const theme = backgroundThemes[backgroundStyle];
    
    try {
      if (backgroundStyle === 'subway') {
        // Subway tunnel background
        ctx.fillStyle = theme.primary;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Railway tracks
        const trackCount = 5;
        for (let i = 0; i < trackCount; i++) {
          const y = (canvas.height / trackCount) * i;
          ctx.strokeStyle = theme.secondary;
          ctx.lineWidth = Math.max(2, canvas.width / 360); // Responsive line width
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        // Moving train effect
        const trainX = (timestamp * 0.1) % (canvas.width + 200) - 200;
        ctx.fillStyle = theme.accent;
        ctx.fillRect(trainX, canvas.height * 0.7, 150, 80);
        
      } else if (backgroundStyle === 'minecraft') {
        // Minecraft blocks background
        const blockSize = Math.max(40, canvas.width / 27); // Responsive block size
        const colors = [theme.primary, '#1e293b', '#334155', '#475569'];
        
        for (let x = 0; x < canvas.width; x += blockSize) {
          for (let y = 0; y < canvas.height; y += blockSize) {
            const colorIndex = Math.floor((x + y) / blockSize) % colors.length;
            ctx.fillStyle = colors[colorIndex];
            ctx.fillRect(x, y, blockSize, blockSize);
            
            // Block borders
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, blockSize, blockSize);
          }
        }
      }
    } catch (err) {
      console.error('Background drawing failed:', err);
      // Fallback to solid color
      ctx.fillStyle = theme.primary;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Draw animated particles
  const drawParticles = (ctx, canvas, timestamp) => {
    const theme = backgroundThemes[backgroundStyle];
    
    try {
      if (backgroundStyle === 'subway') {
        // Falling coins
        const coinCount = Math.max(4, Math.floor(canvas.width / 180));
        for (let i = 0; i < coinCount; i++) {
          const x = (canvas.width / coinCount) * i + 50;
          const y = (timestamp * 0.3 + i * 100) % (canvas.height + 50);
          
          // Coin body
          ctx.fillStyle = theme.particleColor;
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.fill();
          
          // Coin shine
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x - 8, y - 8, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (backgroundStyle === 'minecraft') {
        // Falling blocks
        const blockCount = Math.max(3, Math.floor(canvas.width / 270));
        for (let i = 0; i < blockCount; i++) {
          const x = (canvas.width / blockCount) * i + 100;
          const y = (timestamp * 0.2 + i * 150) % (canvas.height + 40);
          
          // Block body
          ctx.fillStyle = theme.particleColor;
          ctx.fillRect(x, y, 40, 40);
          
          // Block border
          ctx.strokeStyle = theme.accent;
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, 40, 40);
        }
      }
    } catch (err) {
      console.error('Particle drawing failed:', err);
    }
  };

  // Draw text with proper formatting
  const drawText = (ctx, canvas, text, style = 'body') => {
    const config = qualityConfigs[quality];
    const theme = backgroundThemes[backgroundStyle];
    
    try {
      let fontSize = config.fontSize;
      if (style === 'hook') fontSize *= 1.2;
      if (style === 'cta') fontSize *= 0.8;
      
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = style === 'hook' ? theme.accent : '#ffffff';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(2, fontSize / 18);
      
      // Text shadow
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      // Word wrapping
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      const maxWidth = canvas.width - 120;

      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }

      // Draw lines
      const lineHeight = fontSize + 20;
      const totalHeight = lines.length * lineHeight;
      let startY;
      
      if (style === 'hook') {
        startY = 200;
      } else if (style === 'cta') {
        startY = canvas.height - 300;
      } else {
        startY = (canvas.height - totalHeight) / 2;
      }

      lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillText(line, canvas.width / 2, y);
      });
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
    } catch (err) {
      console.error('Text drawing failed:', err);
    }
  };

  // Draw complete frame
  const drawFrame = useCallback((frameIndex, timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas || !script) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      drawBackground(ctx, canvas, timestamp);
      
      // Draw particles
      drawParticles(ctx, canvas, timestamp);
      
      // Draw hook
      if (script.hook) {
        drawText(ctx, canvas, script.hook, 'hook');
      }
      
      // Draw current frame text
      if (script.frames && script.frames[frameIndex]) {
        drawText(ctx, canvas, script.frames[frameIndex], 'body');
      }
      
      // Draw CTA
      if (script.cta) {
        drawText(ctx, canvas, script.cta, 'cta');
      }
      
    } catch (err) {
      console.error('Frame drawing failed:', err);
      setError(`Frame drawing error: ${err.message}`);
    }
  }, [script, backgroundStyle, quality]);

  // Start video recording
  const startRecording = useCallback(async () => {
    if (!script || !systemReady) {
      setError('System not ready or no script available');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Canvas not available');
      return;
    }

    try {
      // Initialize canvas
      if (!initializeCanvas()) {
        setError('Failed to initialize canvas');
        return;
      }

      // Create stream
      const stream = canvas.captureStream(30);
      if (!stream) {
        setError('Failed to capture canvas stream');
        return;
      }

      // Find best supported format
      const formats = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];
      
      const supportedFormat = formats.find(format => 
        MediaRecorder.isTypeSupported(format)
      );

      if (!supportedFormat) {
        setError('No supported video format found');
        return;
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: supportedFormat,
        videoBitsPerSecond: qualityConfigs[quality].bitrate
      });

      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: supportedFormat });
          setVideoBlob(blob);
          onVideoGenerated?.(blob);
          setIsRecording(false);
        } catch (err) {
          setError(`Video creation failed: ${err.message}`);
          setIsRecording(false);
        }
      };

      mediaRecorder.onerror = (event) => {
        setError(`Recording error: ${event.error?.message || 'Unknown error'}`);
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      
      // Start recording
      setIsRecording(true);
      setProgress(0);
      setCurrentFrame(0);
      setError(null);
      mediaRecorder.start();

      // Animation loop
      const frameDuration = 3000; // 3 seconds per frame
      const totalFrames = script.frames?.length || 1;
      const totalDuration = totalFrames * frameDuration;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min(100, (elapsed / totalDuration) * 100);
        setProgress(progressPercent);

        const frameIndex = Math.floor(elapsed / frameDuration);
        setCurrentFrame(frameIndex);

        if (frameIndex < totalFrames && isRecording) {
          drawFrame(frameIndex, elapsed);
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

    } catch (err) {
      setError(`Recording setup failed: ${err.message}`);
      setIsRecording(false);
    }
  }, [script, systemReady, quality, initializeCanvas, drawFrame]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRecording(false);
  }, []);

  // Download video
  const downloadVideo = useCallback(() => {
    if (!videoBlob) return;

    try {
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-tips-${backgroundStyle}-${quality}-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    }
  }, [videoBlob, backgroundStyle, quality]);

  // Initialize on mount
  useEffect(() => {
    checkSystemCompatibility();
    initializeCanvas();
  }, [checkSystemCompatibility, initializeCanvas]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Video" size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-lg text-foreground">
            Bulletproof Video Creator
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="RefreshCw"
          onClick={checkSystemCompatibility}
        >
          Test System
        </Button>
      </div>

      {/* System Status */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-red-600" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              {error}
            </span>
          </div>
        </div>
      )}

      {systemReady && !error && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              System Ready - All features available
            </span>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Video Quality
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            disabled={isRecording}
          >
            <option value="720p">720p HD (720x1280)</option>
            <option value="1080p">1080p Full HD (1080x1920)</option>
            <option value="4K">4K Ultra HD (2160x3840)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Background Theme
          </label>
          <select
            value={backgroundStyle}
            onChange={(e) => setBackgroundStyle(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            disabled={isRecording}
          >
            <option value="subway">🚇 Subway Surfers</option>
            <option value="minecraft">⛏️ Minecraft</option>
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
              <p className="text-white text-xs">Frame {currentFrame + 1} of {script?.frames?.length || 0}</p>
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
          disabled={!script || !systemReady || isRecording || !!error}
          variant="default"
          iconName="Play"
        >
          {isRecording ? 'Recording...' : `Create ${quality} Video`}
        </Button>

        {isRecording && (
          <Button
            onClick={stopRecording}
            variant="destructive"
            iconName="Square"
          >
            Stop Recording
          </Button>
        )}

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
            src={URL.createObjectURL(videoBlob)}
          />
          <div className="text-sm text-muted-foreground text-center">
            Quality: {quality} • Theme: {backgroundThemes[backgroundStyle].name} • Ready for upload
          </div>
        </div>
      )}

      {/* Technical Info */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Info" size={16} />
          <span>Technical Specifications</span>
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Resolution:</span>
            <span className="ml-2 text-foreground">
              {qualityConfigs[quality].width}x{qualityConfigs[quality].height}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Bitrate:</span>
            <span className="ml-2 text-foreground">
              {(qualityConfigs[quality].bitrate / 1000000).toFixed(1)}Mbps
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Frame Rate:</span>
            <span className="ml-2 text-foreground">30 FPS</span>
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <span className="ml-2 text-foreground">
              {((script?.frames?.length || 0) * 3).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletproofVideoCreator;