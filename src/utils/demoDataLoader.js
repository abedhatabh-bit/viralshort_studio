/**
 * Demo Data Loader - Professional Sample Content
 * Loads realistic sample data for testing all features
 */

import { sampleProjects, sampleScript, sampleCollaborators, sampleAnalytics, sampleFacelessVideo } from './testData';

class DemoDataLoader {
  constructor() {
    this.loaded = false;
    this.data = {};
  }

  async loadAll() {
    if (this.loaded) return this.data;

    console.log('📦 Loading demo data...');

    try {
      // Load all demo data
      this.data = {
        projects: await this.loadProjects(),
        scripts: await this.loadScripts(),
        collaborators: await this.loadCollaborators(),
        analytics: await this.loadAnalytics(),
        facelessVideos: await this.loadFacelessVideos(),
        templates: await this.loadTemplates(),
        themes: await this.loadThemes()
      };

      this.loaded = true;
      console.log('✅ Demo data loaded successfully');
      return this.data;

    } catch (error) {
      console.error('❌ Failed to load demo data:', error);
      throw error;
    }
  }

  async loadProjects() {
    // Enhanced sample projects with more variety
    return [
      ...sampleProjects,
      {
        id: 'project_3',
        title: 'Life Hack: Save $1000 Monthly',
        type: 'life-hacks',
        status: 'draft',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
        duration: 45,
        views: 0,
        engagement: 0,
        viralScore: 0,
        createdAt: Date.now() - 3600000, // 1 hour ago
        collaborators: ['SC', 'MJ', 'AB'],
        aiOptimized: false,
        socialPlatforms: []
      },
      {
        id: 'project_4',
        title: 'Conspiracy: What They Don\'t Want You to Know',
        type: 'conspiracy',
        status: 'published',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
        duration: 72,
        views: 3200000,
        engagement: 91,
        viralScore: 93,
        createdAt: Date.now() - 432000000, // 5 days ago
        collaborators: ['SC'],
        aiOptimized: true,
        socialPlatforms: ['tiktok', 'youtube', 'instagram', 'twitter']
      }
    ];
  }

  async loadScripts() {
    return [
      sampleScript,
      {
        id: 'script_2',
        title: 'Mind-Blowing Space Facts',
        niche: 'facts-trivia',
        frames: [
          {
            id: 1,
            text: 'Did you know there are more stars in the universe than grains of sand on Earth?',
            duration: 4000,
            animation: 'fadeIn',
            background: 'space-nebula'
          },
          {
            id: 2,
            text: 'But here\'s what will really blow your mind...',
            duration: 3000,
            animation: 'zoom',
            background: 'galaxy-spiral'
          },
          {
            id: 3,
            text: 'A single teaspoon of neutron star material weighs 6 billion tons!',
            duration: 4500,
            animation: 'slideUp',
            background: 'neutron-star'
          }
        ],
        totalDuration: 11500,
        viralElements: ['shocking-fact', 'buildup', 'mind-blown']
      }
    ];
  }

  async loadCollaborators() {
    return [
      ...sampleCollaborators,
      {
        id: 3,
        name: 'Alex Brown',
        email: 'alex@example.com',
        avatar: 'AB',
        status: 'online',
        role: 'admin',
        lastActive: Date.now()
      },
      {
        id: 4,
        name: 'Emma Wilson',
        email: 'emma@example.com',
        avatar: 'EW',
        status: 'offline',
        role: 'viewer',
        lastActive: Date.now() - 7200000 // 2 hours ago
      }
    ];
  }

  async loadAnalytics() {
    return {
      ...sampleAnalytics,
      platformBreakdown: {
        tiktok: { views: 1200000, engagement: 94, shares: 45000 },
        youtube: { views: 800000, engagement: 87, shares: 23000 },
        instagram: { views: 600000, engagement: 91, shares: 18000 },
        twitter: { views: 200000, engagement: 76, shares: 8000 }
      },
      trending: [
        { topic: 'Horror Stories', growth: '+156%', category: 'entertainment' },
        { topic: 'Space Facts', growth: '+89%', category: 'education' },
        { topic: 'Life Hacks', growth: '+67%', category: 'lifestyle' },
        { topic: 'Conspiracy', growth: '+134%', category: 'mystery' }
      ]
    };
  }

