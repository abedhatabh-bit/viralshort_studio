import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkingCustomization = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    textColor: '#ffffff',
    accentColor: '#fbbf24',
    fontSize: 'large',
    animation: 'slide',
    enableGlow: true,
    enableShadow: true,
    animationSpeed: 'normal'
  });

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const presets = {
    subway: {
      textColor: '#ffffff',
      accentColor: '#fbbf24',
      fontSize: 'large',
      animation: 'slide'
    },
    minecraft: {
      textColor: '#22c55e',
      accentColor: '#f59e0b',
      fontSize: 'large',
      animation: 'bounce'
    },
    health: {
      textColor: '#ffffff',
      accentColor: '#10b981',
      fontSize: 'medium',
      animation: 'fade'
    }
  };

  const applyPreset = (preset) => {
    const newSettings = { ...settings, ...presets[preset] };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="Palette" size={20} className="text-primary" />
        <h3 className="font-heading font-bold text-lg text-foreground">Customization</h3>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Quick Presets</label>
        <div className="grid grid-cols-3 gap-2">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('health')}
          >
            💚 Health
          </Button>
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Text Color</label>
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) => handleChange('textColor', e.target.value)}
            className="w-full h-10 rounded-md border border-border cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Accent Color</label>
          <input
            type="color"
            value={settings.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
            className="w-full h-10 rounded-md border border-border cursor-pointer"
          />
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Font Size</label>
        <select
          value={settings.fontSize}
          onChange={(e) => handleChange('fontSize', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>

      {/* Animation */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Animation Style</label>
        <select
          value={settings.animation}
          onChange={(e) => handleChange('animation', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="fade">Fade In</option>
          <option value="slide">Slide Up</option>
          <option value="bounce">Bounce</option>
          <option value="zoom">Zoom In</option>
        </select>
      </div>

      {/* Effects */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Effects</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.enableGlow}
              onChange={(e) => handleChange('enableGlow', e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm text-foreground">Enable Glow Effect</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.enableShadow}
              onChange={(e) => handleChange('enableShadow', e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm text-foreground">Enable Text Shadow</span>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-3">Live Preview</h4>
        <div 
          className="p-4 rounded-md text-center transition-all duration-300"
          style={{
            backgroundColor: '#1e3a8a',
            color: settings.textColor,
            fontSize: settings.fontSize === 'small' ? '14px' : 
                     settings.fontSize === 'medium' ? '16px' :
                     settings.fontSize === 'large' ? '20px' : '24px',
            textShadow: settings.enableShadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
            boxShadow: settings.enableGlow ? `0 0 20px ${settings.accentColor}40` : 'none'
          }}
        >
          <div style={{ color: settings.accentColor, fontWeight: 'bold', marginBottom: '8px' }}>
            Health Tip Hook
          </div>
          <div>
            Sample health tip text content
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingCustomization;