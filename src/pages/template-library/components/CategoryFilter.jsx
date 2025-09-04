import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange, templateCounts }) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);

    return () => clearInterval(glitchInterval);
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'all': return 'Grid3X3';
      case 'horror': return 'Skull';
      case 'fairy-tales': return 'Sparkles';
      case 'funny': return 'Laugh';
      default: return 'Folder';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'horror': return 'error';
      case 'fairy-tales': return 'secondary';
      case 'funny': return 'accent';
      default: return 'primary';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories?.map((category) => {
        const isActive = activeCategory === category?.id;
        const colorClass = getCategoryColor(category?.id);
        const count = templateCounts?.[category?.id] || 0;

        return (
          <Button
            key={category?.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            iconName={getCategoryIcon(category?.id)}
            iconPosition="left"
            onClick={() => onCategoryChange(category?.id)}
            className={`
              relative transition-neon
              ${isActive 
                ? `bg-${colorClass} text-${colorClass}-foreground neon-glow-${colorClass}` 
                : `border-${colorClass} text-${colorClass} hover:bg-${colorClass} hover:text-${colorClass}-foreground hover:neon-glow-${colorClass}`
              }
              ${glitchActive && isActive ? 'glitch-effect' : ''}
            `}
          >
            <span className="flex items-center space-x-2">
              <span>{category?.name}</span>
              <span className={`
                px-1.5 py-0.5 rounded-full text-xs font-mono
                ${isActive 
                  ? `bg-${colorClass}-foreground text-${colorClass}` 
                  : `bg-${colorClass} text-${colorClass}-foreground`
                }
              `}>
                {count}
              </span>
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;