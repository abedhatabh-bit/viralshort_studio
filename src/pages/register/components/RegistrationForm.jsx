import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    creatorName: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [fieldValidation, setFieldValidation] = useState({});
  const [glitchActive, setGlitchActive] = useState(false);
  const [colorInvert, setColorInvert] = useState(false);

  // Pattern interrupt effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);

    const colorInvertInterval = setInterval(() => {
      setColorInvert(true);
      setTimeout(() => setColorInvert(false), 150);
    }, 5000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(colorInvertInterval);
    };
  }, []);

  const validateField = (name, value) => {
    let error = '';
    let isValid = false;

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = 'Email is required';
        } else if (!emailRegex?.test(value)) {
          error = 'Enter a valid email address';
        } else {
          isValid = true;
        }
        break;
      
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value?.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(value)) {
          error = 'Password must contain uppercase, lowercase, and number';
        } else {
          isValid = true;
        }
        break;
      
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData?.password) {
          error = 'Passwords do not match';
        } else {
          isValid = true;
        }
        break;
      
      case 'creatorName':
        if (!value) {
          error = 'Creator name is required';
        } else if (value?.length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value?.length > 50) {
          error = 'Name must be less than 50 characters';
        } else {
          isValid = true;
        }
        break;
      
      case 'agreeToTerms':
        if (!value) {
          error = 'You must agree to the terms';
        } else {
          isValid = true;
        }
        break;
      
      default:
        break;
    }

    return { error, isValid };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Real-time validation
    const validation = validateField(name, fieldValue);
    setErrors(prev => ({
      ...prev,
      [name]: validation?.error
    }));
    
    setFieldValidation(prev => ({
      ...prev,
      [name]: validation?.isValid
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    const newValidation = {};
    
    Object.keys(formData)?.forEach(key => {
      const validation = validateField(key, formData?.[key]);
      newErrors[key] = validation?.error;
      newValidation[key] = validation?.isValid;
    });
    
    setErrors(newErrors);
    setFieldValidation(newValidation);
    
    // Check if form is valid
    const isFormValid = Object.values(newValidation)?.every(valid => valid);
    
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  return (
    <div className={`transition-all duration-200 ${colorInvert ? 'invert' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Creator Name Field */}
        <div className="relative">
          <Input
            label="Creator Name"
            type="text"
            name="creatorName"
            placeholder="Your viral creator identity"
            value={formData?.creatorName}
            onChange={handleInputChange}
            error={errors?.creatorName}
            required
            className={`transition-all duration-300 ${
              fieldValidation?.creatorName 
                ? 'border-primary neon-glow-primary' 
                : errors?.creatorName 
                ? 'border-destructive' :''
            }`}
          />
          {fieldValidation?.creatorName && (
            <div className="absolute right-3 top-9 text-primary">
              <Icon name="CheckCircle" size={16} className="animate-pulse" />
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="creator@viralshort.studio"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            className={`transition-all duration-300 ${
              fieldValidation?.email 
                ? 'border-primary neon-glow-primary' 
                : errors?.email 
                ? 'border-destructive' :''
            }`}
          />
          {fieldValidation?.email && (
            <div className="absolute right-3 top-9 text-primary">
              <Icon name="CheckCircle" size={16} className="animate-pulse" />
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            className={`transition-all duration-300 ${
              fieldValidation?.password 
                ? 'border-primary neon-glow-primary' 
                : errors?.password 
                ? 'border-destructive' :''
            }`}
          />
          {fieldValidation?.password && (
            <div className="absolute right-3 top-9 text-primary">
              <Icon name="CheckCircle" size={16} className="animate-pulse" />
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
            className={`transition-all duration-300 ${
              fieldValidation?.confirmPassword 
                ? 'border-primary neon-glow-primary' 
                : errors?.confirmPassword 
                ? 'border-destructive' :''
            }`}
          />
          {fieldValidation?.confirmPassword && (
            <div className="absolute right-3 top-9 text-primary">
              <Icon name="CheckCircle" size={16} className="animate-pulse" />
            </div>
          )}
        </div>

        {/* Terms Agreement */}
        <div className={`space-y-2 ${glitchActive ? 'glitch-effect' : ''}`}>
          <Checkbox
            name="agreeToTerms"
            checked={formData?.agreeToTerms}
            onChange={handleInputChange}
            error={errors?.agreeToTerms}
            label={
              <span className="text-sm">
                I agree to the{' '}
                <span className="text-secondary hover:text-accent cursor-pointer underline">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-secondary hover:text-accent cursor-pointer underline">
                  Privacy Policy
                </span>
                {' '}(You know you want to create viral content)
              </span>
            }
            className="text-foreground"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!Object.values(fieldValidation)?.every(valid => valid)}
          className="pulse-cta bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-primary font-bold text-lg py-4"
        >
          <span className="flex items-center justify-center space-x-2">
            <Icon name="Zap" size={20} />
            <span>Start Creating Viral Content</span>
            <Icon name="ArrowRight" size={20} />
          </span>
        </Button>

        {/* Alternative Login Link */}
        <div className="text-center pt-4">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-accent hover:text-accent/80 underline font-medium transition-colors"
            >
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;