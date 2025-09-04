import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProjectCard from './components/ProjectCard';
import MetricsWidget from './components/MetricsWidget';
import QuickActions from './components/QuickActions';
import TrendingFeed from './components/TrendingFeed';
import ProgressTracker from './components/ProgressTracker';
import AnalyticsChart from './components/AnalyticsChart';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [motionStreaks, setMotionStreaks] = useState([]);
  const [confettiActive, setConfettiActive] = useState(false);

  // Mock project data
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
      createdAt: "2 days ago"
    },
    {
      id: 2,
      title: "Cinderella\'s Dark Secret - Fairy Tale Retold",
      thumbnail: "https://images.pixabay.com/photo/2017/09/04/16/58/fairy-tale-2715309_1280.jpg",
      category: "Fairy Tales",
      status: "published",
      duration: "1:02",
      views: 1850000,
      engagement: 87,
      viralScore: 89,
      createdAt: "4 days ago"
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
      createdAt: "1 hour ago"
    },
    {
      id: 4,
      title: "The Cursed Doll That Moves At Night",
      thumbnail: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpg",
      category: "Horror",
      status: "draft",
      duration: "0:52",
      views: 0,
      engagement: 0,
      viralScore: 0,
      createdAt: "3 hours ago"
    },
    {
      id: 5,
      title: "Rapunzel\'s Hair Salon Business Empire",
      thumbnail: "https://images.pixabay.com/photo/2016/03/09/09/22/workplace-1245776_1280.jpg",
      category: "Fairy Tales",
      status: "published",
      duration: "1:15",
      views: 980000,
      engagement: 82,
      viralScore: 78,
      createdAt: "1 week ago"
    },
    {
      id: 6,
      title: "When Your Pet Becomes Your Boss - Comedy Gold",
      thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
      category: "Funny",
      status: "published",
      duration: "0:38",
      views: 3200000,
      engagement: 91,
      viralScore: 93,
      createdAt: "5 days ago"
    }
  ];

  useEffect(() => {
    // Motion streak effects for vertical attention flow
    const streakInterval = setInterval(() => {
      const newStreak = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#39FF14', '#FF00FF', '#00FFFF']?.[Math.floor(Math.random() * 3)]
      };
      
      setMotionStreaks(prev => [...prev, newStreak]);
      
      setTimeout(() => {
        setMotionStreaks(prev => prev?.filter(streak => streak?.id !== newStreak?.id));
      }, 2000);
    }, 3000);

    return () => clearInterval(streakInterval);
  }, []);

  useEffect(() => {
    // Welcome confetti burst
    setTimeout(() => {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 1000);
    }, 500);
  }, []);

  const handleCreateFirst = () => {
    navigate('/video-creator');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Motion Streaks */}
      {motionStreaks?.map(streak => (
        <div
          key={streak?.id}
          className="fixed w-1 h-20 opacity-60 pointer-events-none z-10"
          style={{
            left: streak?.x,
            top: streak?.y,
            background: `linear-gradient(to bottom, transparent, ${streak?.color}, transparent)`,
            animation: 'slideDown 2s linear forwards'
          }}
        />
      ))}
      {/* Main Content */}
      <main className="pt-[60px] pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Section */}
          <div className={`
            mb-8 text-center transition-neon
            ${confettiActive ? 'neon-glow-primary' : ''}
          `}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Welcome to Your <span className="text-primary">Viral</span> Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create hypnotic short-form videos that capture attention and drive engagement. 
              Your next viral hit is just one click away.
            </p>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsWidget
              title="Total Views"
              value={8370000}
              change="+23.5%"
              icon="Eye"
              color="primary"
              trend="up"
            />
            <MetricsWidget
              title="Engagement Rate"
              value={89}
              change="+5.2%"
              icon="Heart"
              color="secondary"
              trend="up"
            />
            <MetricsWidget
              title="Viral Score"
              value={87}
              change="+12.8%"
              icon="TrendingUp"
              color="accent"
              trend="up"
            />
            <MetricsWidget
              title="Active Projects"
              value={12}
              change="+3"
              icon="Video"
              color="warning"
              trend="up"
            />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Projects & Analytics */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Recent Projects */}
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
                    onClick={handleCreateFirst}
                    className="text-primary hover:text-primary-foreground hover:bg-primary"
                  >
                    New Project
                  </Button>
                </div>

                {recentProjects?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentProjects?.map(project => (
                      <ProjectCard key={project?.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <Icon name="Video" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      No Projects Yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Start creating your first viral video to see it here
                    </p>
                    <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={handleCreateFirst}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Create Your First Video
                    </Button>
                  </div>
                )}
              </div>

              {/* Analytics Chart */}
              <AnalyticsChart />
            </div>

            {/* Right Column - Actions & Feed */}
            <div className="space-y-8">
              
              {/* Quick Actions */}
              <QuickActions />
              
              {/* Progress Tracker */}
              <ProgressTracker />
              
              {/* Trending Feed */}
              <TrendingFeed />
            </div>
          </div>

          {/* Motivational CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Ready to Create Your Next Viral Hit?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of creators who are already using our AI-powered tools to generate 
              millions of views. Your breakthrough moment is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                iconName="Zap"
                iconPosition="left"
                onClick={() => navigate('/video-creator')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 pulse-cta"
              >
                Start Creating Now
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

export default Dashboard;