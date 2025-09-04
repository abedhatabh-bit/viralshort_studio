/**
 * Video Worker
 * Handles video processing in a separate thread
 */

// Polyfill for OffscreenCanvas if needed
if (typeof OffscreenCanvas === 'undefined') {
  self.OffscreenCanvas = class OffscreenCanvas {
    constructor(width, height) {
      this.canvas = new self.Canvas(width, height);
      this.canvas.width = width;
      this.canvas.height = height;
      this.context = this.canvas.getContext('2d');
    }
    
    getContext(contextType) {
      return this.context;
    }
    
    convertToBlob(options) {
      return new Promise((resolve) => {
        this.canvas.toBlob(resolve, options?.type, options?.quality);
      });
    }
  };
}

// Import dependencies (in a real app, these would be properly imported)
// For this demo, we'll simulate the functionality

// Mock fabric.js functionality for the worker
class FabricCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.canvas = new OffscreenCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
    this.objects = [];
  }
  
  add(object) {
    this.objects.push(object);
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.objects = [];
  }
  
  setBackgroundColor(color) {
    this.backgroundColor = color;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  
  renderAll() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw background
    if (this.backgroundColor) {
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    // Draw all objects
    this.objects.forEach(obj => {
      if (obj.type === 'text') {
        this.ctx.font = `${obj.fontSize}px ${obj.fontFamily}`;
        this.ctx.fillStyle = obj.fill;
        this.ctx.textAlign = obj.textAlign || 'left';
        
        if (obj.strokeWidth && obj.strokeWidth > 0) {
          this.ctx.strokeStyle = obj.stroke;
          this.ctx.lineWidth = obj.strokeWidth;
          this.ctx.strokeText(obj.text, obj.left, obj.top);
        }
        
        this.ctx.fillText(obj.text, obj.left, obj.top);
      } else if (obj.type === 'image') {
        if (obj.image) {
          this.ctx.drawImage(
            obj.image,
            obj.left,
            obj.top,
            obj.width * obj.scaleX,
            obj.height * obj.scaleY
          );
        }
      } else if (obj.type === 'rect') {
        this.ctx.fillStyle = obj.fill;
        this.ctx.fillRect(obj.left, obj.top, obj.width, obj.height);
        
        if (obj.stroke && obj.strokeWidth) {
          this.ctx.strokeStyle = obj.stroke;
          this.ctx.lineWidth = obj.strokeWidth;
          this.ctx.strokeRect(obj.left, obj.top, obj.width, obj.height);
        }
      } else if (obj.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(
          obj.left + obj.radius,
          obj.top + obj.radius,
          obj.radius,
          0,
          2 * Math.PI
        );
        
        if (obj.fill !== 'transparent') {
          this.ctx.fillStyle = obj.fill;
          this.ctx.fill();
        }
        
        if (obj.stroke) {
          this.ctx.strokeStyle = obj.stroke;
          this.ctx.lineWidth = obj.strokeWidth || 1;
          this.ctx.stroke();
        }
      }
    });
  }
  
  toDataURL(format = 'image/png', quality = 1) {
    return this.canvas.toDataURL(format, quality);
  }
  
  async toBlob(format = 'image/png', quality = 1) {
    return await this.canvas.convertToBlob({ type: format, quality });
  }
}

// Mock Text object
class Text {
  constructor(text, options) {
    this.type = 'text';
    this.text = text;
    Object.assign(this, options);
  }
}

// Mock Image object
class Image {
  constructor(options) {
    this.type = 'image';
    Object.assign(this, options);
  }
  
  static async fromURL(url) {
    return new Promise((resolve, reject) => {
      const img = new self.Image();
      img.onload = () => {
        const image = new Image({
          image: img,
          width: img.width,
          height: img.height,
          left: 0,
          top: 0,
          scaleX: 1,
          scaleY: 1
        });
        resolve(image);
      };
      img.onerror = reject;
      img.src = url;
    });
  }
  
  scaleToWidth(width) {
    const scale = width / this.width;
    this.scaleX = scale;
    this.scaleY = scale;
  }
}

// Mock Rect object
class Rect {
  constructor(options) {
    this.type = 'rect';
    Object.assign(this, options);
  }
}

// Mock Circle object
class Circle {
  constructor(options) {
    this.type = 'circle';
    Object.assign(this, options);
  }
}

// Mock fabric namespace
const fabric = {
  Canvas: FabricCanvas,
  Text: Text,
  Image: Image,
  Rect: Rect,
  Circle: Circle
};

/**
 * Render a frame to canvas
 */
async function renderFrame(frame, width, height, customizationSettings = {}) {
  const canvas = new fabric.Canvas(width, height);
  
  // Set background color
  canvas.setBackgroundColor(customizationSettings?.backgroundColor || '#000000');
  
  // Add background image if available
  if (frame.backgroundImage) {
    try {
      const img = await fabric.Image.fromURL(frame.backgroundImage);
      img.scaleToWidth(canvas.width);
      canvas.add(img);
    } catch (error) {
      console.error('Failed to load background image:', error);
    }
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
        strokeWidth: (textElement.strokeWidth / 1080) * canvas.width || 0
      });
      
      canvas.add(text);
    });
  }
  
  // Apply visual effects based on customization settings
  if (customizationSettings?.effects) {
    if (customizationSettings.effects.includes('vignette')) {
      const vignette = new fabric.Circle({
        radius: canvas.width * 0.9,
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        fill: 'transparent',
        stroke: '#000000',
        strokeWidth: canvas.width * 0.5,
        opacity: 0.7
      });
      
      canvas.add(vignette);
    }
    
    if (customizationSettings.effects.includes('noise')) {
      const noise = new fabric.Rect({
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0,
        fill: '#FFFFFF',
        opacity: 0.05
      });
      
      canvas.add(noise);
    }
  }
  
  // Render canvas
  canvas.renderAll();
  
  return canvas;
}

/**
 * Process video frames and create video
 */
async function processVideo(frames, audioTrack, options) {
  try {
    const { width, height, fps, format, quality } = options;
    const frameCount = frames.length;
    const frameDuration = 1000 / fps;
    
    // Create array to store frame data
    const frameData = [];
    
    // Process each frame
    for (let i = 0; i < frameCount; i++) {
      // Report progress
      const progress = Math.round((i / frameCount) * 100);
      self.postMessage({ status: 'progress', progress });
      
      // Render frame
      const canvas = await renderFrame(frames[i], width, height, options.customizationSettings);
      
      // Get frame data
      const blob = await canvas.toBlob('image/jpeg', quality === 'high' ? 0.95 : 0.85);
      const arrayBuffer = await blob.arrayBuffer();
      
      // Store frame data
      frameData.push({
        data: arrayBuffer,
        duration: frameDuration
      });
      
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // In a real implementation, we would use WebCodecs API or a library like FFmpeg.wasm
    // to encode the frames into a video. For this demo, we'll simulate the process.
    
    // Simulate video encoding
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock video blob
    const videoBlob = new Blob(['mock video data'], { type: 'video/mp4' });
    
    // Create a mock video URL
    const videoUrl = URL.createObjectURL(videoBlob);
    
    // Return the result
    self.postMessage({
      status: 'complete',
      progress: 100,
      video: {
        url: videoUrl,
        format: format,
        width: width,
        height: height,
        duration: frameCount / fps,
        fps: fps,
        size: frameData.reduce((acc, frame) => acc + frame.data.byteLength, 0),
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    self.postMessage({
      status: 'error',
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  // Validate message origin and data
  if (!event.data || typeof event.data !== 'object') {
    self.postMessage({
      status: 'error',
      error: { message: 'Invalid message data' }
    });
    return;
  }
  
  const { frames, audioTrack, options, command } = event.data;
  
  // Handle cancel command
  if (command === 'cancel') {
    self.close();
    return;
  }
  
  // Validate required data
  if (!frames || !Array.isArray(frames) || frames.length === 0) {
    self.postMessage({
      status: 'error',
      error: { message: 'Invalid or missing frames data' }
    });
    return;
  }
  
  if (!options || typeof options !== 'object') {
    self.postMessage({
      status: 'error',
      error: { message: 'Invalid or missing options' }
    });
    return;
  }
  
  // Validate options
  const { width, height, fps } = options;
  if (!width || !height || !fps || width <= 0 || height <= 0 || fps <= 0) {
    self.postMessage({
      status: 'error',
      error: { message: 'Invalid video dimensions or frame rate' }
    });
    return;
  }
  
  // Process the video with validated data
  processVideo(frames, audioTrack, options);
});

// Notify that the worker is ready
self.postMessage({ status: 'ready' });