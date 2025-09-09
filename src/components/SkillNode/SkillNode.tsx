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
  const handleToggleCompletion = () => {
    onToggleCompletion?.(id);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete?.(id);
  };

  const getNodeClassName = () => {
    let className = 'skill-node';

    if (data.isCompleted) {
      className += ' completed';
    } else if (data.isUnlocked) {
      className += ' unlocked';
    } else {
      className += ' locked';
    }

    if (isHighlighted) {
      className += ' highlighted';
    }

    return className;
  };

  const skillStatus = data.isCompleted
    ? 'completed'
    : data.isUnlocked
      ? 'available'
      : 'locked';
  const skillStatusText = data.isCompleted
    ? 'Completed'
    : data.isUnlocked
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
        aria-label={`Prerequisite connection point for ${data.name}`}
      />
      <div className="skill-node-header">
        <h3 id={`skill-title-${id}`} className="skill-node-title">
          {data.name}
        </h3>
        <button
          className="skill-node-delete"
          onClick={handleDelete}
          aria-label={`Delete skill: ${data.name}`}
          title={`Delete ${data.name}`}
        >
          <span aria-hidden="true">x</span>
          <span className="sr-only">Delete</span>
        </button>
      </div>

      <p id={`skill-description=${id}`} className="skill-node-description">
        {data.description}
      </p>
      {(data.cost || data.level) && (
        <div className="skill-node-meta" aria-label="Skill requirements">
          {data.cost && (
            <span
              className="skill-node-cost"
              aria-label={`Cost: ${data.cost} points`}
            >
              Cost: {data.cost}
            </span>
          )}
          {data.level && (
            <span
              className="skill-node-level"
              aria-label={`Required Level: ${data.level}`}
            >
              Level: {data.level}
            </span>
          )}
        </div>
      )}
      <div className="skill-node-status" role="status" aria-live="polite">
        <span
          id={`skill-status-${id}`}
          className={`status-indicator ${skillStatus}`}
          aria-label={skillStatusText}
        >
          <span aria-hidden="true">
            {data.isCompleted
              ? '✓ Completed'
              : data.isUnlocked
                ? '○ Available'
                : ':lock: Locked'}
          </span>
          <span className="sr-only">{skillStatusText}</span>
        </span>

        <button
          className="skill-node-toggle"
          onClick={handleToggleCompletion}
          disabled={!data.isUnlocked && !data.isCompleted}
          aria-describedby={`skill-status-${id}`}
          title={
            data.isCompleted
              ? `Mark ${data.name} as incomplete`
              : data.isUnlocked
                ? `Mark ${data.name} as complete`
                : 'Complete prerequisites to unlock this skill'
          }
        >
          {data.isCompleted ? 'Mark Incomplete' : 'Complete Skill'}
        </button>

        <Handle
          type="source"
          position={Position.Bottom}
          className="skill-handle skill-handle-source"
          aria-label={`Connection point to set ${data.name} as prerequisite`}
        />
      </div>
    </div>
  );
};
