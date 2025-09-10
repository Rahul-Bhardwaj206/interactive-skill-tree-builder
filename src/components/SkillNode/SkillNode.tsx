import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SkillData } from '../../types/skill.types';
import './SkillNode.css';

interface SkillNodeProps extends NodeProps {
  data: SkillData;
  isHighlighted?: boolean;
  onToggleCompletion?: (skillId: string) => void;
  onDelete?: (skillId: string) => void;
}

export const SkillNode: React.FC<SkillNodeProps> = ({
  data,
  id,
  isHighlighted = false,
  onToggleCompletion,
  onDelete,
}) => {
  const { description, isCompleted, isUnlocked, level, name } = data;
  const handleToggleCompletion = () => {
    onToggleCompletion?.(id);
  };

  const handleDelete = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the skill: ${name}? \n\nThis action cannot be undone.`
    );
    if (confirmDelete) onDelete?.(id);
  };

  const handleDeleteKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDelete(event);
    }
  };

  const getNodeClassName = () => {
    let className = 'skill-node';

    if (isCompleted) {
      className += ' completed';
    } else if (isUnlocked) {
      className += ' unlocked';
    } else {
      className += ' locked';
    }

    if (isHighlighted) {
      className += ' highlighted';
    }

    return className;
  };

  const skillStatus = isCompleted
    ? 'completed'
    : isUnlocked
      ? 'available'
      : 'locked';
  const skillStatusText = isCompleted
    ? 'Completed'
    : isUnlocked
      ? 'Available to complete'
      : 'Locked - complete prerequisites first';

  return (
    <div
      className={getNodeClassName()}
      role="article"
      aria-labelledby={`skill-title-${id}`}
      aria-describedby={`skill-description=${id} skill-status-${id}`}
      tabIndex={0}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="skill-handle skill-handle-target"
        aria-label={`Prerequisite connection point for ${name}`}
      />
      <div className="skill-node-header">
        <h3 id={`skill-title-${id}`} className="skill-node-title">
          {name}
        </h3>
        <button
          className="skill-node-delete"
          onClick={handleDelete}
          onKeyDown={handleDeleteKeyDown}
          aria-label={`Delete skill: ${name}`}
          title={`Delete ${name}`}
        >
          <span aria-hidden="true">x</span>
          <span className="sr-only">Delete</span>
        </button>
      </div>

      <p id={`skill-description=${id}`} className="skill-node-description">
        {description}
      </p>
      {level && (
        <div className="skill-node-meta" aria-label="Skill requirements">
          <span
            className="skill-node-level"
            aria-label={`Required Level: ${level}`}
          >
            Level: {level}
          </span>
        </div>
      )}
      <div className="skill-node-status" role="status" aria-live="polite">
        <span
          id={`skill-status-${id}`}
          className={`status-indicator ${skillStatus}`}
          aria-label={skillStatusText}
        >
          <span aria-hidden="true">
            {isCompleted
              ? '✓ Completed'
              : isUnlocked
                ? '○ Available'
                : '🔒 Locked'}
          </span>
          <span className="sr-only">{skillStatusText}</span>
        </span>

        <button
          className="skill-node-toggle"
          onClick={handleToggleCompletion}
          disabled={!isUnlocked && !isCompleted}
          aria-describedby={`skill-status-${id}`}
          title={
            isCompleted
              ? `Mark ${name} as incomplete`
              : isUnlocked
                ? `Mark ${name} as complete`
                : 'Complete prerequisites to unlock this skill'
          }
        >
          {isCompleted ? 'Mark Incomplete' : 'Complete Skill'}
        </button>

        <Handle
          type="source"
          position={Position.Bottom}
          className="skill-handle skill-handle-source"
          aria-label={`Connection point to set ${name} as prerequisite`}
        />
      </div>
    </div>
  );
};
