import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';


const AnalyticsChart = () => {
  const [chartType, setChartType] = useState('views');
  const [animationActive, setAnimationActive] = useState(false);

  const chartData = [
    { name: 'Mon', views: 12000, engagement: 85, viral: 72 },
    { name: 'Tue', views: 19000, engagement: 92, viral: 88 },
    { name: 'Wed', views: 8000, engagement: 78, viral: 65 },
    { name: 'Thu', views: 25000, engagement: 96, viral: 94 },
    { name: 'Fri', views: 31000, engagement: 89, viral: 91 },
    { name: 'Sat', views: 45000, engagement: 94, viral: 97 },
    { name: 'Sun', views: 38000, engagement: 87, viral: 89 }
  ];

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimationActive(true);
      setTimeout(() => setAnimationActive(false), 500);
    }, 3000);

    return () => clearInterval(animationInterval);
  }, []);

  const getChartColor = () => {
    switch (chartType) {
      case 'views': return '#39FF14';
      case 'engagement': return '#FF00FF';
      case 'viral': return '#00FFFF';
      default: return '#39FF14';
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'views': return 'Weekly Views';
      case 'engagement': return 'Engagement Rate';
      case 'viral': return 'Viral Score';
      default: return 'Weekly Views';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-mono text-sm text-popover-foreground">{`${label}`}</p>
          <p className="font-mono text-sm" style={{ color: getChartColor() }}>
            {`${getChartTitle()}: ${payload?.[0]?.value}${chartType === 'views' ? '' : '%'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`
      bg-card border border-border rounded-lg p-6 transition-neon
      ${animationActive ? 'neon-glow-primary' : ''}
    `}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">
          Performance Analytics
        </h2>
        
        {/* Chart Type Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType('views')}
            className={`
              px-3 py-1 rounded-sm text-xs font-mono transition-neon
              ${chartType === 'views' ?'bg-primary text-primary-foreground neon-glow-primary' :'text-muted-foreground hover:text-primary'
              }
            `}
          >
            Views
          </button>
          <button
            onClick={() => setChartType('engagement')}
            className={`
              px-3 py-1 rounded-sm text-xs font-mono transition-neon
              ${chartType === 'engagement' ?'bg-secondary text-secondary-foreground neon-glow-secondary' :'text-muted-foreground hover:text-secondary'
              }
            `}
          >
            Engagement
          </button>
          <button
            onClick={() => setChartType('viral')}
            className={`
              px-3 py-1 rounded-sm text-xs font-mono transition-neon
              ${chartType === 'viral' ?'bg-accent text-accent-foreground neon-glow-accent' :'text-muted-foreground hover:text-accent'
              }
            `}
          >
            Viral
          </button>
        </div>
      </div>
      {/* Chart Container */}
      <div className="w-full h-64" aria-label={`${getChartTitle()} Chart`}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'views' ? (
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Bar 
                dataKey="views" 
                fill={getChartColor()}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Line 
                type="monotone" 
                dataKey={chartType} 
                stroke={getChartColor()}
                strokeWidth={3}
                dot={{ fill: getChartColor(), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getChartColor(), strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Chart Insights */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted bg-opacity-50 rounded-lg">
          <div className="text-lg font-mono font-bold text-primary">
            {chartData?.reduce((sum, item) => sum + item?.views, 0)?.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Views</div>
        </div>
        
        <div className="text-center p-3 bg-muted bg-opacity-50 rounded-lg">
          <div className="text-lg font-mono font-bold text-secondary">
            {Math.round(chartData?.reduce((sum, item) => sum + item?.engagement, 0) / chartData?.length)}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Engagement</div>
        </div>
        
        <div className="text-center p-3 bg-muted bg-opacity-50 rounded-lg">
          <div className="text-lg font-mono font-bold text-accent">
            {Math.round(chartData?.reduce((sum, item) => sum + item?.viral, 0) / chartData?.length)}
          </div>
          <div className="text-xs text-muted-foreground">Avg Viral Score</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;