import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const TouchVideoEditor = ({ frames, onFrameUpdate, onGestureAction }) => {
  const [touchGestures, setTouchGestures] = useState({
    pinch: false,
    swipe: false,
    longPress: false
  });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedFrame, setSelectedFrame] = useState(0);
  const touchRef = useRef(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    const element = touchRef.current;
    if (!element) return;

    let initialDistance = 0;
    let initialScale = 1;
    let initialPosition = { x: 0, y: 0 };
    let touchStartTime = 0;

    const getTouchDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e) => {
      touchStartTime = Date.now();
      
      if (e.touches.length === 2) {
        // Pinch gesture
        initialDistance = getTouchDistance(e.touches);
        initialScale = scale;
        setTouchGestures(prev => ({ ...prev, pinch: true }));
      } else if (e.touches.length === 1) {
        // Single touch - potential swipe or long press
        initialPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        
        // Start long press timer
        longPressTimer.current = setTimeout(() => {
          setTouchGestures(prev => ({ ...prev, longPress: true }));
          onGestureAction?.('longPress', { frame: selectedFrame });
        }, 500);
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      
      if (e.touches.length === 2 && touchGestures.pinch) {
        // Pinch zoom
        const currentDistance = getTouchDistance(e.touches);
        const scaleChange = currentDistance / initialDistance;
        const newScale = Math.max(0.5, Math.min(3, initialScale * scaleChange));
        setScale(newScale);
      } else if (e.touches.length === 1) {
        // Swipe detection
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - initialPosition.x;
        const deltaY = currentY - initialPosition.y;
        
        if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
          setTouchGestures(prev => ({ ...prev, swipe: true }));
          
          // Clear long press timer
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
          
          // Determine swipe direction
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe - navigate frames
            if (deltaX > 0 && selectedFrame > 0) {
              setSelectedFrame(selectedFrame - 1);
              onFrameUpdate?.(selectedFrame - 1);
            } else if (deltaX < 0 && selectedFrame < frames.length - 1) {
              setSelectedFrame(selectedFrame + 1);
              onFrameUpdate?.(selectedFrame + 1);
            }
          }
          
          onGestureAction?.('swipe', { 
            direction: Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical',
            deltaX,
            deltaY
          });
        }
      }
    };

    const handleTouchEnd = (e) => {
      const touchDuration = Date.now() - touchStartTime;
      
      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      // Reset gesture states
      setTouchGestures({ pinch: false, swipe: false, longPress: false });
      
      // Handle tap
      if (touchDuration < 200 && e.changedTouches.length === 1) {
        onGestureAction?.('tap', { frame: selectedFrame });
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [scale, selectedFrame, frames.length, touchGestures.pinch, onFrameUpdate, onGestureAction]);

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Smartphone" size={16} />
        <span>Touch Editor</span>
      </h3>

      {/* Gesture Status */}
      <div className="flex items-center space-x-2 mb-4">
        <div className={`px-2 py-1 rounded text-xs ${
          touchGestures.pinch ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          Pinch: {touchGestures.pinch ? 'Active' : 'Inactive'}
        </div>
        <div className={`px-2 py-1 rounded text-xs ${
          touchGestures.swipe ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          Swipe: {touchGestures.swipe ? 'Active' : 'Inactive'}
        </div>
        <div className={`px-2 py-1 rounded text-xs ${
          touchGestures.longPress ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          Long Press: {touchGestures.longPress ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Touch Canvas */}
      <div
        ref={touchRef}
        className="relative w-full h-64 bg-background border border-border rounded-lg overflow-hidden touch-manipulation"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: 'center center'
        }}
      >
        {frames && frames[selectedFrame] && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">
                Frame {selectedFrame + 1} of {frames.length}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {frames[selectedFrame].text || 'No text content'}
              </div>
              <div className="text-xs text-muted-foreground">
                Pinch to zoom • Swipe to navigate • Long press for options
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Zoom: {Math.round(scale * 100)}%</span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            >
              <Icon name="ZoomOut" size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(1)}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.min(3, scale + 0.1))}
            >
              <Icon name="ZoomIn" size={14} />
            </Button>
          </div>
        </div>

        {/* Frame Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedFrame > 0) {
                setSelectedFrame(selectedFrame - 1);
                onFrameUpdate?.(selectedFrame - 1);
              }
            }}
            disabled={selectedFrame === 0}
          >
            <Icon name="ChevronLeft" size={14} />
          </Button>
          <div className="flex-1 text-center text-sm text-foreground">
            Frame {selectedFrame + 1} / {frames?.length || 0}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedFrame < frames.length - 1) {
                setSelectedFrame(selectedFrame + 1);
                onFrameUpdate?.(selectedFrame + 1);
              }
            }}
            disabled={selectedFrame >= frames.length - 1}
          >
            <Icon name="ChevronRight" size={14} />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGestureAction?.('edit', { frame: selectedFrame })}
          >
            <Icon name="Edit" size={14} className="mr-2" />
            Edit Frame
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGestureAction?.('duplicate', { frame: selectedFrame })}
          >
            <Icon name="Copy" size={14} className="mr-2" />
            Duplicate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TouchVideoEditor;