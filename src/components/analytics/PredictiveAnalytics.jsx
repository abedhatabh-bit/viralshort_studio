import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const PredictiveAnalytics = ({ script, niche }) => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('24h');

  useEffect(() => {
    if (script && niche) {
      generatePredictions();
    }
  }, [script, niche]);

  const generatePredictions = async () => {
    setLoading(true);
    
    // Mock ML predictions
    setTimeout(() => {
      const mockPredictions = {
        viralPotential: Math.floor(Math.random() * 30) + 70,
        expectedViews: {
          '24h': Math.floor(Math.random() * 50000) + 10000,
          '7d': Math.floor(Math.random() * 500000) + 100000,
          '30d': Math.floor(Math.random() * 2000000) + 500000
        },
        engagement: {
          likes: Math.floor(Math.random() * 20) + 80,
          comments: Math.floor(Math.random() * 15) + 5,
          shares: Math.floor(Math.random() * 10) + 3
        },
        demographics: {
          age: { '13-17': 25, '18-24': 45, '25-34': 20, '35+': 10 },
          gender: { male: 45, female: 55 },
          regions: { 'North America': 40, 'Europe': 25, 'Asia': 30, 'Other': 5 }
        },
        bestTimes: [
          { time: '6:00 PM', score: 95, day: 'Friday' },
          { time: '8:00 PM', score: 92, day: 'Saturday' },
          { time: '7:00 PM', score: 88, day: 'Sunday' }
        ],
        competitorAnalysis: {
          similarContent: 1250,
          averageViews: 85000,
          topPerformer: 2300000,
          yourAdvantage: 'Unique storytelling approach'
        }
      };
      
      setPredictions(mockPredictions);
      setLoading(false);
    }, 3000);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="TrendingUp" size={16} />
        <span>Viral Prediction</span>
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Analyzing viral potential...</span>
        </div>
      ) : predictions ? (
        <div className="space-y-6">
          {/* Viral Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{predictions.viralPotential}%</div>
            <div className="text-sm text-muted-foreground">Viral Potential Score</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
              predictions.viralPotential >= 80 ? 'bg-green-500/10 text-green-500' :
              predictions.viralPotential >= 60 ? 'bg-yellow-500/10 text-yellow-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {predictions.viralPotential >= 80 ? 'High Potential' :
               predictions.viralPotential >= 60 ? 'Medium Potential' : 'Low Potential'}
            </div>
          </div>

          {/* Expected Views */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Expected Views</h4>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="text-xs bg-background border border-border rounded px-2 py-1"
              >
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>
            <div className="text-2xl font-bold text-secondary">
              {formatNumber(predictions.expectedViews[timeframe])}
            </div>
            <div className="text-xs text-muted-foreground">views in {timeframe}</div>
          </div>

          {/* Engagement Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Engagement Forecast</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">{predictions.engagement.likes}%</div>
                <div className="text-xs text-muted-foreground">Like Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-secondary">{predictions.engagement.comments}%</div>
                <div className="text-xs text-muted-foreground">Comment Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-accent">{predictions.engagement.shares}%</div>
                <div className="text-xs text-muted-foreground">Share Rate</div>
              </div>
            </div>
          </div>

          {/* Best Publishing Times */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Optimal Publishing Times</h4>
            <div className="space-y-2">
              {predictions.bestTimes.map((time, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm text-foreground">{time.day} at {time.time}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-background rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${time.score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{time.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Analysis */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Market Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Similar content pieces:</span>
                <span className="text-foreground">{predictions.competitorAnalysis.similarContent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average performance:</span>
                <span className="text-foreground">{formatNumber(predictions.competitorAnalysis.averageViews)} views</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top performer:</span>
                <span className="text-foreground">{formatNumber(predictions.competitorAnalysis.topPerformer)} views</span>
              </div>
              <div className="mt-3 p-2 bg-primary/10 rounded">
                <span className="text-xs text-primary font-medium">Your Advantage: </span>
                <span className="text-xs text-foreground">{predictions.competitorAnalysis.yourAdvantage}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={generatePredictions}
          >
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Refresh Predictions
          </Button>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="TrendingUp" size={32} className="mx-auto mb-2 opacity-50" />
          <p>Generate a script to see viral predictions</p>
        </div>
      )}
    </div>
  );
};

export default PredictiveAnalytics;