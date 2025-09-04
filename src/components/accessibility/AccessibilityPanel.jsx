import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const AccessibilityPanel = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    reduceMotion: false,
    largeText: false,
    screenReader: false,
    keyboardNav: true,
    focusIndicators: true,
    colorBlindFriendly: false,
    audioDescriptions: false
  });

  const [keyboardShortcuts, setKeyboardShortcuts] = useState([
    { key: 'Ctrl + N', action: 'New Project', enabled: true },
    { key: 'Ctrl + S', action: 'Save Project', enabled: true },
    { key: 'Space', action: 'Play/Pause Preview', enabled: true },
    { key: 'Arrow Keys', action: 'Navigate Frames', enabled: true },
    { key: 'Ctrl + Z', action: 'Undo', enabled: true },
    { key: 'Ctrl + Y', action: 'Redo', enabled: true },
    { key: 'Tab', action: 'Navigate Elements', enabled: true },
    { key: 'Enter', action: 'Activate Element', enabled: true }
  ]);

  useEffect(() => {
    // Load saved accessibility settings
    const saved = localStorage.getItem('viralshort-accessibility');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
        applyAccessibilitySettings(parsedSettings);
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('viralshort-accessibility', JSON.stringify(newSettings));
    
    // Apply settings immediately
    applyAccessibilitySettings(newSettings);
    
    // Notify parent component
    onSettingsChange?.(newSettings);
  };

  const applyAccessibilitySettings = (accessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (accessibilitySettings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Large text
    if (accessibilitySettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Focus indicators
    if (accessibilitySettings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
    
    // Color blind friendly
    if (accessibilitySettings.colorBlindFriendly) {
      root.classList.add('colorblind-friendly');
    } else {
      root.classList.remove('colorblind-friendly');
    }
  };

  const runAccessibilityCheck = () => {
    const issues = [];
    
    // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text`);
    }
    
    // Check for missing labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    if (inputs.length > 0) {
      issues.push(`${inputs.length} inputs missing labels`);
    }
    
    // Check color contrast (simplified)
    const lowContrastElements = document.querySelectorAll('.text-muted-foreground');
    if (lowContrastElements.length > 0 && !settings.highContrast) {
      issues.push('Some text may have low contrast');
    }
    
    return issues;
  };

  const [accessibilityIssues, setAccessibilityIssues] = useState([]);

  useEffect(() => {
    const issues = runAccessibilityCheck();
    setAccessibilityIssues(issues);
  }, [settings]);

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Users" size={16} />
        <span>Accessibility Settings</span>
      </h3>

      {/* Visual Settings */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-foreground">Visual</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">High Contrast Mode</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              className="rounded"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Large Text</span>
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={(e) => updateSetting('largeText', e.target.checked)}
              className="rounded"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Color Blind Friendly</span>
            <input
              type="checkbox"
              checked={settings.colorBlindFriendly}
              onChange={(e) => updateSetting('colorBlindFriendly', e.target.checked)}
              className="rounded"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Enhanced Focus Indicators</span>
            <input
              type="checkbox"
              checked={settings.focusIndicators}
              onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
              className="rounded"
            />
          </label>
        </div>
      </div>

      {/* Motion Settings */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-foreground">Motion</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Reduce Motion</span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
              className="rounded"
            />
          </label>
        </div>
      </div>

      {/* Screen Reader Settings */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-foreground">Screen Reader</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Screen Reader Optimized</span>
            <input
              type="checkbox"
              checked={settings.screenReader}
              onChange={(e) => updateSetting('screenReader', e.target.checked)}
              className="rounded"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Audio Descriptions</span>
            <input
              type="checkbox"
              checked={settings.audioDescriptions}
              onChange={(e) => updateSetting('audioDescriptions', e.target.checked)}
              className="rounded"
            />
          </label>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-foreground">Keyboard Shortcuts</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {keyboardShortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{shortcut.key}</span>
              <span className="text-foreground">{shortcut.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Check */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Accessibility Check</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAccessibilityIssues(runAccessibilityCheck())}
          >
            <Icon name="Search" size={12} className="mr-1" />
            Check
          </Button>
        </div>
        
        {accessibilityIssues.length > 0 ? (
          <div className="space-y-2">
            <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              Issues Found:
            </div>
            {accessibilityIssues.map((issue, index) => (
              <div key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                <Icon name="AlertTriangle" size={12} className="text-yellow-500" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-green-600 dark:text-green-400 flex items-center space-x-2">
            <Icon name="CheckCircle" size={12} />
            <span>No accessibility issues found</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Reset to default settings
              const defaultSettings = {
                highContrast: false,
                reduceMotion: false,
                largeText: false,
                screenReader: false,
                keyboardNav: true,
                focusIndicators: true,
                colorBlindFriendly: false,
                audioDescriptions: false
              };
              setSettings(defaultSettings);
              applyAccessibilitySettings(defaultSettings);
              localStorage.setItem('viralshort-accessibility', JSON.stringify(defaultSettings));
            }}
          >
            <Icon name="RotateCcw" size={12} className="mr-1" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Export settings
              const settingsData = JSON.stringify(settings, null, 2);
              const blob = new Blob([settingsData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'accessibility-settings.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Icon name="Download" size={12} className="mr-1" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;