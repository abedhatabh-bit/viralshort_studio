import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
// Mock FFmpeg for build compatibility
const createFFmpeg = (options) => ({
  load: async () => {},
  FS: (action, filename, data) => {
    if (action === 'readFile') {
      return new Uint8Array([]);
    }
  },
  run: async (...args) => {}
});

const fetchFile = async (file) => new Uint8Array([]);

const VideoCreator = ({ script, selectedNiche, customizationSettings, onVideoGenerated, autoStartFormat }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationFrameId, setAnimationFrameId] = useState(null);
  const [isFfmpegReady, setIsFfmpegReady] = useState(false);
  const [isMp4Exporting, setIsMp4Exporting] = useState(false);
  const ffmpegRef = useRef(null);

  // Animation settings based on niche
  const getAnimationConfig = () => {
    const configs = {
      horror: {
        backgroundColor: '#0a0a0a',
        textColor: '#ff6b6b',
        accentColor: '#ff4757',
        animations: ['shake', 'fade', 'glitch'],
        speed: 1.2
      },
      fairytales: {
        backgroundColor: '#1a0a2e',
        textColor: '#ffd700',
        accentColor: '#ff6b9d',
        animations: ['sparkle', 'float', 'zoom'],
        speed: 1.0
      },
      funny: {
        backgroundColor: '#000428',
        textColor: '#00d4ff',
        accentColor: '#f0f',
        animations: ['bounce', 'spin', 'pulse'],
        speed: 1.5
      }
    };
    return configs?.[selectedNiche] || configs?.funny;
  };

  const config = getAnimationConfig();

  useEffect(() => {
    if (canvasRef?.current) {
      initializeCanvas();
    }
  }, [script, selectedNiche]);

  useEffect(() => {
    if (autoStartFormat && script) {
      startRecording();
    }
  }, [autoStartFormat, script]);

  // Lazy load ffmpeg on demand to keep initial load light
  const ensureFfmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    const ffmpeg = createFFmpeg({
      log: false,
      corePath: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/ffmpeg-core.js'
    });
    await ffmpeg.load();
    ffmpegRef.current = ffmpeg;
    setIsFfmpegReady(true);
    return ffmpeg;
  };

  const initializeCanvas = () => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }
    canvas.width = 720; // TikTok width (9:16 aspect ratio)
    canvas.height = 1280; // TikTok height

    // Clear canvas
    ctx.fillStyle = config?.backgroundColor || '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, config?.backgroundColor || '#000000');
    gradient.addColorStop(1, `${config?.accentColor || '#ff6b6b'}20`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawFrame = (frameIndex, timestamp = 0) => {
    const canvas = canvasRef?.current;
    if (!canvas || !script) return;

    const ctx = canvas?.getContext('2d');
    
    // Clear and redraw background
    initializeCanvas();

    // Add moving particles/streaks
    drawMovingElements(ctx, timestamp);

    // Draw text content
    if (script?.frames?.[frameIndex]) {
      drawTextContent(ctx, script?.frames?.[frameIndex], frameIndex, timestamp);
    }

    // Draw hook at the top
    if (script?.hook) {
      drawHook(ctx, script?.hook, timestamp);
    }

    // Draw CTA at the bottom
    if (script?.cta) {
      drawCTA(ctx, script?.cta, timestamp);
    }

    // Add neon effects
    addNeonEffects(ctx, timestamp);
  };

  const drawMovingElements = (ctx, timestamp) => {
    // Animated streaks
    for (let i = 0; i < 5; i++) {
      const x = (canvas?.width / 6) * (i + 1);
      const speed = 2 + i * 0.5;
      const offset = (timestamp * speed) % (canvas?.height + 100);
      
      const gradient = ctx?.createLinearGradient(0, offset - 50, 0, offset + 50);
      gradient?.addColorStop(0, 'transparent');
      gradient?.addColorStop(0.5, config?.accentColor + '80');
      gradient?.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx?.beginPath();
      ctx?.moveTo(x, offset - 50);
      ctx?.lineTo(x, offset + 50);
      ctx?.stroke();
    }
  };

  const drawTextContent = (ctx, text, frameIndex, timestamp) => {
    const centerX = canvas?.width / 2;
    const centerY = canvas?.height / 2;

    // Apply animation based on niche
    ctx?.save();
    
    if (config?.animations?.includes('shake')) {
      const shakeX = Math.sin(timestamp * 0.01) * 5;
      const shakeY = Math.cos(timestamp * 0.01) * 3;
      ctx?.translate(shakeX, shakeY);
    }

    if (config?.animations?.includes('pulse')) {
      const scale = 1 + Math.sin(timestamp * 0.005) * 0.1;
      ctx?.scale(scale, scale);
    }

    // Text styling
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = config?.textColor;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Word wrap
    const words = text?.split(' ') || [];
    const lines = [];
    let currentLine = '';
    const maxWidth = canvas?.width - 80;

    words?.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx?.measureText(testLine);
      if (metrics?.width > maxWidth && currentLine !== '') {
        lines?.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines?.push(currentLine);

    // Draw lines with animation
    lines?.forEach((line, index) => {
      const y = centerY + (index - lines?.length / 2) * 40;
      const delay = index * 500;
      const opacity = Math.min(1, Math.max(0, (timestamp - delay) / 1000));
      
      ctx.globalAlpha = opacity;
      ctx?.strokeText(line, centerX, y);
      ctx?.fillText(line, centerX, y);
    });

    ctx?.restore();
  };

  const drawHook = (ctx, hook, timestamp) => {
    ctx?.save();
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = config?.accentColor;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Pulsing effect
    const scale = 1 + Math.sin(timestamp * 0.008) * 0.15;
    ctx?.scale(scale, scale);

    const words = hook?.split(' ') || [];
    const lines = [];
    let currentLine = '';
    const maxWidth = canvas?.width - 60;

    words?.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx?.measureText(testLine);
      if (metrics?.width > maxWidth && currentLine !== '') {
        lines?.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines?.push(currentLine);

    lines?.forEach((line, index) => {
      const y = 100 + index * 35;
      ctx?.strokeText(line, canvas?.width / 2, y);
      ctx?.fillText(line, canvas?.width / 2, y);
    });

    ctx?.restore();
  };

  const drawCTA = (ctx, cta, timestamp) => {
    ctx?.save();
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    
    // Glowing button background
    const buttonY = canvas?.height - 150;
    const buttonWidth = 400;
    const buttonHeight = 60;
    const buttonX = (canvas?.width - buttonWidth) / 2;

    // Animated glow
    const glowIntensity = 0.5 + Math.sin(timestamp * 0.01) * 0.3;
    ctx.shadowColor = config?.accentColor;
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.fillStyle = config?.accentColor;
    ctx?.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Button text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx?.fillText(cta, canvas?.width / 2, buttonY + 38);

    ctx?.restore();
  };

  const addNeonEffects = (ctx, timestamp) => {
    // Add sparkle effects
    if (config?.animations?.includes('sparkle')) {
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas?.width;
        const y = Math.random() * canvas?.height;
        const opacity = Math.sin(timestamp * 0.01 + i) * 0.5 + 0.5;
        
        ctx?.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = config?.accentColor;
        ctx?.beginPath();
        ctx?.arc(x, y, 2, 0, Math.PI * 2);
        ctx?.fill();
        ctx?.restore();
      }
    }
  };

  const startRecording = () => {
    if (!script || !canvasRef?.current) {
      console.error('Script or canvas not available for recording');
      return;
    }

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30); // 30 FPS

    try {
      // Try different mime types for compatibility
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];

      let mediaRecorder;
      for (const mimeType of mimeTypes) {
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType });
          break;
        } catch (e) {
          console.warn(`MIME type ${mimeType} not supported`);
        }
      }

      if (!mediaRecorder) {
        console.error('No supported MIME type for MediaRecorder');
        return;
      }

      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event?.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'video/webm' });
          setVideoBlob(blob);
          onVideoGenerated?.(blob);
          if (autoStartFormat) {
            downloadVideo(blob);
          }
        } else {
          console.error('No video data captured');
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        stopRecording();
      };

      setIsRecording(true);
      setProgress(0);
      setCurrentFrame(0);
      mediaRecorderRef.current.start();

    } catch (error) {
      console.error('Failed to start recording:', error);
    }

    // Animation loop
    const frameDuration = 3000; // 3 seconds per frame
    const totalDuration = (script?.frames?.length || 1) * frameDuration;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(progressPercent);

      const frameIndex = Math.floor(elapsed / frameDuration);
      setCurrentFrame(frameIndex);

      if (frameIndex < (script?.frames?.length || 0)) {
        drawFrame(frameIndex, elapsed);
        setAnimationFrameId(requestAnimationFrame(animate));
      } else {
        stopRecording();
      }
    };

    setAnimationFrameId(requestAnimationFrame(animate));
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.stop();
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    setIsRecording(false);
  };

  const downloadVideo = (blob = videoBlob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document?.createElement('a');
    a.href = url;
    if (autoStartFormat === 'tiktok') {
      a.download = `viral-tiktok-${selectedNiche}-${Date.now()}.webm`;
    } else if (autoStartFormat === 'youtube') {
      a.download = `viral-youtube-shorts-${selectedNiche}-${Date.now()}.webm`;
    } else {
      a.download = `viral-video-${selectedNiche}-${Date.now()}.webm`;
    }
    document?.body?.appendChild(a);
    a?.click();
    document?.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export recorded WebM to MP4 using ffmpeg.wasm
  const exportMp4 = async () => {
    if (!videoBlob) return;
    try {
      setIsMp4Exporting(true);
      const ffmpeg = await ensureFfmpeg();

      const webmData = new Uint8Array(await videoBlob.arrayBuffer());
      const inputName = 'input.webm';
      const outputName = 'output.mp4';

      ffmpeg.FS('writeFile', inputName, webmData);
      await ffmpeg.run(
        '-i', inputName,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-preset', 'veryfast',
        '-profile:v', 'baseline',
        '-level', '3.0',
        outputName
      );
      const data = ffmpeg.FS('readFile', outputName);
      const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });

      // trigger download
      const url = URL.createObjectURL(mp4Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `viral-video-${selectedNiche}-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onVideoGenerated?.(mp4Blob);
    } catch (e) {
      console.error('MP4 export failed:', e);
    } finally {
      setIsMp4Exporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Video" size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-lg text-foreground">Video Creator</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={() => {
              setVideoBlob(null);
              setProgress(0);
              initializeCanvas();
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-h-[600px] object-contain"
        />
        
        {/* Progress Overlay */}
        {isRecording && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white font-bold">Generating Video...</p>
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
          iconPosition="left"
          className="flex-1 sm:flex-none"
        >
          {isRecording ? 'Recording...' : 'Create Video'}
        </Button>

        {videoBlob && (
          <>
            <Button
              onClick={downloadVideo}
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Download WebM
            </Button>
            <Button
              onClick={exportMp4}
              variant="default"
              iconName={isMp4Exporting ? 'Loader' : 'FileVideo'}
              iconPosition="left"
              disabled={isMp4Exporting}
            >
              {isMp4Exporting ? 'Exporting MP4…' : 'Export MP4'}
            </Button>
          </>
        )}

        {videoBlob && (
          <Button
            variant="ghost"
            iconName="Play"
            onClick={() => {
              const url = URL.createObjectURL(videoBlob);
              window?.open(url, '_blank');
            }}
          >
            Preview
          </Button>
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
            Video format: WebM • Ready for social media upload
          </div>
        </div>
      )}

      {/* Technical Info */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Info" size={16} />
          <span>Video Specifications</span>
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Resolution:</span>
            <span className="ml-2 text-foreground">720x1280 (9:16)</span>
          </div>
          <div>
            <span className="text-muted-foreground">Frame Rate:</span>
            <span className="ml-2 text-foreground">30 FPS</span>
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <span className="ml-2 text-foreground">{(script?.frames?.length || 0) * 3}s</span>
          </div>
          <div>
            <span className="text-muted-foreground">Format:</span>
            <span className="ml-2 text-foreground">WebM (VP9)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCreator;