import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ComparisonTools = ({ comparisonData, onComparisonChange }) => {
  const [activeComparison, setActiveComparison] = useState('niches');
  const [selectedPeriods, setSelectedPeriods] = useState(['thisMonth', 'lastMonth']);
  const [glowEffect, setGlowEffect] = useState(false);

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowEffect(true);
      setTimeout(() => setGlowEffect(false), 1000);
    }, 4000);

    return () => clearInterval(glowInterval);
  }, []);

  const comparisonTypes = [
    { id: 'niches', label: 'Niches', icon: 'Target', color: 'primary' },
    { id: 'periods', label: 'Time Periods', icon: 'Calendar', color: 'accent' },
    { id: 'platforms', label: 'Platforms', icon: 'Smartphone', color: 'secondary' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 surface-elevation neon-glow-primary">
          <p className="text-sm text-popover-foreground font-medium mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-popover-foreground">
                {entry?.name}: {entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderNicheComparison = () => (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData?.niches}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#CCCCCC" 
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              stroke="#CCCCCC" 
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="views" fill="#39FF14" name="Views" />
            <Bar dataKey="engagement" fill="#FF00FF" name="Engagement" />
            <Bar dataKey="shares" fill="#00FFFF" name="Shares" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparisonData?.niches?.map((niche, index) => (
          <div
            key={niche?.name}
            className={`p-4 rounded-lg border border-${niche?.color}/30 bg-${niche?.color}/5 transition-neon hover:neon-glow-${niche?.color}`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Icon name={niche?.icon} size={20} className={`text-${niche?.color}`} />
              <h4 className="font-medium text-card-foreground">{niche?.name}</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Viral Score</span>
                <span className={`text-sm font-bold text-${niche?.color}`}>
                  {niche?.viralScore}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Views</span>
                <span className="text-sm font-medium text-card-foreground">
                  {(niche?.views / 1000)?.toFixed(1)}K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Growth</span>
                <span className={`text-sm font-medium ${niche?.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                  {niche?.growth > 0 ? '+' : ''}{niche?.growth}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPeriodComparison = () => (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={comparisonData?.periods}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: '#CCCCCC', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              tick={{ fill: '#CCCCCC', fontSize: 10 }}
              domain={[0, 100]}
            />
            <Radar
              name="This Month"
              dataKey="thisMonth"
              stroke="#39FF14"
              fill="#39FF14"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Last Month"
              dataKey="lastMonth"
              stroke="#FF00FF"
              fill="#FF00FF"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
          <h4 className="font-medium text-primary mb-3">This Month</h4>
          <div className="space-y-2">
            {comparisonData?.periods?.map((item) => (
              <div key={item?.metric} className="flex justify-between">
                <span className="text-sm text-muted-foreground">{item?.metric}</span>
                <span className="text-sm font-medium text-card-foreground">
                  {item?.thisMonth}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-secondary/30 bg-secondary/5">
          <h4 className="font-medium text-secondary mb-3">Last Month</h4>
          <div className="space-y-2">
            {comparisonData?.periods?.map((item) => (
              <div key={item?.metric} className="flex justify-between">
                <span className="text-sm text-muted-foreground">{item?.metric}</span>
                <span className="text-sm font-medium text-card-foreground">
                  {item?.lastMonth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlatformComparison = () => (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData?.platforms} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number"
              stroke="#CCCCCC" 
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="#CCCCCC" 
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="performance" fill="#00FFFF" name="Performance Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisonData?.platforms?.map((platform) => (
          <div
            key={platform?.name}
            className="p-4 rounded-lg border border-accent/30 bg-accent/5 transition-neon hover:neon-glow-accent"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon name={platform?.icon} size={20} className="text-accent" />
                <h4 className="font-medium text-card-foreground">{platform?.name}</h4>
              </div>
              <span className="text-sm font-bold text-accent">
                {platform?.performance}%
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reach</span>
                <span className="text-sm font-medium text-card-foreground">
                  {(platform?.reach / 1000)?.toFixed(1)}K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <span className="text-sm font-medium text-card-foreground">
                  {platform?.engagement}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Best Time</span>
                <span className="text-sm font-medium text-card-foreground">
                  {platform?.bestTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComparisonContent = () => {
    switch (activeComparison) {
      case 'niches':
        return renderNicheComparison();
      case 'periods':
        return renderPeriodComparison();
      case 'platforms':
        return renderPlatformComparison();
      default:
        return renderNicheComparison();
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 surface-elevation transition-neon ${glowEffect ? 'neon-glow-accent' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Comparison Tools</h3>
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={16} className="text-accent" />
          <span className="text-xs text-muted-foreground">Advanced Analytics</span>
        </div>
      </div>
      {/* Comparison Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {comparisonTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => setActiveComparison(type?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-neon ${
              activeComparison === type?.id
                ? `border-${type?.color} bg-${type?.color}/10 text-${type?.color} neon-glow-${type?.color}`
                : 'border-border bg-muted/20 text-muted-foreground hover:border-accent hover:text-accent'
            }`}
          >
            <Icon name={type?.icon} size={16} />
            <span className="text-sm font-medium">{type?.label}</span>
          </button>
        ))}
      </div>
      {/* Comparison Content */}
      {renderComparisonContent()}
      {/* Export Options */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Export comparison data
          </span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-xs bg-muted hover:bg-accent hover:text-accent-foreground rounded transition-neon">
              CSV
            </button>
            <button className="px-3 py-1 text-xs bg-muted hover:bg-accent hover:text-accent-foreground rounded transition-neon">
              PDF
            </button>
            <button className="px-3 py-1 text-xs bg-primary hover:bg-primary/80 text-primary-foreground rounded transition-neon">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTools;