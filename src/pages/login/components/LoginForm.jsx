import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock credentials for authentication
  const mockCredentials = {
    email: 'creator@viralshort.studio',
    password: 'ViralPass123!'
  };

  useEffect(() => {
    // Glitch effect every 3-5 seconds
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required to enter the viral zone';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required for access';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (formData?.email === mockCredentials?.email && formData?.password === mockCredentials?.password) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setErrors({
          general: `Invalid credentials. Use: ${mockCredentials?.email} / ${mockCredentials?.password}`
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality coming soon!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <div className="text-primary text-xl font-heading neon-glow-primary">
              Welcome to the Viral Zone!
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-heading font-bold text-primary mb-2 transition-neon ${glitchActive ? 'glitch-effect' : ''}`}>
            Enter the Viral Zone
          </h1>
          <p className="text-muted-foreground font-body">
            Access your viral video creation workspace
          </p>
        </div>

        {/* General Error */}
        {errors?.general && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <span className="text-destructive text-sm">{errors?.general}</span>
            </div>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="creator@viralshort.studio"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            className="neon-glow-accent focus:neon-glow-primary transition-neon"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your viral password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            className="neon-glow-accent focus:neon-glow-primary transition-neon"
          />
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="Zap"
          iconPosition="left"
          className="pulse-cta bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-bold text-lg py-4"
        >
          {isLoading ? 'Entering Viral Zone...' : 'Enter the Viral Zone'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-muted-foreground hover:text-foreground transition-neon underline"
          >
            Forgot your viral password?
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Ready to create viral content?
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/register')}
            iconName="Sparkles"
            iconPosition="left"
            className="hover:neon-glow-primary transition-neon"
          >
            Join 10,000+ Viral Creators
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;