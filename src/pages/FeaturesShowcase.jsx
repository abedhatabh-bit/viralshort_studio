import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import CollaborationPanel from '../components/collaboration/CollaborationPanel';
import AIOptimizer from '../components/ai/AIOptimizer';
import SocialPublisher from '../components/social/SocialPublisher';
import PredictiveAnalytics from '../components/analytics/PredictiveAnalytics';
import TouchVideoEditor from '../components/mobile/TouchVideoEditor';
import ThemeSelector from '../components/theme/ThemeSelector';
import AccessibilityPanel from '../components/accessibility/AccessibilityPanel';

const FeaturesShowcase = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState('collaboration');

  const features = [
    {
      id: 'collaboration',
      title: 'Real-Time Collaboration',
      description: 'Work together with your team in real-time with live cursors, activity feeds, and instant sync.',
      icon: 'Users',
      color: 'primary',
      component: CollaborationPanel,
      benefits: ['Live user presence', 'Activity tracking', 'Team invitations', 'Real-time sync']
    },
    {
      id: 'ai',
      title: 'AI Optimization',
      description: 'Get AI-powered suggestions to maximize your video\'s viral potential and engagement.',
      icon: 'Sparkles',
      color: 'secondary',
      component: AIOptimizer,
      benefits: ['Viral score analysis', 'Content optimization', 'Performance predictions', 'Smart suggestions']
    },
    {
      id: 'social',
      title: 'Social Publishing',
      description: 'Publish directly to TikTok, YouTube, Instagram, and more with platform-specific optimization.',
      icon: 'Share',
      color: 'accent',
      component: SocialPublisher,
      benefits: ['Multi-platform publishing', 'Auto-optimization', 'Scheduling', 'Performance tracking']
    },
    {
      id: 'analytics',
      title: 'Predictive Analytics',
      description: 'ML-powered predictions for viral potential, audience demographics, and optimal timing.',
      icon: 'TrendingUp',
      color: 'green-500',
      component: PredictiveAnalytics,
      benefits: ['Viral predictions', 'Audience insights', 'Optimal timing', 'Competitor analysis']
    },
    {
      id: 'mobile',
      title: 'Touch Editor',
      description: 'Mobile-optimized editing with gesture controls, pinch-to-zoom, and touch-friendly interface.',
      icon: 'Smartphone',
      color: 'blue-500',
      component: TouchVideoEditor,
      benefits: ['Gesture controls', 'Mobile optimization', 'Touch interface', 'Responsive design']
    },
    {
      id: 'themes',
      title: 'Advanced Themes',
      description: 'Multiple theme options with customization, dark/light modes, and accessibility features.',
      icon: 'Palette',
      color: 'purple-500',
      component: ThemeSelector,
      benefits: ['Multiple themes', 'Customization', 'Dark/light modes', 'Export/import']
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: 'Full accessibility support with screen readers, keyboard navigation, and high contrast.',
      icon: 'Users',
      color: 'orange-500',
      component: AccessibilityPanel,
      benefits: ['Screen reader support', 'Keyboard navigation', 'High contrast', 'Accessibility checks']
    }
  ];

  const currentFeature = features.find(f => f.id === activeDemo);
  const DemoComponent = currentFeature?.component;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-[60px] pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              <span className="text-primary">Enhanced</span> Features Showcase
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover all the powerful new features that make ViralShort Studio the most advanced 
              video creation platform for content creators and teams.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🚀 7 New Features
              </span>
              <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                🤖 AI-Powered
              </span>
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                👥 Team Collaboration
              </span>
              <span className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                📱 Mobile Optimized
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                iconName="Sparkles"
                onClick={() => navigate('/video-creator-enhanced')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Try Enhanced Creator
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="ArrowLeft"
                onClick={() => navigate('/dashboard-enhanced')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Feature List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-heading font-bold text-foreground mb-6">Features</h2>
              <div className="space-y-2">
                {features.map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveDemo(feature.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      activeDemo === feature.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 bg-${feature.color}/10 rounded-lg flex items-center justify-center`}>
                        <Icon name={feature.icon} size={16} className={`text-${feature.color}`} />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{feature.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {feature.benefits.slice(0, 2).map(benefit => (
                        <span key={benefit} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Demo */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 bg-${currentFeature?.color}/10 rounded-lg flex items-center justify-center`}>
                    <Icon name={currentFeature?.icon} size={20} className={`text-${currentFeature?.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-foreground">{currentFeature?.title}</h2>
                    <p className="text-sm text-muted-foreground">{currentFeature?.description}</p>
                  </div>
                </div>

                {/* Live Demo */}
                <div className="border border-border rounded-lg p-4 bg-background">
                  {DemoComponent && (
                    <DemoComponent
                      projectId="demo"
                      script={{ frames: [{ text: 'Demo frame content' }] }}
                      niche="horror"
                      video={null}
                      onCollaboratorChange={() => {}}
                      onOptimizationApply={() => {}}
                      onPublish={() => {}}
                      onFrameUpdate={() => {}}
                      onGestureAction={() => {}}
                      onThemeChange={() => {}}
                      onSettingsChange={() => {}}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Feature Details */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-heading font-bold text-foreground mb-6">Benefits</h2>
              <div className="space-y-4">
                {currentFeature?.benefits.map(benefit => (
                  <div key={benefit} className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border">
                    <Icon name="Check" size={16} className="text-green-500" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Technical Specs */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Technical Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Technology:</span>
                    <span className="text-foreground">React 18 + WebRTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Performance:</span>
                    <span className="text-foreground">Real-time sync</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compatibility:</span>
                    <span className="text-foreground">All modern browsers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mobile:</span>
                    <span className="text-foreground">Fully responsive</span>
                  </div>
                </div>
              </div>

              {/* Quick Start */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Start</h3>
                <div className="space-y-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/video-creator-enhanced')}
                  >
                    <Icon name="Play" size={14} className="mr-2" />
                    Try This Feature
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/template-library')}
                  >
                    <Icon name="Library" size={14} className="mr-2" />
                    Browse Templates
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">
              Classic vs Enhanced Creator
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Classic Creator */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="Video" size={24} className="text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground">Classic Creator</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Simple and fast video creation for individual creators
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-green-500" />
                    <span className="text-sm text-foreground">Basic video creation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-green-500" />
                    <span className="text-sm text-foreground">Template library</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-green-500" />
                    <span className="text-sm text-foreground">Export options</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-green-500" />
                    <span className="text-sm text-foreground">Mobile responsive</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/video-creator')}
                >
                  Use Classic Creator
                </Button>
              </div>

              {/* Enhanced Creator */}
              <div className="bg-card rounded-lg border border-primary p-6 ring-2 ring-primary/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Enhanced Creator</h3>
                  <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                    NEW
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Full-featured creator with AI, collaboration, and social publishing
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-green-500" />
                    <span className="text-sm text-foreground">Everything in Classic +</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Sparkles" size={14} className="text-primary" />
                    <span className="text-sm text-foreground">AI optimization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={14} className="text-primary" />
                    <span className="text-sm text-foreground">Real-time collaboration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Share" size={14} className="text-primary" />
                    <span className="text-sm text-foreground">Social media publishing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="TrendingUp" size={14} className="text-primary" />
                    <span className="text-sm text-foreground">Predictive analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Smartphone" size={14} className="text-primary" />
                    <span className="text-sm text-foreground">Touch editor</span>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate('/video-creator-enhanced')}
                >
                  Use Enhanced Creator
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;