import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const navigationTabs = [
    {
      label: 'Create',
      path: '/video-creator-enhanced',
      icon: 'Video',
      tooltip: 'Enhanced AI-powered video creation',
      neonAccent: 'primary'
    },
    {
      label: 'Dashboard',
      path: '/dashboard-enhanced',
      icon: 'LayoutDashboard',
      tooltip: 'Enhanced dashboard with all features',
      neonAccent: 'accent'
    },
    {
      label: 'Analytics',
      path: '/analytics-dashboard',
      icon: 'BarChart3',
      tooltip: 'Performance insights and metrics',
      neonAccent: 'secondary'
    }
  ];

  const secondaryNavigation = [
    {
      label: 'Templates',
      path: '/template-library',
      icon: 'Library',
      tooltip: 'Browse viral video templates'
    },
    {
      label: 'Faceless Studio',
      path: '/faceless-studio',
      icon: 'Ghost',
      tooltip: 'Create viral faceless videos'
    },
    {
      label: 'Features',
      path: '/features',
      icon: 'Sparkles',
      tooltip: 'Explore all features'
    },
    {
      label: 'Batch Creator',
      path: '/batch-creator',
      icon: 'Layers',
      tooltip: 'Create multiple videos'
    }
  ];

  useEffect(() => {
    const currentPath = location?.pathname;
    const activeNavItem = [...navigationTabs, ...secondaryNavigation]?.find(
      item => item?.path === currentPath
    );
    setActiveTab(activeNavItem?.path || '');
  }, [location?.pathname]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleTabClick = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  const handleAccountMenuToggle = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  const handleLogout = () => {
    navigate('/login');
    setIsAccountMenuOpen(false);
  };

  const isAuthPage = location?.pathname === '/login' || location?.pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-background border-b border-border surface-elevation">
      <div className="flex items-center justify-between h-[60px] px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className={`font-heading font-bold text-xl text-primary transition-neon ${glitchActive ? 'glitch-effect' : ''}`}>
            <span className="text-primary">Viral</span>
            <span className="text-secondary">Short</span>
            <span className="text-accent"> Studio</span>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationTabs?.map((tab) => {
            const isActive = activeTab === tab?.path;
            return (
              <button
                key={tab?.path}
                onClick={() => handleTabClick(tab?.path)}
                className={`
                  relative px-6 py-3 rounded-sm font-body font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? 'text-primary-foreground bg-primary shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={tab?.tooltip}
              >
                <div className="flex items-center space-x-2">
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Secondary Navigation - More Menu */}
        <div className="hidden md:block">
          <div className="relative ml-4">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              iconSize={16}
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              More
            </Button>
            
            {isAccountMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-md surface-elevation z-200">
                <div className="py-2">
                  {secondaryNavigation?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => {
                        handleTabClick(item?.path);
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center space-x-2"
                      title={item?.tooltip}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            iconName="Menu"
            iconSize={20}
            onClick={handleAccountMenuToggle}
            className="text-foreground"
          />
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            iconName="User"
            iconSize={20}
            onClick={handleAccountMenuToggle}
            className="text-foreground hover:bg-muted"
          />
          
          {isAccountMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-md surface-elevation z-200">
              <div className="py-2">
                <button
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center space-x-2"
                >
                  <Icon name="Settings" size={16} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center space-x-2"
                >
                  <Icon name="HelpCircle" size={16} />
                  <span>Help</span>
                </button>
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Bottom Tab Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-100 bg-background border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navigationTabs?.map((tab) => {
            const isActive = activeTab === tab?.path;
            return (
              <button
                key={tab?.path}
                onClick={() => handleTabClick(tab?.path)}
                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 rounded-sm transition-colors
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                  }
                `}
              >
                <Icon name={tab?.icon} size={20} />
                <span className="text-xs font-caption">{tab?.label}</span>
              </button>
            );
          })}
          
          {/* Templates in mobile bottom nav */}
          <button
            onClick={() => handleTabClick('/template-library')}
            className={`
              flex flex-col items-center space-y-1 px-3 py-2 rounded-sm transition-colors
              ${activeTab === '/template-library' ? 'text-primary' : 'text-muted-foreground'
              }
            `}
          >
            <Icon name="Library" size={20} />
            <span className="text-xs font-caption">Templates</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;