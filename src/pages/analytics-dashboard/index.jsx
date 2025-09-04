import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MetricsCard from './components/MetricsCard';
import PerformanceChart from './components/PerformanceChart';
import VideoPerformanceCard from './components/VideoPerformanceCard';
import TrendingAnalysis from './components/TrendingAnalysis';
import SocialProofMetrics from './components/SocialProofMetrics';
import ComparisonTools from './components/ComparisonTools';
import RecommendationEngine from './components/RecommendationEngine';

import Button from '../../components/ui/Button';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [glitchActive, setGlitchActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Mock data for metrics cards
  const metricsData = [
    {
      title: "Total Views",
      value: 2847392,
      change: 23.5,
      changeType: "positive",
      icon: "Eye",
      neonColor: "primary"
    },
    {
      title: "Viral Videos",
      value: 47,
      change: 15.2,
      changeType: "positive",
      icon: "Zap",
      neonColor: "accent"
    },
    {
      title: "Engagement Rate",
      value: 8.7,
      change: -2.1,
      changeType: "negative",
      icon: "Heart",
      neonColor: "secondary"
    },
    {
      title: "Revenue",
      value: 12847,
      change: 31.8,
      changeType: "positive",
      icon: "DollarSign",
      neonColor: "success"
    }
  ];

  // Mock data for performance charts
  const performanceData = [
    { name: 'Jan', value: 145000 },
    { name: 'Feb', value: 189000 },
    { name: 'Mar', value: 234000 },
    { name: 'Apr', value: 298000 },
    { name: 'May', value: 387000 },
    { name: 'Jun', value: 445000 },
    { name: 'Jul', value: 523000 }
  ];

  const engagementData = [
    { name: 'Mon', value: 8.2 },
    { name: 'Tue', value: 7.8 },
    { name: 'Wed', value: 9.1 },
    { name: 'Thu', value: 8.7 },
    { name: 'Fri', value: 9.5 },
    { name: 'Sat', value: 10.2 },
    { name: 'Sun', value: 9.8 }
  ];

  // Mock data for video performance cards
  const videoPerformanceData = [
    {
      id: 1,
      title: "The Haunted Mirror That Shows Your Death",
      thumbnail: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=300&fit=crop",
      duration: "0:58",
      category: "Horror",
      categoryColor: "destructive",
      publishedAt: "2 days ago",
      views: 1247893,
      likes: 89234,
      comments: 12847,
      shares: 23891,
      viralScore: 94,
      engagementRate: 9.2,
      platforms: [
        { name: "TikTok", icon: "Smartphone", color: "primary", performance: 1100000 },
        { name: "YouTube", icon: "Play", color: "destructive", performance: 147893 }
      ]
    },
    {
      id: 2,
      title: "Fairy Tale Secrets Disney Doesn\'t Want You to Know",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      duration: "1:12",
      category: "Fairy Tales",
      categoryColor: "secondary",
      publishedAt: "5 days ago",
      views: 892347,
      likes: 67234,
      comments: 8934,
      shares: 15672,
      viralScore: 87,
      engagementRate: 8.4,
      platforms: [
        { name: "TikTok", icon: "Smartphone", color: "primary", performance: 650000 },
        { name: "YouTube", icon: "Play", color: "destructive", performance: 242347 }
      ]
    },
    {
      id: 3,
      title: "When Your Pet Acts Sus at 3AM",
      thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
      duration: "0:45",
      category: "Funny",
      categoryColor: "accent",
      publishedAt: "1 week ago",
      views: 634521,
      likes: 45892,
      comments: 6734,
      shares: 11234,
      viralScore: 76,
      engagementRate: 7.8,
      platforms: [
        { name: "TikTok", icon: "Smartphone", color: "primary", performance: 480000 },
        { name: "YouTube", icon: "Play", color: "destructive", performance: 154521 }
      ]
    }
  ];

  // Mock data for trending analysis
  const trendingData = [
    {
      id: 1,
      title: "Haunted Object Stories",
      category: "Horror",
      categoryColor: "destructive",
      icon: "Ghost",
      direction: "rising",
      change: 45.2,
      viralPotential: 92,
      engagement: 234567,
      reach: 1890234,
      shares: 45678,
      hashtags: ["haunted", "scary", "paranormal", "ghost"]
    },
    {
      id: 2,
      title: "Dark Fairy Tale Origins",
      category: "Fairy Tales",
      categoryColor: "secondary",
      icon: "BookOpen",
      direction: "rising",
      change: 32.8,
      viralPotential: 87,
      engagement: 189234,
      reach: 1456789,
      shares: 34567,
      hashtags: ["fairytale", "dark", "disney", "secrets"]
    },
    {
      id: 3,
      title: "Pet Conspiracy Theories",
      category: "Funny",
      categoryColor: "accent",
      icon: "Heart",
      direction: "falling",
      change: -12.3,
      viralPotential: 64,
      engagement: 123456,
      reach: 987654,
      shares: 23456,
      hashtags: ["pets", "funny", "conspiracy", "animals"]
    }
  ];

  // Mock data for social proof metrics
  const socialProofData = [
    {
      id: 1,
      label: "Total Followers",
      value: 847293,
      growth: 15.2,
      icon: "Users",
      color: "primary",
      goal: 1000000,
      subtitle: "Across all platforms",
      recentActivity: "+2.3K today"
    },
    {
      id: 2,
      label: "Share Rate",
      value: 12.7,
      growth: 8.4,
      icon: "Share",
      color: "secondary",
      subtitle: "Average per video (%)",
      recentActivity: "Peak at 3PM"
    },
    {
      id: 3,
      label: "Comments/Hour",
      value: 1847,
      growth: 23.1,
      icon: "MessageCircle",
      color: "accent",
      subtitle: "During viral peaks",
      recentActivity: "Live now"
    },
    {
      id: 4,
      label: "Viral Score",
      value: 89,
      growth: 12.5,
      icon: "Zap",
      color: "success",
      goal: 95,
      subtitle: "Content performance",
      recentActivity: "New record!"
    }
  ];

  // Mock data for comparison tools
  const comparisonData = {
    niches: [
      {
        name: "Horror",
        views: 1247000,
        engagement: 9200,
        shares: 23400,
        viralScore: 94,
        growth: 23.5,
        color: "destructive",
        icon: "Ghost"
      },
      {
        name: "Fairy Tales",
        views: 892000,
        engagement: 6700,
        shares: 15600,
        viralScore: 87,
        growth: 18.2,
        color: "secondary",
        icon: "BookOpen"
      },
      {
        name: "Funny",
        views: 634000,
        engagement: 4500,
        shares: 11200,
        viralScore: 76,
        growth: -5.3,
        color: "accent",
        icon: "Smile"
      }
    ],
    periods: [
      { metric: "Views", thisMonth: 85, lastMonth: 72 },
      { metric: "Engagement", thisMonth: 92, lastMonth: 78 },
      { metric: "Shares", thisMonth: 78, lastMonth: 65 },
      { metric: "Viral Score", thisMonth: 89, lastMonth: 76 },
      { metric: "Followers", thisMonth: 94, lastMonth: 82 }
    ],
    platforms: [
      {
        name: "TikTok",
        performance: 94,
        reach: 2340000,
        engagement: 9.2,
        bestTime: "7-9 PM",
        icon: "Smartphone"
      },
      {
        name: "YouTube Shorts",
        performance: 78,
        reach: 1890000,
        engagement: 7.8,
        bestTime: "8-10 PM",
        icon: "Play"
      },
      {
        name: "Instagram Reels",
        performance: 65,
        reach: 1234000,
        engagement: 6.4,
        bestTime: "6-8 PM",
        icon: "Instagram"
      }
    ]
  };

  // Mock data for AI recommendations
  const recommendationsData = [
    {
      id: 1,
      title: "Optimize Hook Timing",
      description: "Your horror videos perform 340% better when the hook appears within the first 2 seconds. Current average: 4.2s",
      priority: "high",
      impact: { type: "viral", value: 67 },
      timeToImplement: "5 min",
      effort: "Low",
      steps: [
        "Move your strongest hook to the first frame",
        "Use pattern interrupt within 1.5 seconds",
        "Add motion streak effect to grab attention",
        "Test with countdown timer overlay"
      ],
      copyFormula: "What you\'re about to see will haunt your dreams forever... but you CAN\'T look away",
      tags: ["Hook", "Timing", "Horror"]
    },
    {
      id: 2,
      title: "Leverage Forbidden Fruit Psychology",
      description: "Content with \'forbidden knowledge\' angles gets 230% more shares. Your fairy tale niche is perfect for this.",
      priority: "medium",
      impact: { type: "engagement", value: 45 },
      timeToImplement: "15 min",
      effort: "Medium",
      steps: [
        "Research dark fairy tale origins",
        "Create 'Disney doesn't want you to know' angle",
        "Add curiosity gap in thumbnail text",
        "Use binary choice ending"
      ],
      copyFormula: "The REAL story behind [Fairy Tale] that Disney BANNED from their movies...",
      tags: ["Psychology", "Fairy Tales", "Curiosity"]
    },
    {
      id: 3,
      title: "Implement Micro-Reward System",
      description: "Add confetti bursts and spark effects every 8-12 seconds to trigger dopamine release and increase watch time.",
      priority: "low",
      impact: { type: "reach", value: 28 },
      timeToImplement: "30 min",
      effort: "High",
      steps: [
        "Add particle effects at key moments",
        "Implement heartbeat pulse on CTAs",
        "Use color inversion for pattern interrupts",
        "Add cursor-chase animations"
      ],
      copyFormula: "Each reveal gets MORE shocking... wait until you see what happens at 0:47",
      tags: ["Animation", "Dopamine", "Retention"]
    }
  ];

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleVideoDetails = (videoId) => {
    navigate(`/video-creator?edit=${videoId}`);
  };

  const handleTrendClick = (trend) => {
    navigate(`/video-creator?template=${trend?.category?.toLowerCase()}&trend=${trend?.id}`);
  };

  const handleApplyRecommendation = (recommendation) => {
    navigate(`/video-creator?recommendation=${recommendation?.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[60px] pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 ${glitchActive ? 'glitch-effect' : ''}`}>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track your viral content performance and optimize for maximum engagement
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-2">
                {timeRanges?.map((range) => (
                  <button
                    key={range?.value}
                    onClick={() => setSelectedTimeRange(range?.value)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-neon ${
                      selectedTimeRange === range?.value
                        ? 'border-primary bg-primary/10 text-primary neon-glow-primary' :'border-border bg-muted/20 text-muted-foreground hover:border-accent hover:text-accent'
                    }`}
                  >
                    {range?.label}
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                loading={refreshing}
                onClick={handleRefresh}
                className="transition-neon hover:neon-glow-primary"
              >
                Refresh
              </Button>
              
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                iconPosition="left"
                className="pulse-cta"
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                neonColor={metric?.neonColor}
                isAnimated={true}
              />
            ))}
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PerformanceChart
              data={performanceData}
              title="Views Over Time"
              type="area"
              neonColor="primary"
            />
            <PerformanceChart
              data={engagementData}
              title="Engagement Rate"
              type="line"
              neonColor="secondary"
            />
          </div>

          {/* Video Performance Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Top Performing Videos</h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="ArrowRight"
                iconPosition="right"
                onClick={() => navigate('/dashboard')}
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoPerformanceData?.map((video) => (
                <VideoPerformanceCard
                  key={video?.id}
                  video={video}
                  onViewDetails={handleVideoDetails}
                />
              ))}
            </div>
          </div>

          {/* Trending Analysis and Social Proof */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TrendingAnalysis
              trends={trendingData}
              onTrendClick={handleTrendClick}
            />
            <SocialProofMetrics
              metrics={socialProofData}
            />
          </div>

          {/* Comparison Tools */}
          <div className="mb-8">
            <ComparisonTools
              comparisonData={comparisonData}
              onComparisonChange={() => {}}
            />
          </div>

          {/* AI Recommendations */}
          <div className="mb-8">
            <RecommendationEngine
              recommendations={recommendationsData}
              onApplyRecommendation={handleApplyRecommendation}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6 surface-elevation">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                iconName="Video"
                iconPosition="left"
                onClick={() => navigate('/video-creator')}
                className="justify-start transition-neon hover:neon-glow-primary"
              >
                Create New Video
              </Button>
              <Button
                variant="outline"
                iconName="Library"
                iconPosition="left"
                onClick={() => navigate('/template-library')}
                className="justify-start transition-neon hover:neon-glow-accent"
              >
                Browse Templates
              </Button>
              <Button
                variant="outline"
                iconName="LayoutDashboard"
                iconPosition="left"
                onClick={() => navigate('/dashboard')}
                className="justify-start transition-neon hover:neon-glow-secondary"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;