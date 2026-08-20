import { useState } from 'react';
import type { PortfolioProject } from '../../data/portfolioProjects';
import './ProjectIndex.css';

interface ProjectIndexProps {
  projects: PortfolioProject[];
  activeProjectId: string;
  onSelect: (projectId: string) => void;
}

export default function ProjectIndex({ projects, activeProjectId, onSelect }: ProjectIndexProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`project-index ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="index-rail">
        {projects.map((proj) => {
          const isClickable = proj.enabled;
          const isActive = proj.id === activeProjectId;
          
          return (
            <div 
              key={proj.id} 
              className={`index-item ${isClickable ? 'is-clickable' : 'is-disabled'} ${isActive ? 'is-active' : ''}`}
              onClick={() => isClickable && onSelect(proj.id)}
              role={isClickable ? "button" : "presentation"}
              tabIndex={isClickable ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (isClickable) onSelect(proj.id);
                }
              }}
            >
              <span className="index-num">{proj.number}</span>
              <span className="index-title">
                {proj.title}
                {proj.subtitle && <em className="index-subtitle">{proj.subtitle}</em>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
