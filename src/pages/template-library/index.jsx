import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TemplateCard from './components/TemplateCard';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import PreviewModal from './components/PreviewModal';
import FeaturedSection from './components/FeaturedSection';
import SocialProofSection from './components/SocialProofSection';

const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [motionStreaks, setMotionStreaks] = useState([]);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'horror', name: 'Horror' },
    { id: 'fairy-tales', name: 'Fairy Tales' },
    { id: 'funny', name: 'Comedy' }
  ];

  const mockTemplates = [
    {
      id: 1,
      title: "Midnight Horror Hook",
      description: "Psychological horror template with jump scares and suspense building. Perfect for viral horror content.",
      niche: "horror",
      difficulty: "intermediate",
      thumbnail: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=600&fit=crop",
      views: 2847392,
      viralRate: 87,
      usageCount: 15847,
      duration: 15,
      featured: true,
      tags: ["horror", "suspense", "viral", "psychological", "dark"],
      features: [
        "6-frame funnel sequence",
        "Hypnotic keyword openers",
        "Pattern interrupt glitches",
        "Heartbeat pulse CTAs",
        "Micro-reward animations"
      ],
      frames: [
        {
          image: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=600&fit=crop",
          text: "What\'s hiding in your room?",
          subtitle: "You won\'t believe what happens next..."
        },
        {
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
          text: "The shadow moved...",
          subtitle: "But nobody was there"
        },
        {
          image: "https://images.unsplash.com/photo-1520637736862-4d197d17c90a?w=400&h=600&fit=crop",
          text: "WATCH TILL THE END",
          subtitle: "The truth will shock you"
        }
      ]
    },
    {
      id: 2,
      title: "Fairy Tale Magic",
      description: "Enchanting fairy tale template with magical transitions and dreamy aesthetics for storytelling content.",
      niche: "fairy-tales",
      difficulty: "beginner",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      views: 1234567,
      viralRate: 92,
      usageCount: 8934,
      duration: 20,
      featured: true,
      tags: ["fairy-tale", "magic", "storytelling", "dreamy", "enchanting"],
      features: [
        "Magical particle effects",
        "Dreamy color transitions",
        "Storytelling hooks",
        "Emotional triggers",
        "Fantasy aesthetics"
      ],
      frames: [
        {
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
          text: "Once upon a time...",
          subtitle: "A secret was hidden"
        },
        {
          image: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=600&fit=crop",
          text: "Magic was real",
          subtitle: "But only few knew"
        }
      ]
    },
    {
      id: 3,
      title: "Comedy Gold Rush",
      description: "High-energy comedy template with perfect timing and viral humor patterns for maximum engagement.",
      niche: "funny",
      difficulty: "advanced",
      thumbnail: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=400&h=600&fit=crop",
      views: 3456789,
      viralRate: 95,
      usageCount: 12456,
      duration: 12,
      featured: false,
      tags: ["comedy", "humor", "viral", "timing", "engagement"],
      features: [
        "Perfect comedic timing",
        "Viral humor patterns",
        "Engagement hooks",
        "Reaction triggers",
        "Share-worthy moments"
      ],
      frames: [
        {
          image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=400&h=600&fit=crop",
          text: "When you realize...",
          subtitle: "This is too funny"
        }
      ]
    },
    {
      id: 4,
      title: "Dark Mystery Reveal",
      description: "Suspenseful mystery template with cliffhanger hooks and psychological engagement patterns.",
      niche: "horror",
      difficulty: "intermediate",
      thumbnail: "https://images.pixabay.com/photo/2017/10/25/16/54/african-lion-2888519_1280.jpg?w=400&h=600&fit=crop",
      views: 1876543,
      viralRate: 89,
      usageCount: 7823,
      duration: 18,
      featured: false,
      tags: ["mystery", "suspense", "cliffhanger", "psychological", "reveal"],
      features: [
        "Mystery building sequences",
        "Cliffhanger endings",
        "Psychological hooks",
        "Suspense timing",
        "Reveal mechanics"
      ],
      frames: [
        {
          image: "https://images.pixabay.com/photo/2017/10/25/16/54/african-lion-2888519_1280.jpg?w=400&h=600&fit=crop",
          text: "The truth behind...",
          subtitle: "Will change everything"
        }
      ]
    },
    {
      id: 5,
      title: "Magical Princess Story",
      description: "Whimsical princess story template with emotional storytelling and magical visual effects.",
      niche: "fairy-tales",
      difficulty: "beginner",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      views: 987654,
      viralRate: 88,
      usageCount: 5432,
      duration: 25,
      featured: false,
      tags: ["princess", "magical", "storytelling", "emotional", "whimsical"],
      features: [
        "Emotional storytelling",
        "Magical transitions",
        "Princess aesthetics",
        "Heartwarming moments",
        "Fantasy elements"
      ],
      frames: [
        {
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
          text: "Every princess has...",
          subtitle: "A hidden power"
        }
      ]
    },
    {
      id: 6,
      title: "Viral Prank Master",
      description: "Ultimate prank template with perfect setup, execution, and reaction capture for maximum virality.",
      niche: "funny",
      difficulty: "advanced",
      thumbnail: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=400&h=600&fit=crop",
      views: 4567890,
      viralRate: 97,
      usageCount: 18765,
      duration: 10,
      featured: true,
      tags: ["prank", "viral", "reaction", "setup", "execution"],
      features: [
        "Perfect prank setup",
        "Reaction capture",
        "Viral mechanics",
        "Timing precision",
        "Share triggers"
      ],
      frames: [
        {
          image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=400&h=600&fit=crop",
          text: "Watch their reaction...",
          subtitle: "You won\'t believe it"
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTemplates(mockTemplates);
      setFilteredTemplates(mockTemplates);
      setLoading(false);
    }, 1000);

    // Motion streaks animation
    const createMotionStreaks = () => {
      const streaks = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2000
      }));
      setMotionStreaks(streaks);
    };

    createMotionStreaks();
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered?.filter(template => template?.niche === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered?.filter(template =>
        template?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        template?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      );
    }

    // Sort templates
    switch (sortBy) {
      case 'popular':
        filtered?.sort((a, b) => b?.views - a?.views);
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.id - a?.id);
        break;
      case 'viral-rate':
        filtered?.sort((a, b) => b?.viralRate - a?.viralRate);
        break;
      case 'views':
        filtered?.sort((a, b) => b?.views - a?.views);
        break;
      default:
        break;
    }

    setFilteredTemplates(filtered);
  }, [templates, activeCategory, searchQuery, sortBy]);

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleSelectTemplate = (template) => {
    // Validate template data before navigation
    if (!template || typeof template !== 'object' || !template.id) {
      console.error('Invalid template data');
      return;
    }
    
    // Sanitize template data
    const sanitizedTemplate = {
      id: Number(template.id),
      title: String(template.title || '').substring(0, 100),
      niche: String(template.niche || '').substring(0, 50),
      difficulty: String(template.difficulty || 'beginner').substring(0, 20),
      duration: Number(template.duration) || 15,
      viralRate: Number(template.viralRate) || 0,
      tags: Array.isArray(template.tags) ? template.tags.slice(0, 10) : [],
      features: Array.isArray(template.features) ? template.features.slice(0, 10) : []
    };
    
    navigate('/video-creator', { state: { selectedTemplate: sanitizedTemplate } });
  };

  const getTemplateCounts = () => {
    const counts = { all: templates?.length };
    categories?.forEach(category => {
      if (category?.id !== 'all') {
        counts[category.id] = templates?.filter(t => t?.niche === category?.id)?.length;
      }
    });
    return counts;
  };

  const featuredTemplates = templates?.filter(template => template?.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-[60px] pb-[80px] md:pb-0">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 neon-glow-primary"></div>
                <p className="text-muted-foreground">Loading viral templates...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Motion Streaks */}
      {motionStreaks?.map((streak) => (
        <div
          key={streak?.id}
          className="fixed top-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-20 pointer-events-none"
          style={{
            left: `${streak?.x}%`,
            animationDelay: `${streak?.delay}ms`,
            animation: 'pulse 3s infinite'
          }}
        />
      ))}
      <div className="pt-[60px] pb-[80px] md:pb-0">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              <span className="text-primary neon-glow-primary">Viral</span> Template Library
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover proven templates that have generated millions of views. 
              Choose from horror, fairy tales, and comedy niches with built-in viral mechanics.
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Zap" size={16} className="text-primary" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span>Viral Proven</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={16} className="text-accent" />
                <span>Quick Setup</span>
              </div>
            </div>
          </div>

          {/* Featured Section */}
          <FeaturedSection
            featuredTemplates={featuredTemplates}
            onPreview={handlePreview}
            onSelect={handleSelectTemplate}
          />

          {/* Search and Filters */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            sortBy={sortBy}
          />

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            templateCounts={getTemplateCounts()}
          />

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-heading font-bold text-foreground">
                {activeCategory === 'all' ? 'All Templates' : categories?.find(c => c?.id === activeCategory)?.name}
              </h2>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded">
                {filteredTemplates?.length} templates
              </span>
            </div>
            
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconPosition="left"
                onClick={() => setSearchQuery('')}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear search
              </Button>
            )}
          </div>

          {/* Templates Grid */}
          {filteredTemplates?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {filteredTemplates?.map((template) => (
                <TemplateCard
                  key={template?.id}
                  template={template}
                  onPreview={handlePreview}
                  onSelect={handleSelectTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Social Proof Section */}
          <SocialProofSection />

          {/* CTA Section */}
          <div className="text-center bg-card border border-primary rounded-lg p-8 neon-glow-primary">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Ready to Create Your Viral Video?
            </h2>
            <p className="text-muted-foreground mb-6">
              Choose a template and start creating content that gets millions of views
            </p>
            <Button
              variant="default"
              size="lg"
              iconName="Video"
              iconPosition="left"
              onClick={() => navigate('/video-creator')}
              className="pulse-cta neon-glow-primary"
            >
              Start Creating Now
            </Button>
          </div>
        </div>
      </div>
      {/* Preview Modal */}
      <PreviewModal
        template={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelect={handleSelectTemplate}
      />
    </div>
  );
};

export default TemplateLibrary;