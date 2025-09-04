import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ searchQuery, onSearchChange, onSortChange, sortBy }) => {
  const [trendingTags, setTrendingTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockTrendingTags = [
    { tag: 'viral', count: 1247 },
    { tag: 'trending', count: 892 },
    { tag: 'horror', count: 654 },
    { tag: 'funny', count: 543 },
    { tag: 'mystery', count: 432 },
    { tag: 'scary', count: 321 },
    { tag: 'comedy', count: 298 },
    { tag: 'suspense', count: 267 }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' },
    { value: 'viral-rate', label: 'Highest Viral Rate', icon: 'Zap' },
    { value: 'views', label: 'Most Views', icon: 'Eye' }
  ];

  useEffect(() => {
    setTrendingTags(mockTrendingTags);
  }, []);

  const handleTagClick = (tag) => {
    onSearchChange(tag);
    setShowSuggestions(false);
  };

  const getSortIcon = () => {
    const option = sortOptions?.find(opt => opt?.value === sortBy);
    return option ? option?.icon : 'ArrowUpDown';
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search templates, hashtags, or keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10"
        />
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />

        {/* Search Suggestions */}
        {showSuggestions && searchQuery?.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-md surface-elevation z-50">
            <div className="p-3">
              <h4 className="text-sm font-medium text-foreground mb-2">Trending Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {trendingTags?.slice(0, 6)?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleTagClick(item?.tag)}
                    className="px-2 py-1 bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground text-xs rounded transition-neon flex items-center space-x-1"
                  >
                    <span>#{item?.tag}</span>
                    <span className="text-xs opacity-60">({item?.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Sort and Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Sort by:</span>
        </div>
        
        <div className="flex space-x-2">
          {sortOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={sortBy === option?.value ? 'default' : 'ghost'}
              size="sm"
              iconName={option?.icon}
              iconPosition="left"
              onClick={() => onSortChange(option?.value)}
              className={`
                transition-neon
                ${sortBy === option?.value 
                  ? 'neon-glow-primary' :'text-muted-foreground hover:text-foreground hover:neon-glow-primary'
                }
              `}
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;