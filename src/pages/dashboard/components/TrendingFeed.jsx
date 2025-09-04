import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrendingFeed = () => {
  const [glitchIndex, setGlitchIndex] = useState(-1);
  const [colorInvert, setColorInvert] = useState(false);

  const trendingContent = [
    {
      id: 1,
      title: "Horror Story: The Midnight Visitor",
      thumbnail: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg",
      views: "2.3M",
      engagement: "94%",
      category: "Horror",
      hook: "You won\'t believe what happened at 3 AM...",
      viralScore: 96
    },
    {
      id: 2,
      title: "Fairy Tale: The Enchanted Forest",
      thumbnail: "https://images.pixabay.com/photo/2017/09/04/16/58/fairy-tale-2715309_1280.jpg",
      views: "1.8M",
      engagement: "87%",
      category: "Fairy Tales",
      hook: "This magical secret will change everything...",
      viralScore: 89
    },
    {
      id: 3,
      title: "Comedy: Epic Fail Compilation",
      thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
      views: "3.1M",
      engagement: "91%",
      category: "Funny",
      hook: "Watch this and try not to laugh...",
      viralScore: 93
    },
    {
      id: 4,
      title: "Horror: The Cursed Doll",
      thumbnail: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpg",
      views: "1.5M",
      engagement: "88%",
      category: "Horror",
      hook: "This doll moves when nobody's watching...",
      viralScore: 85
    }
  ];

  useEffect(() => {
    // Pattern interrupt glitch effects every 3-5 seconds
    const glitchInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * trendingContent?.length);
      setGlitchIndex(randomIndex);
      
      setTimeout(() => setGlitchIndex(-1), 200);
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    // Color inversion effects
    const colorInterval = setInterval(() => {
      setColorInvert(true);
      setTimeout(() => setColorInvert(false), 100);
    }, 8000);

    return () => clearInterval(colorInterval);
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Horror': return 'text-error';
      case 'Fairy Tales': return 'text-secondary';
      case 'Funny': return 'text-warning';
      default: return 'text-primary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">
          Trending Now
        </h2>
        <div className="flex items-center space-x-2 text-primary">
          <Icon name="TrendingUp" size={20} />
          <span className="text-sm font-mono">VIRAL</span>
        </div>
      </div>
      <div className="space-y-4">
        {trendingContent?.map((item, index) => (
          <div
            key={item?.id}
            className={`
              flex space-x-4 p-4 rounded-lg border border-border transition-neon
              hover:neon-glow-primary hover:bg-accent hover:bg-opacity-10
              ${glitchIndex === index ? 'glitch-effect' : ''}
              ${colorInvert ? 'invert' : ''}
            `}
          >
            {/* Thumbnail */}
            <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={item?.thumbnail}
                alt={item?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              
              {/* Viral Score Badge */}
              <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs font-mono px-1 rounded">
                {item?.viralScore}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-body font-semibold text-foreground text-sm line-clamp-1">
                  {item?.title}
                </h3>
                <span className={`text-xs font-mono ${getCategoryColor(item?.category)}`}>
                  {item?.category}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 italic">
                "{item?.hook}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span className="text-primary">{item?.views} views</span>
                  <span className="text-secondary">{item?.engagement} engagement</span>
                </div>
                
                <button className="text-muted-foreground hover:text-primary transition-neon">
                  <Icon name="ExternalLink" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full py-2 text-sm font-mono text-accent hover:text-accent-foreground hover:bg-accent hover:bg-opacity-20 rounded-md transition-neon">
          View All Trending Content
        </button>
      </div>
    </div>
  );
};

export default TrendingFeed;