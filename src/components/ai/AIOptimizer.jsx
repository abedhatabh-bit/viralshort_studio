import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const AIOptimizer = ({ script, onOptimizationApply }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (script) {
      analyzeContent(script);
    }
  }, [script]);

  const analyzeContent = async (scriptData) => {
    setLoading(true);
    
    // Mock AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        viralScore: Math.floor(Math.random() * 30) + 70,
        engagement: Math.floor(Math.random() * 20) + 80,
        retention: Math.floor(Math.random() * 25) + 75,
        suggestions: [
          {
            id: 1,
            type: 'hook',
            priority: 'high',
            title: 'Strengthen Opening Hook',
            description: 'Add a question or shocking statement in the first 3 seconds',
            impact: '+15% retention'
          },
          {
            id: 2,
            type: 'pacing',
            priority: 'medium',
            title: 'Optimize Pacing',
            description: 'Reduce frame duration by 0.2s for better engagement',
            impact: '+8% completion rate'
          },
          {
            id: 3,
            type: 'visual',
            priority: 'low',
            title: 'Enhance Visual Appeal',
            description: 'Add more contrast to text elements',
            impact: '+5% click-through'
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      setSuggestions(mockAnalysis.suggestions);
      setLoading(false);
    }, 2000);
  };

  const applySuggestion = (suggestion) => {
    onOptimizationApply?.(suggestion);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Sparkles" size={16} />
        <span>AI Optimization</span>
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Analyzing content...</span>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{analysis.viralScore}</div>
              <div className="text-xs text-muted-foreground">Viral Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{analysis.engagement}%</div>
              <div className="text-xs text-muted-foreground">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{analysis.retention}%</div>
              <div className="text-xs text-muted-foreground">Retention</div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Optimization Suggestions</h4>
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                    <h5 className="text-sm font-medium text-foreground">{suggestion.title}</h5>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                <div className="text-xs text-primary font-medium">{suggestion.impact}</div>
              </div>
            ))}
          </div>

          <Button
            variant="default"
            className="w-full"
            onClick={() => analyzeContent(script)}
          >
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Re-analyze
          </Button>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Sparkles" size={32} className="mx-auto mb-2 opacity-50" />
          <p>Generate a script to see AI optimization suggestions</p>
        </div>
      )}
    </div>
  );
};

export default AIOptimizer;