  async loadFacelessVideos() {
    return [
      sampleFacelessVideo,
      {
        id: 'faceless_2',
        type: 'horror-stories',
        title: 'The Thing in My Basement Won\'t Stop Knocking',
        settings: {
          voiceType: 'neural-female',
          backgroundType: 'dark-atmospheric',
          textStyle: 'horror',
          quality: '4K',
          duration: 75
        },
        elements: {
          voice: { id: 'neural-female', name: 'Neural Female', quality: 'Premium', accent: 'British' },
          background: { id: 'dark-atmospheric', name: 'Dark Atmospheric', viral: 'High', engagement: '92%' },
          textStyle: 'horror'
        },
        viralOptimization: {
          hookTiming: 2,
          retentionCurve: 'horror-buildup',
          engagementTriggers: ['fear', 'suspense', 'cliffhanger'],
          thumbnailStyle: 'horror-optimized'
        }
      }
    ];
  }

  async loadTemplates() {
    return [
      {
        id: 'template_1',
        name: 'Reddit AITA Story',
        category: 'reddit-stories',
        thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop',
        viralScore: 95,
        avgViews: '2.5M',
        description: 'Perfect for relationship drama and moral dilemmas',
        elements: {
          hook: 'AITA for...',
          structure: 'problem-buildup-resolution',
          background: 'subway-surfers',
          voice: 'neural-male'
        }
      },
      {
        id: 'template_2',
        name: 'Horror Story Template',
        category: 'horror-stories',
        thumbnail: 'https://images.unsplash.com/photo-1520637736862-4d197d17c55a?w=400&h=600&fit=crop',
        viralScore: 92,
        avgViews: '3.1M',
        description: 'Atmospheric horror with perfect pacing',
        elements: {
          hook: 'You won\'t believe what happened...',
          structure: 'setup-buildup-climax-twist',
          background: 'dark-atmospheric',
          voice: 'documentary'
        }
      },
      {
        id: 'template_3',
        name: 'Mind-Blowing Facts',
        category: 'facts-trivia',
        thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop',
        viralScore: 88,
        avgViews: '1.8M',
        description: 'Educational content that amazes viewers',
        elements: {
          hook: 'Did you know...',
          structure: 'fact-explanation-mind-blown',
          background: '4k-nature',
          voice: 'ai-narrator'
        }
      }
    ];
  }

  async loadThemes() {
    return [
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        colors: {
          primary: '#39FF14',
          secondary: '#FF00FF',
          accent: '#00FFFF',
          background: '#0a0a0a'
        },
        active: true
      },
      {
        id: 'minimal',
        name: 'Minimal',
        colors: {
          primary: '#000000',
          secondary: '#666666',
          accent: '#333333',
          background: '#ffffff'
        },
        active: false
      }
    ];
  }

  // Get specific data type
  getProjects() {
    return this.data.projects || [];
  }

  getScripts() {
    return this.data.scripts || [];
  }

  getCollaborators() {
    return this.data.collaborators || [];
  }

  getAnalytics() {
    return this.data.analytics || {};
  }

  getFacelessVideos() {
    return this.data.facelessVideos || [];
  }

  getTemplates() {
    return this.data.templates || [];
  }

  getThemes() {
    return this.data.themes || [];
  }

  // Simulate real-time data updates
  startLiveUpdates() {
    setInterval(() => {
      // Update view counts
      if (this.data.projects) {
        this.data.projects.forEach(project => {
          if (project.status === 'published') {
            project.views += Math.floor(Math.random() * 1000);
          }
        });
      }

      // Update analytics
      if (this.data.analytics) {
        this.data.analytics.viralScore += Math.floor(Math.random() * 3) - 1;
        this.data.analytics.viralScore = Math.max(70, Math.min(100, this.data.analytics.viralScore));
      }

      // Notify listeners of updates
      window.dispatchEvent(new CustomEvent('demoDataUpdate', {
        detail: { timestamp: Date.now() }
      }));

    }, 5000); // Update every 5 seconds
  }

  // Reset all data
  reset() {
    this.loaded = false;
    this.data = {};
  }
}

// Create singleton instance
export const demoDataLoader = new DemoDataLoader();

// Auto-load demo data
if (process.env.NODE_ENV === 'development') {
  demoDataLoader.loadAll().then(() => {
    demoDataLoader.startLiveUpdates();
  });
}

export default demoDataLoader;