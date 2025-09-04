import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const EnhancedCustomizationPanel = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    textColor: '#ffffff',
    backgroundColor: '#000000',
    accentColor: '#ff6b6b',
    fontSize: 'medium',
    animation: 'fade',
    duration: 3,
    enableParticles: true,
    enableGlow: true,
    enableShadow: true,
    fontFamily: 'Arial',
    textAlign: 'center',
    backgroundType: 'gradient',
    particleType: 'stars',
    animationSpeed: 'normal',
    quality: '1080p',
    aspectRatio: '9:16'
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const presetThemes = {
    horror: {
      textColor: '#ff6b6b',
      backgroundColor: '#0a0a0a',
      accentColor: '#ff4757',
      fontFamily: 'serif',
      particleType: 'blood',
      animation: 'shake'
    },
    gaming: {
      textColor: '#00ff00',
      backgroundColor: '#001100',
      accentColor: '#ffff00',
      fontFamily: 'monospace',
      particleType: 'pixels',
      animation: 'glitch'
    },
    modern: {
      textColor: '#ffffff',
      backgroundColor: '#1a1a1a',
      accentColor: '#007acc',
      fontFamily: 'sans-serif',
      particleType: 'dots',
      animation: 'fade'
    },
    subway: {
      textColor: '#fbbf24',
      backgroundColor: '#1e3a8a',
      accentColor: '#10b981',
      fontFamily: 'Orbitron',
      particleType: 'coins',
      animation: 'slide'
    },
    minecraft: {
      textColor: '#22c55e',
      backgroundColor: '#0f172a',
      accentColor: '#f59e0b',
      fontFamily: 'monospace',
      particleType: 'blocks',
      animation: 'pixelate'
    }
  };

  const applyPreset = (preset) => {
    const newSettings = { ...settings, ...presetThemes[preset] };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Palette" size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-lg text-foreground">Pro Customization</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={() => {
            const defaultSettings = {
              textColor: '#ffffff',
              backgroundColor: '#000000',
              accentColor: '#ff6b6b',
              fontSize: 'medium',
              animation: 'fade',
              duration: 3,
              enableParticles: true,
              enableGlow: true,
              enableShadow: true,
              fontFamily: 'Arial',
              textAlign: 'center',
              backgroundType: 'gradient',
              particleType: 'stars',
              animationSpeed: 'normal',
              quality: '1080p',
              aspectRatio: '9:16'
            };
            setSettings(defaultSettings);
            onSettingsChange?.(defaultSettings);
          }}
        >
          Reset
        </Button>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Quick Presets</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('horror')}
          >
            🎃 Horror
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('gaming')}
          >
            🎮 Gaming
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('subway')}
          >
            🚇 Subway
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('minecraft')}
          >
            ⛏️ Minecraft
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Video Quality Settings */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Video Quality"
            value={settings?.quality}
            onChange={(e) => handleSettingChange('quality', e?.target?.value)}
            options={[
              { value: '720p', label: '720p HD' },
              { value: '1080p', label: '1080p Full HD' },
              { value: '4K', label: '4K Ultra HD' }
            ]}
          />
          
          <Select
            label="Aspect Ratio"
            value={settings?.aspectRatio}
            onChange={(e) => handleSettingChange('aspectRatio', e?.target?.value)}
            options={[
              { value: '9:16', label: '9:16 (TikTok/Shorts)' },
              { value: '16:9', label: '16:9 (YouTube)' },
              { value: '1:1', label: '1:1 (Instagram)' }
            ]}
          />
        </div>

        {/* Color Settings */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Text Color</label>
            <input
              type="color"
              value={settings?.textColor}
              onChange={(e) => handleSettingChange('textColor', e?.target?.value)}
              className="w-full h-10 rounded-md border border-border cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Background</label>
            <input
              type="color"
              value={settings?.backgroundColor}
              onChange={(e) => handleSettingChange('backgroundColor', e?.target?.value)}
              className="w-full h-10 rounded-md border border-border cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Accent Color</label>
            <input
              type="color"
              value={settings?.accentColor}
              onChange={(e) => handleSettingChange('accentColor', e?.target?.value)}
              className="w-full h-10 rounded-md border border-border cursor-pointer"
            />
          </div>
        </div>

        {/* Typography Settings */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Font Family"
            value={settings?.fontFamily}
            onChange={(e) => handleSettingChange('fontFamily', e?.target?.value)}
            options={[
              { value: 'Arial', label: 'Arial (Clean)' },
              { value: 'serif', label: 'Serif (Classic)' },
              { value: 'monospace', label: 'Monospace (Tech)' },
              { value: 'cursive', label: 'Cursive (Fancy)' },
              { value: 'fantasy', label: 'Fantasy (Bold)' },
              { value: 'Orbitron', label: 'Orbitron (Futuristic)' }
            ]}
          />
          
          <Select
            label="Font Size"
            value={settings?.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e?.target?.value)}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
              { value: 'xl', label: 'Extra Large' },
              { value: 'xxl', label: 'Huge' }
            ]}
          />
        </div>

        {/* Animation Settings */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Animation Style"
            value={settings?.animation}
            onChange={(e) => handleSettingChange('animation', e?.target?.value)}
            options={[
              { value: 'fade', label: 'Fade In' },
              { value: 'slide', label: 'Slide Up' },
              { value: 'zoom', label: 'Zoom In' },
              { value: 'bounce', label: 'Bounce' },
              { value: 'shake', label: 'Shake' },
              { value: 'pulse', label: 'Pulse' },
              { value: 'glitch', label: 'Glitch' },
              { value: 'pixelate', label: 'Pixelate' }
            ]}
          />
          
          <Select
            label="Animation Speed"
            value={settings?.animationSpeed}
            onChange={(e) => handleSettingChange('animationSpeed', e?.target?.value)}
            options={[
              { value: 'slow', label: 'Slow' },
              { value: 'normal', label: 'Normal' },
              { value: 'fast', label: 'Fast' },
              { value: 'ultra', label: 'Ultra Fast' }
            ]}
          />
        </div>

        {/* Background & Effects */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Background Type"
            value={settings?.backgroundType}
            onChange={(e) => handleSettingChange('backgroundType', e?.target?.value)}
            options={[
              { value: 'solid', label: 'Solid Color' },
              { value: 'gradient', label: 'Gradient' },
              { value: 'animated', label: 'Animated' },
              { value: 'subway', label: 'Subway Theme' },
              { value: 'minecraft', label: 'Minecraft Theme' }
            ]}
          />
          
          <Select
            label="Particle Effects"
            value={settings?.particleType}
            onChange={(e) => handleSettingChange('particleType', e?.target?.value)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'stars', label: '⭐ Stars' },
              { value: 'dots', label: '⚪ Dots' },
              { value: 'confetti', label: '🎊 Confetti' },
              { value: 'coins', label: '🪙 Coins' },
              { value: 'blocks', label: '🧱 Blocks' },
              { value: 'blood', label: '🩸 Blood' }
            ]}
          />
        </div>

        {/* Timing */}
        <Input
          label="Frame Duration (seconds)"
          type="number"
          min="1"
          max="10"
          step="0.5"
          value={settings?.duration}
          onChange={(e) => handleSettingChange('duration', parseFloat(e?.target?.value))}
          description="How long each text frame displays"
        />

        {/* Effect Toggles */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Visual Effects</label>
          <div className="grid grid-cols-2 gap-4">
            <Checkbox
              label="Enable Particles"
              checked={settings?.enableParticles}
              onChange={(e) => handleSettingChange('enableParticles', e?.target?.checked)}
            />
            <Checkbox
              label="Enable Glow Effects"
              checked={settings?.enableGlow}
              onChange={(e) => handleSettingChange('enableGlow', e?.target?.checked)}
            />
            <Checkbox
              label="Enable Text Shadow"
              checked={settings?.enableShadow}
              onChange={(e) => handleSettingChange('enableShadow', e?.target?.checked)}
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="Eye" size={16} />
          <span>Live Preview</span>
        </h4>
        <div 
          className="p-6 rounded-md text-center transition-all duration-300 min-h-[100px] flex items-center justify-center"
          style={{
            backgroundColor: settings?.backgroundColor,
            color: settings?.textColor,
            fontFamily: settings?.fontFamily,
            fontSize: settings?.fontSize === 'small' ? '14px' : 
                     settings?.fontSize === 'medium' ? '18px' :
                     settings?.fontSize === 'large' ? '24px' :
                     settings?.fontSize === 'xl' ? '30px' : '36px',
            textShadow: settings?.enableShadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
            boxShadow: settings?.enableGlow ? `0 0 20px ${settings?.accentColor}40` : 'none',
            backgroundImage: settings?.backgroundType === 'gradient' ? 
              `linear-gradient(135deg, ${settings?.backgroundColor}, ${settings?.accentColor}40)` : 'none'
          }}
        >
          <div>
            <div className="font-bold mb-2">Sample Hook Text</div>
            <div className="text-sm opacity-80">This is how your video will look</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <p><strong>Quality:</strong> {settings?.quality}</p>
            <p><strong>Ratio:</strong> {settings?.aspectRatio}</p>
            <p><strong>Duration:</strong> {settings?.duration}s/frame</p>
          </div>
          <div>
            <p><strong>Animation:</strong> {settings?.animation}</p>
            <p><strong>Speed:</strong> {settings?.animationSpeed}</p>
            <p><strong>Effects:</strong> {[
              settings?.enableParticles && 'Particles', 
              settings?.enableGlow && 'Glow', 
              settings?.enableShadow && 'Shadow'
            ].filter(Boolean).join(', ') || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="Download" size={16} />
          <span>Export Settings</span>
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Resolution:</span>
            <span className="ml-2 text-foreground">
              {settings?.quality === '720p' ? '720x1280' : 
               settings?.quality === '1080p' ? '1080x1920' : '2160x3840'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Format:</span>
            <span className="ml-2 text-foreground">WebM/MP4</span>
          </div>
          <div>
            <span className="text-muted-foreground">Frame Rate:</span>
            <span className="ml-2 text-foreground">30 FPS</span>
          </div>
          <div>
            <span className="text-muted-foreground">Bitrate:</span>
            <span className="ml-2 text-foreground">
              {settings?.quality === '720p' ? '2.5' : 
               settings?.quality === '1080p' ? '5.0' : '15.0'}Mbps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCustomizationPanel;