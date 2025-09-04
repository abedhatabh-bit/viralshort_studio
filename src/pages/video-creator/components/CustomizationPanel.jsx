import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CustomizationPanel = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    animationSpeed: 'normal',
    colorTheme: 'neon',
    textPosition: 'center',
    glitchIntensity: 'medium',
    pulseEnabled: true,
    motionStreaks: true,
    countdownTimer: true,
    sparkEffects: true
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange && onSettingsChange(newSettings);
  };

  const animationSpeeds = [
    { value: 'slow', label: 'Slow (Relaxed)', icon: 'Turtle' },
    { value: 'normal', label: 'Normal (Balanced)', icon: 'Zap' },
    { value: 'fast', label: 'Fast (Intense)', icon: 'Rabbit' }
  ];

  const colorThemes = [
    { value: 'neon', label: 'Neon Mix', colors: ['#39FF14', '#FF00FF', '#00FFFF'] },
    { value: 'horror', label: 'Horror Red', colors: ['#FF073A', '#8B0000', '#FF4500'] },
    { value: 'fairy', label: 'Fairy Magic', colors: ['#FF00FF', '#9932CC', '#FF69B4'] },
    { value: 'cyber', label: 'Cyber Blue', colors: ['#00FFFF', '#0080FF', '#4169E1'] }
  ];

  const textPositions = [
    { value: 'top', label: 'Top', icon: 'AlignStartVertical' },
    { value: 'center', label: 'Center', icon: 'AlignCenterVertical' },
    { value: 'bottom', label: 'Bottom', icon: 'AlignEndVertical' }
  ];

  const glitchLevels = [
    { value: 'off', label: 'Off', description: 'No glitch effects' },
    { value: 'low', label: 'Subtle', description: 'Minimal glitch every 8s' },
    { value: 'medium', label: 'Medium', description: 'Regular glitch every 4s' },
    { value: 'high', label: 'Intense', description: 'Frequent glitch every 2s' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Settings" size={20} className="text-primary" />
        <h3 className="font-heading font-bold text-lg text-foreground">Customization</h3>
      </div>
      {/* Animation Speed */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Animation Speed</label>
        <div className="grid gap-2">
          {animationSpeeds?.map((speed) => (
            <button
              key={speed?.value}
              onClick={() => handleSettingChange('animationSpeed', speed?.value)}
              className={`
                p-3 rounded-lg border text-left transition-neon flex items-center space-x-3
                ${settings?.animationSpeed === speed?.value
                  ? 'border-primary bg-primary/10 text-primary neon-glow-primary' :'border-border hover:border-primary/50 text-foreground'
                }
              `}
            >
              <Icon name={speed?.icon} size={16} />
              <span className="text-sm font-medium">{speed?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Color Theme */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Color Theme</label>
        <div className="grid gap-2">
          {colorThemes?.map((theme) => (
            <button
              key={theme?.value}
              onClick={() => handleSettingChange('colorTheme', theme?.value)}
              className={`
                p-3 rounded-lg border text-left transition-neon
                ${settings?.colorTheme === theme?.value
                  ? 'border-primary bg-primary/10 neon-glow-primary' :'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{theme?.label}</span>
                <div className="flex space-x-1">
                  {theme?.colors?.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Text Position */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Text Position</label>
        <div className="grid grid-cols-3 gap-2">
          {textPositions?.map((position) => (
            <button
              key={position?.value}
              onClick={() => handleSettingChange('textPosition', position?.value)}
              className={`
                p-3 rounded-lg border text-center transition-neon
                ${settings?.textPosition === position?.value
                  ? 'border-accent bg-accent/10 text-accent neon-glow-accent' :'border-border hover:border-accent/50 text-foreground'
                }
              `}
            >
              <Icon name={position?.icon} size={16} className="mx-auto mb-1" />
              <div className="text-xs">{position?.label}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Glitch Intensity */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Glitch Intensity</label>
        <div className="grid gap-2">
          {glitchLevels?.map((level) => (
            <button
              key={level?.value}
              onClick={() => handleSettingChange('glitchIntensity', level?.value)}
              className={`
                p-3 rounded-lg border text-left transition-neon
                ${settings?.glitchIntensity === level?.value
                  ? 'border-secondary bg-secondary/10 text-secondary neon-glow-secondary' :'border-border hover:border-secondary/50 text-foreground'
                }
              `}
            >
              <div className="text-sm font-medium mb-1">{level?.label}</div>
              <div className="text-xs text-muted-foreground">{level?.description}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Effect Toggles */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">Visual Effects</label>
        
        <div className="space-y-3">
          <Checkbox
            label="Heartbeat Pulse (70 BPM)"
            description="Adds rhythmic pulse to CTA buttons"
            checked={settings?.pulseEnabled}
            onChange={(e) => handleSettingChange('pulseEnabled', e?.target?.checked)}
          />
          
          <Checkbox
            label="Motion Streaks"
            description="Vertical flowing lines for attention"
            checked={settings?.motionStreaks}
            onChange={(e) => handleSettingChange('motionStreaks', e?.target?.checked)}
          />
          
          <Checkbox
            label="Countdown Timer"
            description="Urgency simulation with timer"
            checked={settings?.countdownTimer}
            onChange={(e) => handleSettingChange('countdownTimer', e?.target?.checked)}
          />
          
          <Checkbox
            label="Spark Micro-Rewards"
            description="Confetti and spark animations"
            checked={settings?.sparkEffects}
            onChange={(e) => handleSettingChange('sparkEffects', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Preset Templates */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Quick Presets</label>
        <div className="grid gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Zap"
            onClick={() => {
              const viralPreset = {
                animationSpeed: 'fast',
                colorTheme: 'neon',
                textPosition: 'center',
                glitchIntensity: 'high',
                pulseEnabled: true,
                motionStreaks: true,
                countdownTimer: true,
                sparkEffects: true
              };
              setSettings(viralPreset);
              onSettingsChange && onSettingsChange(viralPreset);
            }}
          >
            Maximum Viral
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            onClick={() => {
              const subtlePreset = {
                animationSpeed: 'normal',
                colorTheme: 'cyber',
                textPosition: 'center',
                glitchIntensity: 'low',
                pulseEnabled: true,
                motionStreaks: false,
                countdownTimer: false,
                sparkEffects: false
              };
              setSettings(subtlePreset);
              onSettingsChange && onSettingsChange(subtlePreset);
            }}
          >
            Subtle Engagement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;