import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const HealthTipsGenerator = ({ onScriptGenerate }) => {
  const [topic, setTopic] = useState('');
  const [backgroundStyle, setBackgroundStyle] = useState('subway');
  const [isGenerating, setIsGenerating] = useState(false);

  const healthTopics = [
    'weight loss', 'muscle building', 'better sleep', 'energy boost', 
    'stress relief', 'immune system', 'heart health', 'brain power',
    'metabolism', 'hydration', 'nutrition', 'exercise', 'mental health'
  ];

  const viralHooks = {
    subway: [
      "This health hack will change your life faster than a subway train...",
      "Doctors don't want you to know this simple trick...",
      "I discovered this secret while playing Subway Surfers...",
      "This health tip went viral for a reason..."
    ],
    minecraft: [
      "Building your health is like building in Minecraft...",
      "This health block will complete your wellness build...",
      "Mine this health secret for maximum benefits...",
      "Craft your perfect health with this one trick..."
    ]
  };

  const healthFrames = {
    weight_loss: [
      "Start your day with this simple morning routine",
      "Drink water 30 minutes before every meal",
      "Walk for just 10 minutes after eating",
      "Replace one snack with fruits daily",
      "Sleep 7-8 hours for optimal metabolism",
      "You'll see results in just 2 weeks!"
    ],
    muscle_building: [
      "Protein is your building block foundation",
      "Eat protein within 30 minutes post-workout",
      "Progressive overload is the key to growth",
      "Rest days are when muscles actually grow",
      "Consistency beats perfection every time",
      "Your future strong self will thank you!"
    ],
    better_sleep: [
      "No screens 1 hour before bedtime",
      "Keep your room cool and completely dark",
      "Try the 4-7-8 breathing technique",
      "Avoid caffeine after 2 PM daily",
      "Create a consistent bedtime routine",
      "Wake up refreshed and energized!"
    ],
    energy_boost: [
      "Start with a glass of cold water",
      "Take 5 deep breaths to oxygenate",
      "Do 10 jumping jacks to activate",
      "Eat a handful of nuts for fuel",
      "Step outside for natural light",
      "Feel the energy surge instantly!"
    ],
    stress_relief: [
      "Take 3 deep belly breaths right now",
      "Name 5 things you can see around you",
      "Stretch your neck and shoulders gently",
      "Listen to your favorite calming song",
      "Write down one thing you're grateful for",
      "Feel the stress melt away completely!"
    ]
  };

  const generateScript = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const topicKey = topic.toLowerCase().replace(/\s+/g, '_');
      const hooks = viralHooks[backgroundStyle];
      const frames = healthFrames[topicKey] || [
        `This ${topic} tip will amaze you`,
        "Science proves this method works",
        "Thousands have tried this successfully",
        "The results speak for themselves",
        "Start implementing this today",
        "Your health transformation begins now!"
      ];

      const script = {
        hook: hooks[Math.floor(Math.random() * hooks.length)],
        frames: frames,
        cta: backgroundStyle === 'subway' ? 
          "SAVE THIS POST AND START TODAY!" : 
          "CRAFT YOUR HEALTH TRANSFORMATION NOW!",
        topic: topic,
        backgroundStyle: backgroundStyle
      };

      onScriptGenerate(script);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="Heart" size={20} className="text-primary" />
        <h3 className="font-heading font-bold text-lg text-foreground">Health Tips Generator</h3>
      </div>

      <div className="space-y-4">
        {/* Background Style Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Background Style</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBackgroundStyle('subway')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                backgroundStyle === 'subway'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-md">
                  <Icon name="Train" size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Subway Surfers</h4>
                  <p className="text-xs text-muted-foreground">Gaming energy theme</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setBackgroundStyle('minecraft')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                backgroundStyle === 'minecraft'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-md">
                  <Icon name="Box" size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Minecraft</h4>
                  <p className="text-xs text-muted-foreground">Building blocks theme</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Topic Input */}
        <Input
          label="Health Topic"
          type="text"
          placeholder="Enter health topic (e.g., weight loss, energy boost)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          description="What health tip do you want to share?"
        />

        {/* Quick Topic Suggestions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Popular Topics</label>
          <div className="flex flex-wrap gap-2">
            {healthTopics.slice(0, 6).map((healthTopic) => (
              <button
                key={healthTopic}
                onClick={() => setTopic(healthTopic)}
                className="px-3 py-1 text-sm bg-muted hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                {healthTopic}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {topic && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Preview</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Topic:</strong> {topic}</p>
              <p><strong>Background:</strong> {backgroundStyle === 'subway' ? 'Subway Surfers' : 'Minecraft'}</p>
              <p><strong>Hook:</strong> {viralHooks[backgroundStyle][0]}</p>
            </div>
          </div>
        )}

        <Button
          onClick={generateScript}
          disabled={!topic.trim() || isGenerating}
          loading={isGenerating}
          iconName="Sparkles"
          className="w-full"
          variant="default"
        >
          {isGenerating ? 'Generating Health Tips...' : 'Generate Viral Health Script'}
        </Button>
      </div>

      {/* Tips */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Lightbulb" size={16} />
          <span>Pro Tips</span>
        </h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Use specific topics like "morning energy boost" for better results</p>
          <p>• Subway theme works great for high-energy health tips</p>
          <p>• Minecraft theme is perfect for step-by-step building habits</p>
          <p>• Keep topics focused and actionable for maximum engagement</p>
        </div>
      </div>
    </div>
  );
};

export default HealthTipsGenerator;