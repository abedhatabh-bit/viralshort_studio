import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 4000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleEdit = () => {
    navigate('/video-creator', { state: { projectId: project?.id } });
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000)?.toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000)?.toFixed(1)}K`;
    return views?.toString();
  };

  const getViralScoreColor = (score) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div
      className={`
        relative bg-card border border-border rounded-lg overflow-hidden transition-neon
        ${isHovered ? 'neon-glow-primary surface-elevation' : ''}
        ${glitchActive ? 'glitch-effect' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] overflow-hidden">
        <Image
          src={project?.thumbnail}
          alt={project?.title}
          className="w-full h-full object-cover transition-smooth hover:scale-105"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-neon">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center neon-glow-primary">
            <Icon name="Play" size={24} className="text-primary-foreground ml-1" />
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`
            px-2 py-1 rounded-sm text-xs font-mono font-medium
            ${project?.status === 'published' ? 'bg-success text-success-foreground' : ''}
            ${project?.status === 'draft' ? 'bg-warning text-warning-foreground' : ''}
            ${project?.status === 'processing' ? 'bg-accent text-accent-foreground' : ''}
          `}>
            {project?.status?.toUpperCase()}
          </span>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded-sm">
          <span className="text-xs font-mono text-foreground">{project?.duration}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2">
          {project?.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground font-mono">
            {project?.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {project?.createdAt}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-primary">
              {formatViews(project?.views)}
            </div>
            <div className="text-xs text-muted-foreground">Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-secondary">
              {project?.engagement}%
            </div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-mono font-bold ${getViralScoreColor(project?.viralScore)}`}>
              {project?.viralScore}
            </div>
            <div className="text-xs text-muted-foreground">Viral Score</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={handleEdit}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Share"
            iconSize={16}
            className="px-3"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            iconSize={16}
            className="px-3"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;