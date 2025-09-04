/**
 * Test Data and Sample Content for ViralShort Studio
 * Professional testing data for all features
 */

export const sampleProjects = [
  {
    id: 'project_1',
    title: 'The Haunted Mirror - Horror Story',
    type: 'horror-stories',
    status: 'published',
    thumbnail: 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?w=400&h=600&fit=crop',
    duration: 58,
    views: 2340000,
    engagement: 94,
    viralScore: 96,
    createdAt: Date.now() - 172800000, // 2 days ago
    collaborators: ['SC', 'MJ'],
    aiOptimized: true,
    socialPlatforms: ['tiktok', 'youtube', 'instagram']
  },
  {
    id: 'project_2',
    title: 'Mind-Blowing Space Facts',
    type: 'facts-trivia',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop',
    duration: 62,
    views: 1850000,
    engagement: 87,
    viralScore: 89,
    createdAt: Date.now() - 345600000, // 4 days ago
    collaborators: ['SC'],
    aiOptimized: true,
    socialPlatforms: ['tiktok', 'youtube']
  }
];

export const sampleScript = {
  id: 'script_1',
  title: 'The Haunted Mirror',
  niche: 'horror',
  frames: [
    {
      id: 1,
      text: 'You won\'t believe what happened when Sarah bought this antique mirror...',
      duration: 3000,
      animation: 'fadeIn',
      background: 'dark-room'
    },
    {
      id: 2,
      text: 'Every night at 3 AM, she heard whispers coming from inside the glass.',
      duration: 4000,
      animation: 'slideUp',
      background: 'mirror-reflection'
    },
    {
      id: 3,
      text: 'But what she saw in the reflection changed everything...',
      duration: 3500,
      animation: 'zoom',
      background: 'ghostly-figure'
    }
  ],
  totalDuration: 10500,
  viralElements: ['cliffhanger', 'mystery', 'supernatural']
};

export const sampleCollaborators = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'SC',
    status: 'online',
    role: 'editor',
    lastActive: Date.now()
  },
  {
    id: 2,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'MJ',
    status: 'away',
    role: 'viewer',
    lastActive: Date.now() - 300000 // 5 minutes ago
  }
];

export const sampleAnalytics = {
  viralScore: 92,
  expectedViews: {
    '24h': 45000,
    '7d': 380000,
    '30d': 1200000
  },
  engagement: {
    likes: 89,
    comments: 12,
    shares: 8
  },
  demographics: {
    age: { '13-17': 25, '18-24': 45, '25-34': 20, '35+': 10 },
    gender: { male: 45, female: 55 },
    regions: { 'North America': 40, 'Europe': 25, 'Asia': 30, 'Other': 5 }
  },
  bestTimes: [
    { time: '6:00 PM', score: 95, day: 'Friday' },
    { time: '8:00 PM', score: 92, day: 'Saturday' }
  ]
};

export const sampleOptimizations = [
  {
    id: 1,
    type: 'hook',
    priority: 'high',
    title: 'Strengthen Opening Hook',
    description: 'Add a question or shocking statement in the first 3 seconds',
    impact: '+15% retention',
    applied: false
  },
  {
    id: 2,
    type: 'pacing',
    priority: 'medium',
    title: 'Optimize Pacing',
    description: 'Reduce frame duration by 0.2s for better engagement',
    impact: '+8% completion rate',
    applied: false
  }
];

export const sampleFacelessVideo = {
  id: 'faceless_1',
  type: 'reddit-stories',
  title: 'AITA for refusing to attend my sister\'s wedding?',
  settings: {
    voiceType: 'neural-male',
    backgroundType: 'subway-surfers',
    textStyle: 'modern',
    quality: '4K',
    duration: 60
  },
  elements: {
    voice: { id: 'neural-male', name: 'Neural Male', quality: 'Premium', accent: 'American' },
    background: { id: 'subway-surfers', name: 'Subway Surfers', viral: 'Ultra', engagement: '96%' },
    textStyle: 'modern'
  },
  viralOptimization: {
    hookTiming: 3,
    retentionCurve: 'exponential',
    engagementTriggers: ['question', 'cliffhanger', 'reveal'],
    thumbnailStyle: 'clickbait-optimized'
  }
};

export const testScenarios = {
  // Test scenario 1: New user workflow
  newUser: {
    name: 'New User Journey',
    steps: [
      'Visit homepage',
      'Navigate to enhanced dashboard',
      'Try faceless studio',
      'Create Reddit story video',
      'Apply viral optimizations',
      'Render in 4K quality',
      'Download and share'
    ]
  },
  
  // Test scenario 2: Collaboration workflow
  collaboration: {
    name: 'Team Collaboration',
    steps: [
      'Create project',
      'Invite team member',
      'Real-time editing',
      'Apply AI suggestions',
      'Review changes',
      'Publish to social media'
    ]
  },
  
  // Test scenario 3: Mobile experience
  mobile: {
    name: 'Mobile Touch Experience',
    steps: [
      'Access on mobile device',
      'Use touch gestures',
      'Navigate with swipes',
      'Create video offline',
      'Sync when online',
      'Share to platforms'
    ]
  }
};

export const performanceMetrics = {
  loadTime: {
    target: 2000, // 2 seconds
    critical: 3000 // 3 seconds max
  },
  renderTime: {
    '1080p': 30000, // 30 seconds
    '4K': 120000, // 2 minutes
    '8K': 300000 // 5 minutes
  },
  memoryUsage: {
    idle: 50, // MB
    rendering: 500, // MB
    critical: 1000 // MB max
  }
};

export const errorScenarios = [
  {
    name: 'Network Failure',
    trigger: 'Disconnect internet during render',
    expected: 'Graceful offline mode activation'
  },
  {
    name: 'Memory Pressure',
    trigger: 'Render multiple 8K videos simultaneously',
    expected: 'Queue management and memory optimization'
  },
  {
    name: 'Invalid Input',
    trigger: 'Submit empty form data',
    expected: 'Validation errors and user guidance'
  }
];

export default {
  sampleProjects,
  sampleScript,
  sampleCollaborators,
  sampleAnalytics,
  sampleOptimizations,
  sampleFacelessVideo,
  testScenarios,
  performanceMetrics,
  errorScenarios
};