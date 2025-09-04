import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ThemeSelector = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState('cyberpunk');

  const themes = [
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Neon colors with dark background',
      colors: {
        primary: '#39FF14',
        secondary: '#FF00FF',
        accent: '#00FFFF',
        background: '#0a0a0a'
      },
      preview: 'bg-gradient-to-r from-green-400 via-pink-500 to-cyan-400'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design',
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#333333',
        background: '#ffffff'
      },
      preview: 'bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400'
    },
    {
      id: 'retro',
      name: 'Retro Wave',
      description: '80s inspired synthwave',
      colors: {
        primary: '#FF6B9D',
        secondary: '#C44569',
        accent: '#F8B500',
        background: '#1a1a2e'
      },
      preview: 'bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-400'
    },
    {
      id: 'neon',
      name: 'Neon Glow',
      description: 'Bright neon with glow effects',
      colors: {
        primary: '#FF073A',
        secondary: '#39FF14',
        accent: '#FF9500',
        background: '#000000'
      },
      preview: 'bg-gradient-to-r from-red-500 via-green-400 to-orange-400'
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      description: 'Calming blue tones',
      colors: {
        primary: '#0077BE',
        secondary: '#00A8CC',
        accent: '#7209B7',
        background: '#f0f8ff'
      },
      preview: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm sunset colors',
      colors: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        accent: '#FFD23F',
        background: '#2c1810'
      },
      preview: 'bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500'
    }
  ];

  useEffect(() => {
    // Apply theme to document root
    const theme = themes.find(t => t.id === currentTheme);
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });
    }
  }, [currentTheme]);

  const handleThemeSelect = (themeId) => {
    setCurrentTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    onThemeChange?.(theme);
    
    // Save to localStorage
    localStorage.setItem('viralshort-theme', themeId);
  };

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('viralshort-theme');
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Palette" size={16} />
        <span>Theme Selector</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {themes.map(theme => (
          <div
            key={theme.id}
            className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
              currentTheme === theme.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-muted-foreground hover:bg-muted/50'
            }`}
            onClick={() => handleThemeSelect(theme.id)}
          >
            {/* Theme Preview */}
            <div className={`w-full h-8 rounded mb-3 ${theme.preview}`}></div>
            
            {/* Theme Info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{theme.name}</h4>
                {currentTheme === theme.id && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            </div>

            {/* Color Palette */}
            <div className="flex space-x-1 mt-3">
              {Object.entries(theme.colors).map(([key, color]) => (
                <div
                  key={key}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                  title={`${key}: ${color}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Customization */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Customization</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm text-foreground">Enable animations</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm text-foreground">Glow effects</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-foreground">High contrast mode</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-foreground">Reduce motion</span>
          </label>
        </div>
      </div>

      {/* Export Theme */}
      <div className="mt-4 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            const theme = themes.find(t => t.id === currentTheme);
            const themeData = JSON.stringify(theme, null, 2);
            const blob = new Blob([themeData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Icon name="Download" size={14} className="mr-2" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Icon name="Upload" size={14} className="mr-2" />
          Import
        </Button>
      </div>
    </div>
  );
};

export default ThemeSelector;