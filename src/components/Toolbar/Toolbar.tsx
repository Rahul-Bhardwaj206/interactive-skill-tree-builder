import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  id?: string;
  onAddSkill: () => void;
  onClearAll: () => void;
  onLoadSample?: () => void;
  skillCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  id,
  onAddSkill,
  onClearAll,
  onLoadSample,
  skillCount,
}) => {
  return (
    <header id={id} className="toolbar" role="banner">
      <div className="toolbar-section">
        <h1 className="app-title">Interactive Skill Tree Builder</h1>
        <p className="app-subtitle">
          Create skills, connect prerequisites, and track your progress
        </p>
      </div>

      <div className="toolbar-section">
        <div
          className="skill-count"
          role="status"
          aria-live="polite"
          aria-label={`Total skills: ${skillCount}`}
        >
          {skillCount} skill{skillCount !== 1 ? 's' : ''}
        </div>

        <div
          className="toolbar-buttons"
          role="toolbar"
          aria-label="Skill tree actions"
        >
          <button
            type="button"
            onClick={onAddSkill}
            className="btn btn-primary"
            aria-describedby="add-skill-help"
          >
            <span aria-hidden="true">+</span> Add Skill
            <span id="add-skill-help" className="sr-only">
              Open dialog to create a new skill
            </span>
          </button>

          {skillCount === 0 && onLoadSample && (
            <button
              type="button"
              onClick={onLoadSample}
              className="btn btn-secondary"
              aria-describedby="load-sample-help"
            >
              <span aria-hidden="true">✅</span> Load Skill Tree
              <span id="load-sample-help" className="sr-only">
                Load a skill tree to get started quickly
              </span>
            </button>
          )}

          {skillCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="btn btn-danger"
              aria-describedby="clear-all-help"
            >
              Clear All
              <span id="clear-all-help" className="sr-only">
                Remove all skills from the tree (cannot be undone)
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
