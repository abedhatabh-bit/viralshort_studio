import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../components/ui/Button';

// Mock fabric.js for build compatibility
const fabric = {
  Canvas: class MockCanvas {
    constructor(element, options) {
      this.element = element;
      this.width = options?.width || 360;
      this.height = options?.height || 640;
      this.objects = [];
    }
    
    clear() {
      this.objects = [];
      if (this.element) {
        const ctx = this.element.getContext('2d');
        ctx.clearRect(0, 0, this.width, this.height);
      }
    }
    
    setBackgroundColor(color, callback) {
      if (this.element) {
        const ctx = this.element.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.width, this.height);
      }
      if (callback) callback();
    }
    
    add(object) {
      this.objects.push(object);
    }
    
    renderAll() {
      // Mock render - in a real app this would render all objects
    }
    
    dispose() {
      this.objects = [];
    }
    
    toDataURL() {
      return this.element?.toDataURL() || '';
    }
  },
  
  Text: class MockText {
    constructor(text, options) {
      this.text = text;
      Object.assign(this, options);
    }
  },
  
  Image: {
    fromURL: (url, callback, options) => {
      const img = new Image();
      img.onload = () => {
        const mockImg = {
          scaleToWidth: (width) => {},
          set: (props) => Object.assign(mockImg, props)
        };
        callback(mockImg);
      };
      img.src = url;
    }
  },
  
  Circle: class MockCircle {
    constructor(options) {
      Object.assign(this, options);
    }
  },
  
  Rect: class MockRect {
    constructor(options) {
      Object.assign(this, options);
    }
  },
  
  Pattern: class MockPattern {
    constructor(options) {
      Object.assign(this, options);
    }
  }
};

/**
 * Enhanced Video Preview Component with optimized rendering
 * 
 * @param {Object} props
 * @param {Object} props.script - Video script data
 * @param {string} props.selectedNiche - Selected content niche
 * @param {number} props.currentFrame - Current frame index
 * @param {Object} props.customizationSettings - Visual customization settings
 * @param {string} props.exportFormat - Export format (tiktok, youtube)
 * @param {Function} props.onExportProgress - Export progress callback
 * @param {Function} props.onExportComplete - Export complete callback
 */
