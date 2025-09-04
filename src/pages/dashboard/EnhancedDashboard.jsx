import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProjectCard from './components/ProjectCard';
import MetricsWidget from './components/MetricsWidget';
import QuickActions from './components/QuickActions';
import TrendingFeed from './components/TrendingFeed';
import ProgressTracker from './components/ProgressTracker';
import AnalyticsChart from './components/AnalyticsChart';
import CollaborationPanel from '../../components/collaboration/CollaborationPanel';
import PredictiveAnalytics from '../../components/analytics/PredictiveAnalytics';
import ThemeSelector from '../../components/theme/ThemeSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [motionStreaks, setMotionStreaks] = useState([]);
  const [confettiActive, setConfettiActive] = useState(false);
  const [activeWidget, setActiveWidget] = useState('overview');
  const [collaborators, setCollaborators] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Enhanced project data with collaboration info
  const recentProjects = [
    {
      id: 1,
      title: "The Haunted Mirror - Horror Story That Will Keep You Awake",
      thumbnail: "https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg",
      category: "Horror",
      status: "published",
      duration: "0:58",
      views: 2340000,
      engagement: 94,
      viralScore: 96,
      createdAt: "2 days ago",
      collaborators: ['SC', 'MJ'],
      aiOptimized: true,
      socialPlatforms: ['tiktok', 'youtube', 'instagram']
    },
    {
      id: 2,
      title: "Cinderella's Dark Secret - Fairy Tale Retold",
      thumbnail: "https://images.pixabay.com/photo/2017/09/04/16/58/fairy-tale-2715309_1280.jpg",
      category: "Fairy Tales",
      status: "published",
      duration: "1:02",
      views: 1850000,
      engagement: 87,
      viralScore: 89,
      createdAt: "4 days ago",
      collaborators: ['SC'],
      aiOptimized: true,
      socialPlatforms: ['tiktok', 'youtube']
    },
    {
      id: 3,
      title: "Epic Cooking Fail That Broke The Internet",
      thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
      category: "Funny",
      status: "processing",
      duration: "0:45",
      views: 0,
      engagement: 0,
      viralScore: 0,
      createdAt: "1 hour ago",
      collaborators: ['SC', 'MJ', 'AB'],
      aiOptimized: false,
      socialPlatforms: []
    }
  ];

  useEffect(() => {
    // Enhanced motion effects
    const streakInterval = setInterval(() => {
      const newStreak = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#39FF14', '#FF00FF', '#00FFFF', '#FF073A'][Math.floor(Math.random() * 4)]
      };
      
      setMotionStreaks(prev => [...prev, newStreak]);
      
      setTimeout(() => {
        setMotionStreaks(prev => prev?.filter(streak => streak?.id !== newStreak?.id));
      }, 2000);
    }, 2000);

    // Mock notifications
    const notificationInterval = setInterval(() => {
      const mockNotifications = [
        { id: Date.now(), type: 'collaboration', message: 'Sarah Chen joined your project', time: 'now' },
        { id: Date.now() + 1, type: 'ai', message: 'AI optimization completed for Horror Story', time: '2m ago' },
        { id: Date.now() + 2, type: 'social', message: 'Video published to TikTok successfully', time: '5m ago' }
      ];
      setNotifications(mockNotifications);
    }, 10000);

    return () => {
      clearInterval(streakInterval);
      clearInterval(notificationInterval);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 1000);
    }, 500);
  }, []);

  const handleCreateEnhanced = () => {
    navigate('/video-creator-enhanced');
  };

  const handleCreateClassic = () => {
    navigate('/video-creator');
  };

  const widgetTabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'collaboration', label: 'Team', icon: 'Users' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'theme', label: 'Theme', icon: 'Palette' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Enhanced Motion Streaks */}
      {motionStreaks?.map(streak => (
        <div
          key={streak?.id}
          className="fixed w-1 h-20 opacity-60 pointer-events-none z-10"
          style={{
            left: streak?.x,
            top: streak?.y,
            background: `linear-gradient(to bottom, transparent, ${streak?.color}, transparent)`,
            animation: 'slideDown 2s linear forwards',
            boxShadow: `0 0 10px ${streak?.color}`
          }}
        />
      ))}

      <main className="pt-[60px] pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Enhanced Welcome Section */}
          <div className={`mb-8 text-center transition-neon ${confettiActive ? 'neon-glow-primary' : ''}`}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Welcome to Your <span className="text-primary">Enhanced</span> Viral Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Create hypnotic short-form videos with AI optimization, real-time collaboration, 
              and direct social media publishing. Your next viral hit is just one click away.
            </p>
            
            {/* New Features Highlight */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🤖 AI Optimization
              </span>
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                👥 Real-time Collaboration
              </span>
              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                📱 Social Publishing
              </span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                📊 Predictive Analytics
              </span>
            </div>
          </div>

          {/* Enhanced Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsWidget
              title="Total Views"
              value={8370000}
              change="+23.5%"
              icon="Eye"
              color="primary"
              trend="up"
              subtitle="AI-optimized content"
            />
            <MetricsWidget
              title="Engagement Rate"
              value={89}
              change="+5.2%"
              icon="Heart"
              color="secondary"
              trend="up"
              subtitle="Cross-platform average"
            />
            <MetricsWidget
              title="Viral Score"
              value={87}
              change="+12.8%"
              icon="TrendingUp"
              color="accent"
              trend="up"
              subtitle="ML prediction accuracy"
            />
            <MetricsWidget
              title="Team Projects"
              value={12}
              change="+3"
              icon="Users"
              color="warning"
              trend="up"
              subtitle={`${collaborators} active collaborators`}
            />
          </div>

          {/* Notifications Bar */}
          {notifications.length > 0 && (
            <div className="mb-8 bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center space-x-2">
                  <Icon name="Bell" size={16} />
                  <span>Recent Activity</span>
                </h3>
                <Button variant="ghost" size="sm">
                  <Icon name="X" size={14} />
                </Button>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 3).map(notification => (
                  <div key={notification.id} className="flex items-center space-x-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      notification.type === 'collaboration' ? 'bg-primary' :
                      notification.type === 'ai' ? 'bg-secondary' : 'bg-accent'
                    }`} />
                    <span className="text-foreground">{notification.message}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{notification.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Projects & Analytics */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Enhanced Project Creation */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                  Create New Project
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                       onClick={handleCreateEnhanced}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Sparkles" size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Enhanced Creator</h3>
                        <p className="text-xs text-muted-foreground">AI + Collaboration</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Full-featured creator with AI optimization, real-time collaboration, and social publishing
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">AI</span>
                      <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs">Team</span>
                      <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">Social</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg hover:border-secondary transition-colors cursor-pointer"
                       onClick={handleCreateClassic}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Video" size={20} className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Classic Creator</h3>
                        <p className="text-xs text-muted-foreground">Simple & Fast</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Streamlined video creation focused on speed and simplicity
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs">Fast</span>
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">Simple</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Projects with Enhanced Info */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-foreground">
                    Recent Projects
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={handleCreateEnhanced}
                    className="text-primary hover:text-primary-foreground hover:bg-primary"
                  >
                    New Project
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProjects?.map(project => (
                    <div key={project?.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="relative">
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {project.aiOptimized && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Icon name="Sparkles" size={12} className="text-primary-foreground" />
                            </div>
                          )}
                          {project.collaborators.length > 1 && (
                            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                              <Icon name="Users" size={12} className="text-secondary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span>{project.category}</span>
                          <span>{project.duration}</span>
                        </div>
                        
                        {/* Enhanced Project Stats */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Views:</span>
                            <span className="text-foreground font-medium">
                              {project.views > 0 ? `${(project.views / 1000000).toFixed(1)}M` : 'Processing...'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Viral Score:</span>
                            <span className={`font-medium ${
                              project.viralScore >= 90 ? 'text-green-500' :
                              project.viralScore >= 70 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {project.viralScore > 0 ? `${project.viralScore}%` : 'Analyzing...'}
                            </span>
                          </div>
                          
                          {/* Collaborators */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Team:</span>
                            <div className="flex -space-x-1">
                              {project.collaborators.map((avatar, index) => (
                                <div key={index} className="w-5 h-5 bg-primary rounded-full border border-card flex items-center justify-center text-xs text-primary-foreground">
                                  {avatar}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Social Platforms */}
                          {project.socialPlatforms.length > 0 && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Published:</span>
                              <div className="flex space-x-1">
                                {project.socialPlatforms.map(platform => (
                                  <div key={platform} className="w-4 h-4 bg-accent/20 rounded text-accent flex items-center justify-center">
                                    <Icon name="Check" size={8} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics Chart */}
              <AnalyticsChart />
            </div>

            {/* Right Column - Enhanced Widgets */}
            <div className="space-y-8">
              
              {/* Widget Tab Navigation */}
              <div className="bg-card rounded-lg border border-border p-2">
                <div className="grid grid-cols-2 gap-1">
                  {widgetTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveWidget(tab.id)}
                      className={`p-2 rounded text-xs font-medium transition-colors ${
                        activeWidget === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab.icon} size={14} className="mx-auto mb-1" />
                      <div>{tab.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Widget Content */}
              {activeWidget === 'overview' && (
                <>
                  <QuickActions />
                  <ProgressTracker />
                  <TrendingFeed />
                </>
              )}

              {activeWidget === 'collaboration' && (
                <CollaborationPanel
                  projectId="dashboard"
                  onCollaboratorChange={setCollaborators}
                />
              )}

              {activeWidget === 'analytics' && (
                <PredictiveAnalytics
                  script={{ frames: [] }}
                  niche="horror"
                />
              )}

              {activeWidget === 'theme' && (
                <ThemeSelector
                  onThemeChange={(theme) => console.log('Theme changed:', theme)}
                />
              )}
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Ready to Create Your Next Viral Hit?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of creators using our AI-powered tools with real-time collaboration 
              and direct social publishing to generate millions of views.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                iconName="Video"
                iconPosition="left"
                onClick={() => navigate('/faceless-studio')}
                className="bg-red-500 text-white hover:bg-red-600 pulse-cta"
              >
                🔥 Faceless Studio
              </Button>
              <Button
                variant="default"
                size="lg"
                iconName="Sparkles"
                iconPosition="left"
                onClick={handleCreateEnhanced}
                className="bg-primary text-primary-foreground hover:bg-primary/90 pulse-cta"
              >
                Enhanced Creator
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="Library"
                iconPosition="left"
                onClick={() => navigate('/template-library')}
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100vh);
            opacity: 0;
          }
          to {
            transform: translateY(100vh);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedDashboard;