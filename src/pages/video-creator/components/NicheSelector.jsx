import React from 'react';
import Icon from '../../../components/AppIcon';

const NicheSelector = ({ selectedNiche, onNicheSelect }) => {
  const niches = [
    {
      id: 'horror',
      name: 'Horror',
      icon: 'Ghost',
      description: 'Spine-chilling stories that captivate',
      color: 'destructive',
      glowClass: 'neon-glow-intense',
      examples: ['Haunted House', 'Urban Legends', 'Paranormal']
    },
    {
      id: 'fairytales',
      name: 'Fairy Tales',
      icon: 'Sparkles',
      description: 'Magical stories with modern twists',
      color: 'secondary',
      glowClass: 'neon-glow-secondary',
      examples: ['Modern Cinderella', 'Dark Fairy Tales', 'Fantasy Romance']
    },
    {
      id: 'funny',
      name: 'Funny',
      icon: 'Laugh',
      description: 'Comedy that goes viral instantly',
      color: 'accent',
      glowClass: 'neon-glow-accent',
      examples: ['Relatable Fails', 'Comedy Skits', 'Meme Stories']
    },
    {
      id: 'subway',
      name: 'Subway Surfers',
      icon: 'Train',
      description: 'High-energy gaming content with subway themes',
      color: 'primary',
      glowClass: 'neon-glow-primary',
      examples: ['Gaming Tips', 'High Scores', 'Speed Runs']
    },
    {
      id: 'minecraft',
      name: 'Minecraft',
      icon: 'Box',
      description: 'Block-building adventures and tutorials',
      color: 'success',
      glowClass: 'neon-glow-success',
      examples: ['Building Tips', 'Survival Guide', 'Redstone Tricks']
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Target" size={20} className="text-primary" />
        <h3 className="font-heading font-bold text-lg text-foreground">Choose Your Niche</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {niches?.map((niche) => {
          const isSelected = selectedNiche === niche?.id;
          return (
            <button
              key={niche?.id}
              onClick={() => onNicheSelect(niche?.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-neon text-left
                ${isSelected 
                  ? `border-${niche?.color} bg-${niche?.color}/10 ${niche?.glowClass}` 
                  : 'border-border hover:border-primary/50 hover:neon-glow-primary'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-md 
                  ${isSelected ? `bg-${niche?.color} text-${niche?.color}-foreground` : 'bg-muted text-muted-foreground'}
                `}>
                  <Icon name={niche?.icon} size={20} />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-body font-semibold text-base mb-1 ${isSelected ? `text-${niche?.color}` : 'text-foreground'}`}>
                    {niche?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {niche?.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {niche?.examples?.map((example, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-sm"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                
                {isSelected && (
                  <div className={`text-${niche?.color}`}>
                    <Icon name="CheckCircle" size={20} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NicheSelector;