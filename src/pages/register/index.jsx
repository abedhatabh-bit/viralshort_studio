import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import ProgressIndicator from './components/ProgressIndicator';
import SocialProofSection from './components/SocialProofSection';
import ScarcityCountdown from './components/ScarcityCountdown';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [completedFields, setCompletedFields] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cursorTrail, setCursorTrail] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mock registration data for demonstration
  const mockCredentials = {
    validEmails: ['creator@viralshort.studio', 'test@example.com', 'demo@viral.com'],
    validPasswords: ['ViralPass123!', 'TestPass123!', 'DemoPass123!']
  };

  // Cursor chase animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e?.clientX, y: e?.clientY });
      
      setCursorTrail(prev => [
        ...prev?.slice(-8),
        { x: e?.clientX, y: e?.clientY, id: Date.now() }
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Clear cursor trail
  useEffect(() => {
    const timer = setInterval(() => {
      setCursorTrail(prev => prev?.slice(1));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleRegistration = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation
      const isValidEmail = mockCredentials?.validEmails?.includes(formData?.email);
      const isValidPassword = mockCredentials?.validPasswords?.includes(formData?.password);
      
      if (!isValidEmail || !isValidPassword) {
        throw new Error('Invalid credentials. Please use: creator@viralshort.studio / ViralPass123!');
      }
      
      // Success animation
      setShowConfetti(true);
      
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            welcomeMessage: `Welcome ${formData?.creatorName}! Ready to create viral content?`,
            newUser: true 
          }
        });
      }, 2000);
      
    } catch (error) {
      alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate completed fields for progress
  useEffect(() => {
    const fields = ['creatorName', 'email', 'password', 'confirmPassword', 'agreeToTerms'];
    // This would normally track actual form state
    setCompletedFields(3); // Mock completed fields
  }, []);

  return (
    <>
      <Helmet>
        <title>Join ViralShort Studio - Create Viral Content with AI</title>
        <meta name="description" content="Sign up for ViralShort Studio and start creating viral short-form videos with AI-powered tools. Join thousands of creators already making viral content." />
        <meta name="keywords" content="viral videos, short form content, AI video creator, TikTok, YouTube Shorts" />
      </Helmet>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Cursor Trail Effect */}
        {cursorTrail?.map((point, index) => (
          <div
            key={point?.id}
            className="fixed pointer-events-none z-50 w-2 h-2 bg-primary rounded-full"
            style={{
              left: point?.x - 4,
              top: point?.y - 4,
              opacity: (index + 1) / cursorTrail?.length * 0.5,
              transform: `scale(${(index + 1) / cursorTrail?.length})`,
              transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
            }}
          />
        ))}

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-100">
            {Array.from({ length: 50 }, (_, i) => {
              const colors = ['primary', 'secondary', 'accent'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              const leftPos = Math.floor(Math.random() * 100);
              const topPos = Math.floor(Math.random() * 100);
              const delay = Math.floor(Math.random() * 2000);
              const duration = 2000 + Math.floor(Math.random() * 2000);
              
              return (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${leftPos}%`,
                    top: `${topPos}%`,
                    animationDelay: `${delay}ms`,
                    animationDuration: `${duration}ms`
                  }}
                >
                  <Icon 
                    name="Sparkles" 
                    size={16} 
                    className={`text-${randomColor}`} 
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(57, 255, 20, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)`
          }} />
        </div>

        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Social Proof & Scarcity */}
          <div className="hidden lg:flex lg:w-2/5 bg-card/50 border-r border-border p-8 flex-col justify-center space-y-8">
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <Icon name="Zap" size={16} className="text-primary" />
                  <span className="text-sm text-primary font-medium">AI-Powered Viral Content</span>
                </div>
                
                <h1 className="text-4xl font-bold text-foreground">
                  Create <span className="text-primary">Viral</span> Videos
                  <br />
                  <span className="text-secondary">In Minutes</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Join thousands of creators using AI to generate viral short-form content for TikTok and YouTube
                </p>
              </div>

              {/* Social Proof */}
              <SocialProofSection />
              
              {/* Scarcity Countdown */}
              <ScarcityCountdown />
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md space-y-8">
              {/* Mobile Hero */}
              <div className="lg:hidden text-center space-y-4">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <Icon name="Zap" size={16} className="text-primary" />
                  <span className="text-sm text-primary font-medium">AI-Powered Viral Content</span>
                </div>
                
                <h1 className="text-3xl font-bold text-foreground">
                  Join <span className="text-primary">ViralShort</span>
                  <br />
                  <span className="text-secondary">Studio</span>
                </h1>
              </div>

              {/* Progress Indicator */}
              <ProgressIndicator 
                currentStep={1}
                totalSteps={1}
                completedFields={completedFields}
              />

              {/* Registration Form */}
              <div className="bg-card/50 border border-border rounded-lg p-6 space-y-6 surface-elevation">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-card-foreground">
                    Start Your Viral Journey
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Create your free account and unlock AI-powered viral content tools
                  </p>
                </div>

                <RegistrationForm 
                  onSubmit={handleRegistration}
                  isLoading={isLoading}
                />
              </div>

              {/* Mobile Social Proof */}
              <div className="lg:hidden">
                <SocialProofSection />
              </div>

              {/* Trust Signals */}
              <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Shield" size={12} className="text-success" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Lock" size={12} className="text-success" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span>100% Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Mobile Navigation Spacer */}
        <div className="h-20 md:hidden" />
      </div>
    </>
  );
};

export default Register;