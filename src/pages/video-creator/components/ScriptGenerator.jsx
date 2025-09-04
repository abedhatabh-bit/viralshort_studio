import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ScriptGenerator = ({ selectedNiche, onScriptGenerate }) => {
  const [hookKeyword, setHookKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const viralHookFormulas = {
    horror: [
      "What happened next will haunt you forever...",
      "This true story will make you sleep with lights on...",
      "The last person who ignored this warning...",
      "You won\'t believe what they found in the basement..."
    ],
    fairytales: [
      "This modern Cinderella story will shock you...",
      "What if fairy tales were actually warnings...",
      "The dark truth behind your favorite childhood story...",
      "This princess broke every rule and..."
    ],
    funny: [
      "This epic fail had everyone crying laughing...",
      "You won\'t believe what happened when...",
      "The most embarrassing moment that went viral...",
      "This person\'s reaction is absolutely priceless..."
    ],
    subway: [
      "This Subway Surfers trick will blow your mind...",
      "I discovered the secret to infinite coins...",
      "This speedrun technique changed everything...",
      "You\'ve been playing Subway Surfers wrong..."
    ],
    minecraft: [
      "This Minecraft build will amaze you...",
      "I found the rarest block in Minecraft...",
      "This redstone contraption is insane...",
      "You won\'t believe this Minecraft secret..."
    ]
  };

  const hypnoticOpeners = [
    "Listen carefully because this changes everything...",
    "Stop scrolling - you need to see this...",
    "Warning: This will blow your mind...",
    "Pay attention - this is important...",
    "Don't skip this - it could save your life..."
  ];

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleGenerate = async () => {
    if (!selectedNiche || !hookKeyword?.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const hooks = viralHookFormulas?.[selectedNiche] || [];
      const randomHook = hooks?.[Math.floor(Math.random() * hooks?.length)];
      const randomOpener = hypnoticOpeners?.[Math.floor(Math.random() * hypnoticOpeners?.length)];
      
      const generatedScript = {
        opener: randomOpener,
        hook: randomHook?.replace('...', ` about ${hookKeyword}...`),
        frames: generateFrameSequence(selectedNiche, hookKeyword),
        cta: generateCTA(selectedNiche)
      };
      
      onScriptGenerate(generatedScript);
      setIsGenerating(false);
    }, 2000);
  };

  const generateFrameSequence = (niche, keyword) => {
    const sequences = {
      horror: [
        `It started when ${keyword} appeared in my room at 3 AM...`,
        "The temperature dropped 20 degrees instantly...",
        "My phone started playing videos I never downloaded...",
        "Then I heard footsteps coming from upstairs...",
        "But I live in a one-story house...",
        "What I found next will terrify you..."
      ],
      fairytales: [
        `Once upon a time, ${keyword} discovered a secret...`,
        "But this wasn\'t your typical fairy tale...",
        "The magic came with a deadly price...",
        "Three wishes turned into three curses...",
        "The happy ending was just the beginning...",
        "And they lived... well, you'll see..."
      ],
      funny: [
        `So there I was, trying to ${keyword}...`,
        "Everything that could go wrong, did...",
        "My mom walked in at the worst possible moment...",
        "The video went viral for all the wrong reasons...",
        "But wait, it gets even worse...",
        "The ending will have you rolling on the floor..."
      ],
      subway: [
        `I was playing Subway Surfers when ${keyword} happened...`,
        "My high score was about to be beaten...",
        "Then I discovered this insane power-up combo...",
        "The coins started multiplying like crazy...",
        "I couldn't believe what happened next...",
        "This trick will change your game forever..."
      ],
      minecraft: [
        `I was mining for ${keyword} when something incredible happened...`,
        "Deep in the caves, I found something impossible...",
        "This wasn't in any Minecraft guide...",
        "The blocks started behaving strangely...",
        "What I built next broke the game...",
        "You have to try this in your world..."
      ]
    };
    
    return sequences?.[niche] || sequences?.funny;
  };

  const generateCTA = (niche) => {
    const ctas = {
      horror: "WATCH TILL THE END OR YOU\'LL REGRET IT",
      fairytales: "SEE THE SHOCKING TWIST ENDING",
      funny: "THE ENDING WILL MAKE YOU CRY LAUGHING",
      subway: "TRY THIS TRICK IN YOUR NEXT GAME",
      minecraft: "BUILD THIS IN YOUR WORLD NOW"
    };
    
    return ctas?.[niche] || "DON'T MISS THE EPIC ENDING";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} className="text-primary" />
        <h3 className={`font-heading font-bold text-lg text-foreground ${glitchActive ? 'glitch-effect' : ''}`}>
          AI Script Generator
        </h3>
      </div>
      {!selectedNiche && (
        <div className="p-4 border border-warning/50 rounded-lg bg-warning/10">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <p className="text-sm text-warning">Please select a niche first</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <Input
          label="Hook Keyword"
          type="text"
          placeholder="Enter your main topic or keyword..."
          value={hookKeyword}
          onChange={(e) => setHookKeyword(e?.target?.value)}
          description="This will be the focus of your viral hook"
          disabled={!selectedNiche}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Viral Hook Suggestions</label>
          <div className="grid gap-2">
            {selectedNiche && viralHookFormulas?.[selectedNiche]?.slice(0, 2)?.map((hook, index) => (
              <button
                key={index}
                onClick={() => setHookKeyword(hook?.split(' ')?.[2] || 'mystery')}
                className="p-3 text-left text-sm bg-muted hover:bg-accent hover:text-accent-foreground rounded-md transition-neon border border-transparent hover:border-accent"
              >
                {hook}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Hypnotic Openers</label>
          <div className="grid gap-2">
            {hypnoticOpeners?.slice(0, 3)?.map((opener, index) => (
              <div
                key={index}
                className="p-2 text-xs bg-card border border-border rounded-md text-card-foreground"
              >
                {opener}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!selectedNiche || !hookKeyword?.trim() || isGenerating}
          loading={isGenerating}
          iconName="Sparkles"
          iconPosition="left"
          className="w-full pulse-cta"
          variant="default"
        >
          {isGenerating ? 'Generating Viral Script...' : 'Generate AI Script'}
        </Button>
      </div>
    </div>
  );
};

export default ScriptGenerator;