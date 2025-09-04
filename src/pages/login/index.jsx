import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SocialProof from './components/SocialProof';
import ViralBranding from './components/ViralBranding';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('viralStudioAuth');
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Social Proof */}
          <div className="space-y-8">
            <ViralBranding />
            
            {/* Desktop Social Proof */}
            <div className="hidden lg:block">
              <SocialProof />
            </div>

            {/* Mobile CTA Preview */}
            <div className="lg:hidden text-center">
              <div className="p-6 bg-card border border-border rounded-lg neon-glow-primary">
                <h2 className="text-xl font-heading font-bold text-primary mb-2">
                  Ready to Go Viral?
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Join thousands of creators making viral content daily
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">10K+</div>
                    <div className="text-muted-foreground">Creators</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">847M+</div>
                    <div className="text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">Free</div>
                    <div className="text-muted-foreground">Forever</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <div className="bg-card border border-border rounded-lg p-8 surface-elevation neon-glow-accent">
              <LoginForm />
            </div>

            {/* Mobile Social Proof */}
            <div className="lg:hidden mt-8">
              <SocialProof />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          <p>
            © {new Date()?.getFullYear()} ViralShort Studio. All rights reserved. 
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-primary transition-neon">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-primary transition-neon">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;