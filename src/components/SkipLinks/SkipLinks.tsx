import React from 'react';
import './SkipLinks.css';

export const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#skill-search" className="skip-link">
        Skip to search
      </a>
      <a href="#toolbar-actions" className="skip-link">
        Skip to toolbar
      </a>
    </div>
  );
};