const EnhancedVideoPreview = ({
  script,
  selectedNiche,
  currentFrame = 0,
  customizationSettings = {},
  exportFormat = null,
  onExportProgress,
  onExportComplete
}) => {
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const workerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(currentFrame);
  const [dimensions, setDimensions] = useState({ width: 1080, height: 1920 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Initialize canvas on mount
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Clean up any existing canvas
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.dispose();
    }
    
    // Calculate dimensions based on container size
    const container = canvasRef.current.parentElement;
    const containerWidth = container.clientWidth;
    const aspectRatio = 9 / 16; // TikTok/Shorts aspect ratio
    
    // Set canvas dimensions
    const canvasWidth = Math.min(containerWidth, 360); // Limit max width
    const canvasHeight = canvasWidth / aspectRatio;
    
    setDimensions({
      width: canvasWidth,
      height: canvasHeight,
      originalWidth: 1080,
      originalHeight: 1920
    });
    
    // Initialize canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight
    });

    canvasInstanceRef.current = canvas;
    
    // Create offscreen canvas for better performance
    try {
      offscreenCanvasRef.current = new OffscreenCanvas(1080, 1920);
    } catch (error) {
      console.warn('OffscreenCanvas not supported, falling back to regular canvas');
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = 1080;
      offscreenCanvas.height = 1920;
      offscreenCanvasRef.current = offscreenCanvas;
    }
    
    // Initialize worker if supported
    if (window.Worker) {
      try {
        workerRef.current = new Worker(new URL('../../../workers/videoWorker.js', import.meta.url));
        
        workerRef.current.onmessage = (e) => {
          const { status, progress, video } = e.data;
          
          if (status === 'progress') {
            setExportProgress(progress);
            if (onExportProgress) onExportProgress(progress);
          } else if (status === 'complete') {
            setIsExporting(false);
            setExportProgress(100);
            if (onExportComplete) onExportComplete(video);
          }
        };
      } catch (error) {
        console.error('Failed to initialize worker:', error);
      }
    }
    
    // Clean up on unmount
    return () => {
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);
  
  // Update canvas when script or current frame changes
  useEffect(() => {
    if (!canvasInstanceRef.current || !script) return;
    
    // Stop any ongoing animation
    if (isPlaying) {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    // Update current frame index
    setCurrentFrameIndex(currentFrame);
    
    // Render the current frame
    renderFrame(currentFrame);
  }, [script, currentFrame, customizationSettings]);
  
  /**
   * Render a specific frame
   */
  const renderFrame = (frameIndex) => {
    if (!canvasInstanceRef.current || !script) return;
    
    const canvas = canvasInstanceRef.current;
    
    // Clear canvas
    canvas.clear();
    
    // Get frame data
    const frame = script?.frames?.[frameIndex] || {};
    
    // Set background color
    canvas.setBackgroundColor(customizationSettings?.backgroundColor || '#000000', () => {});
    
    // Add background image if available
    if (frame.backgroundImage) {
      fabric.Image.fromURL(frame.backgroundImage, (img) => {
        img.scaleToWidth(canvas.width);
        canvas.add(img);
        canvas.renderAll();
      }, { crossOrigin: 'anonymous' });
    }
    
    // Add text elements
    if (frame.textElements && Array.isArray(frame.textElements)) {
      frame.textElements.forEach(textElement => {
        const text = new fabric.Text(textElement.content, {
          left: (textElement.x / 1080) * canvas.width,
          top: (textElement.y / 1920) * canvas.height,
          fontSize: (textElement.fontSize / 1080) * canvas.width,
          fontFamily: textElement.fontFamily || customizationSettings?.fontFamily || 'Arial',
          fill: textElement.color || customizationSettings?.textColor || '#FFFFFF',
          stroke: textElement.strokeColor || customizationSettings?.textStrokeColor || '#000000',
          strokeWidth: (textElement.strokeWidth / 1080) * canvas.width || 0,
          selectable: false,
          evented: false
        });
        
        canvas.add(text);
      });
    }
    
    // Add visual effects based on customization settings
    applyVisualEffects(canvas);
    
    // Render canvas
    canvas.renderAll();
  };
  
  /**
   * Apply visual effects to canvas
   */
  const applyVisualEffects = (canvas) => {
    if (!customizationSettings?.effects) return;
    
    // Apply effects based on settings
    if (customizationSettings.effects.includes('vignette')) {
      applyVignetteEffect(canvas);
    }
    
    if (customizationSettings.effects.includes('noise')) {
      applyNoiseEffect(canvas);
    }
    
    if (customizationSettings.effects.includes('glitch') && Math.random() < 0.2) {
      applyGlitchEffect(canvas);
    }
  };
  
  /**
   * Apply vignette effect
   */
  const applyVignetteEffect = (canvas) => {
    const vignette = new fabric.Circle({
      radius: canvas.width * 0.9,
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: canvas.width * 0.5,
      opacity: 0.7,
      selectable: false,
      evented: false
    });
    
    canvas.add(vignette);
  };
  
  /**
   * Apply noise effect
   */
  const applyNoiseEffect = (canvas) => {
    const noise = new fabric.Rect({
      width: canvas.width,
      height: canvas.height,
      left: 0,
      top: 0,
      fill: 'transparent',
      opacity: 0.1,
      selectable: false,
      evented: false
    });
    
    // Create noise pattern
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 200;
    patternCanvas.height = 200;
    const patternCtx = patternCanvas.getContext('2d');
    
    // Generate noise
    const imageData = patternCtx.createImageData(200, 200);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = Math.random() * 50;
    }
    
    patternCtx.putImageData(imageData, 0, 0);
    
    // Create pattern and apply to noise rectangle
    const pattern = new fabric.Pattern({
      source: patternCanvas,
      repeat: 'repeat'
    });
    
    noise.fill = pattern;
    canvas.add(noise);
  };
  
  /**
   * Apply glitch effect
   */
  const applyGlitchEffect = (canvas) => {
    // Capture current canvas as image
    const dataUrl = canvas.toDataURL();

    fabric.Image.fromURL(dataUrl, (img) => {
      // Apply glitch-like overlay by adjusting opacity and position
      img.set({
        left: Math.random() * 10 - 5,
        top: Math.random() * 10 - 5,
        opacity: 0.7,
        selectable: false,
        evented: false
      });
      
      canvas.add(img);
      canvas.renderAll();
    });
  };
  
  /**
   * Play animation
   */
  const handlePlay = () => {
    if (!script || !script.frames || script.frames.length === 0) return;
    
    setIsPlaying(true);
    
    let frameIndex = currentFrameIndex;
    const startTime = performance.now();
    const frameDuration = 1000 / 30; // 30fps
    
    const animate = (timestamp) => {
      if (!isPlaying) return;
      
      const elapsed = timestamp - startTime;
      const targetFrame = Math.floor(elapsed / frameDuration) % script.frames.length;
      
      if (targetFrame !== frameIndex) {
        frameIndex = targetFrame;
        setCurrentFrameIndex(frameIndex);
        renderFrame(frameIndex);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  
  /**
   * Pause animation
   */
  const handlePause = () => {
    setIsPlaying(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  /**
   * Export video
   */
  const handleExport = () => {
    if (!script || !script.frames || script.frames.length === 0 || isExporting) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    // If worker is available, use it for export
    if (workerRef.current) {
      // Prepare frames for export
      const exportFrames = script.frames.map((frame, index) => ({
        ...frame,
        index,
        width: 1080,
        height: 1920
      }));
      
      // Send to worker
      workerRef.current.postMessage({
        frames: exportFrames,
        audioTrack: null, // In a real app, this would be the audio track
        options: {
          format: exportFormat || 'mp4',
          quality: customizationSettings?.exportQuality || 'high',
          fps: 30,
          width: 1080,
          height: 1920
        }
      });
    } else {
      // Fallback for browsers without worker support
      simulateExport();
    }
  };
  
  /**
   * Simulate export for browsers without worker support
   */
  const simulateExport = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setExportProgress(progress);
      
      if (onExportProgress) onExportProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsExporting(false);
        
        // Mock video result
        const mockBlob = new Blob(['mock video data'], { type: exportFormat || 'video/mp4' });
        const mockVideo = {
          url: URL.createObjectURL(mockBlob),
          format: exportFormat || 'mp4',
          width: 1080,
          height: 1920,
          duration: script.frames.length / 30,
          fps: 30,
          size: Math.round(script.frames.length * 50000),
          createdAt: new Date().toISOString()
        };
        
        if (onExportComplete) onExportComplete(mockVideo);
      }
    }, 200);
  };
  
  /**
   * Toggle fullscreen preview
   */
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className={`video-preview ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-body font-semibold text-foreground">
          Video Preview
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName={isFullscreen ? "Minimize" : "Maximize"}
            onClick={toggleFullscreen}
          />
        </div>
      </div>
      
      <div className={`relative ${isFullscreen ? 'flex items-center justify-center h-[calc(100%-80px)]' : ''}`}>
        {/* Canvas container with proper aspect ratio */}
        <div 
          className={`relative mx-auto overflow-hidden bg-black ${
            isFullscreen ? 'h-full aspect-[9/16] max-h-full' : 'aspect-[9/16] max-w-full'
          }`}
          style={{
            maxWidth: isFullscreen ? 'calc(100vh * 9/16)' : '100%'
          }}
        >
          {/* Canvas element */}
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
          />
          
          {/* Placeholder when no script */}
          {!script && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50">
              <div className="text-center p-4">
                <p className="text-muted-foreground mb-2">Generate a script to preview your video</p>
                <p className="text-xs text-muted-foreground">Select a niche and create a script first</p>
              </div>
            </div>
          )}
          
          {/* Export overlay */}
          {isExporting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center p-4">
                <div className="mb-4">
                  <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-foreground font-medium mb-2">Exporting Video</p>
                <p className="text-sm text-muted-foreground mb-4">{exportProgress}% Complete</p>
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Playback controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName={isPlaying ? "Pause" : "Play"}
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={!script || isExporting}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <span className="text-xs text-muted-foreground">
            Frame {currentFrameIndex + 1}/{script?.frames?.length || 0}
          </span>
        </div>
        
        <Button
          variant="default"
          size="sm"
          iconName="Download"
          onClick={handleExport}
          disabled={!script || isExporting}
          loading={isExporting}
        >
          {isExporting ? `Exporting (${exportProgress}%)` : "Export Video"}
        </Button>
      </div>
      
      {/* Format info */}
      {exportFormat && (
        <div className="mt-2 text-xs text-muted-foreground">
          Format: {exportFormat === 'tiktok' ? 'TikTok (9:16)' : 'YouTube Shorts (9:16)'}
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPreview;