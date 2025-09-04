import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PerformanceChart = ({ data, title, type = 'line', neonColor = 'primary' }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.4);

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowIntensity(prev => prev === 0.4 ? 0.8 : 0.4);
    }, 2000);

    return () => clearInterval(glowInterval);
  }, []);

  const getColorValue = (color) => {
    const colors = {
      primary: '#39FF14',
      secondary: '#FF00FF',
      accent: '#00FFFF',
      destructive: '#FF073A'
    };
    return colors?.[color] || colors?.primary;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 surface-elevation neon-glow-primary">
          <p className="text-sm text-popover-foreground font-medium">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className={`text-sm text-${neonColor}`}>
              {entry?.name}: {entry?.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const refreshData = () => {
    setAnimationKey(prev => prev + 1);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 surface-elevation">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <button
          onClick={refreshData}
          className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-neon"
          title="Refresh Data"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart key={animationKey} data={data}>
              <defs>
                <linearGradient id={`gradient-${neonColor}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColorValue(neonColor)} stopOpacity={glowIntensity} />
                  <stop offset="95%" stopColor={getColorValue(neonColor)} stopOpacity={0.1} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="value"
                stroke={getColorValue(neonColor)}
                strokeWidth={2}
                fill={`url(#gradient-${neonColor})`}
                animationDuration={2000}
              />
            </AreaChart>
          ) : (
            <LineChart key={animationKey} data={data}>
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
                dataKey="value"
                stroke={getColorValue(neonColor)}
                strokeWidth={3}
                dot={{ fill: getColorValue(neonColor), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getColorValue(neonColor), strokeWidth: 2 }}
                animationDuration={2000}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;