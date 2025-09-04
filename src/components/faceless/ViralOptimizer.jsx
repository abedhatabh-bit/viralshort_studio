import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ViralOptimizer = ({ videoType, onOptimizationApply }) => {
  const [optimizations, setOptimizations] = useState([]);
  const [viralScore, setViralScore] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const viralTechniques = {
    'reddit-stories': [
      { id: 1, technique: 'Cliffhanger Hook', impact: '+25% retention', description: 'Start with "You won\'t believe what happened next..."' },
      { id: 2, technique: 'Emotional Trigger', impact: '+18% engagement', description: 'Use words like "shocking", "unbelievable", "insane"' },
      { id: 3, technique: 'Question Hook', impact: '+22% completion', description: 'Open with "What would you do if..."' },
      { id: 4, technique: 'Subway Surfers BG', impact: '+35% watch time', description: 'Use gameplay footage to maintain attention' }
    ],
    'facts-trivia': [
      { id: 1, technique: 'Number Hook', impact: '+20% clicks', description: 'Start with "5 Facts That Will Blow Your Mind"' },
      { id: 2, technique: 'Countdown Format', impact: '+15% retention', description: 'Use countdown structure (5, 4, 3, 2, 1)' },
      { id: 3, technique: 'Visual Proof', impact: '+28% credibility', description: 'Show evidence/sources for each fact' },
      { id: 4, technique: 'Mind-Blown Moments', impact: '+30% shares', description: 'Build up to shocking revelations' }
    ],
    'horror-stories': [
      { id: 1, technique: 'Atmospheric Build', impact: '+40% immersion', description: 'Gradual tension increase with sound design' },
      { id: 2, technique: 'True Story Claim', impact: '+25% believability', description: 'Start with "This actually happened..."' },
      { id: 3, technique: 'Jump Scares', impact: '+35% engagement', description: 'Strategic audio/visual surprises' },
      { id: 4, technique: 'Dark Visuals', impact: '+20% mood', description: 'Low-light, high-contrast backgrounds' }
    ]
  };

  const qualityEnhancements = [
    { id: 'voice-clarity', name: 'Neural Voice Enhancement', boost: '+15% clarity' },
    { id: 'background-sync', name: 'Perfect Audio-Visual Sync', boost: '+12% quality' },
    { id: 'text-animation', name: 'Dynamic Text Effects', boost: '+18% engagement' },
    { id: 'color-grading', name: 'Professional Color Grading', boost: '+10% visual appeal' },
    { id: 'sound-design', name: 'Immersive Sound Design', boost: '+22% retention' },
    { id: 'thumbnail-gen', name: 'AI Thumbnail Generation', boost: '+45% CTR' }
  ];

  useEffect(() => {
    if (videoType) {
      analyzeViralPotential();
    }
  }, [videoType]);

  const analyzeViralPotential = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      const techniques = viralTechniques[videoType] || [];
      setOptimizations(techniques);
      
      // Calculate viral score based on video type
      const baseScores = {
        'reddit-stories': 85,
        'facts-trivia': 78,
        'horror-stories': 92,
        'motivational': 75,
        'life-hacks': 82,
        'conspiracy': 88
      };
      
      setViralScore(baseScores[videoType] + Math.floor(Math.random() * 10));
      setAnalyzing(false);
    }, 2000);
  };

  const applyOptimization = (optimization) => {
    onOptimizationApply?.(optimization);
    setOptimizations(prev => prev.filter(opt => opt.id !== optimization.id));
    setViralScore(prev => Math.min(100, prev + 3));
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="TrendingUp" size={16} />
        <span>Viral Optimizer</span>
        <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs">HOT</span>
      </h3>

      {analyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Analyzing viral potential...</span>
        </div>
      ) : (
        <>
          {/* Viral Score */}
          <div className="text-center mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(viralScore)}`}>
              {viralScore}%
            </div>
            <div className="text-sm text-muted-foreground mb-2">Viral Potential Score</div>
            <div className="flex justify-center space-x-4 text-xs">
              <span className="text-green-500">Expected: 2.5M+ views</span>
              <span className="text-blue-500">Engagement: 94%+</span>
            </div>
          </div>

          {/* Viral Techniques */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-foreground">Viral Techniques</h4>
            {optimizations.map(opt => (
              <div key={opt.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="text-sm font-medium text-foreground">{opt.technique}</h5>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyOptimization(opt)}
                    className="text-primary hover:bg-primary/10"
                  >
                    Apply
                  </Button>
                </div>
                <div className="text-xs font-medium text-green-500">{opt.impact}</div>
              </div>
            ))}
          </div>

          {/* Quality Enhancements */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-foreground">Quality Enhancements</h4>
            <div className="grid grid-cols-1 gap-2">
              {qualityEnhancements.slice(0, 3).map(enhancement => (
                <div key={enhancement.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <span className="text-sm text-foreground">{enhancement.name}</span>
                    <div className="text-xs text-primary">{enhancement.boost}</div>
                  </div>
                  <Icon name="Check" size={14} className="text-green-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Viral Predictions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Predictions</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <div className="text-lg font-bold text-green-500">2.8M</div>
                <div className="text-xs text-muted-foreground">Expected Views</div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <div className="text-lg font-bold text-blue-500">96%</div>
                <div className="text-xs text-muted-foreground">Retention Rate</div>
              </div>
            </div>
          </div>

          <Button
            variant="default"
            className="w-full mt-4"
            onClick={analyzeViralPotential}
          >
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Re-analyze
          </Button>
        </>
      )}
    </div>
  );
};

export default ViralOptimizer;