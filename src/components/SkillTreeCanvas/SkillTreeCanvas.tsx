import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type NodeTypes,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type DefaultEdgeOptions,
} from '@xyflow/react';
import { SkillNode } from '../SkillNode/SkillNode';
import type {
  SkillNode as SkillNodeType,
  SkillEdge,
} from '../../types/skill.types';
import './SkillTreeCanvas.css';

// Node types factory function
const createNodeTypes = (
  highlightedNodeIds: Set<string>,
  onToggleCompletion: (skillId: string) => void,
  onDeleteSkill: (skillId: string) => void
): NodeTypes => ({
  default: (props) => (
    <SkillNode
      {...props}
      isHighlighted={highlightedNodeIds.has(props.id)}
      onToggleCompletion={onToggleCompletion}
      onDelete={onDeleteSkill}
    />
  ),
});

interface SkillTreeCanvasProps {
  id?: string;
  nodes: SkillNodeType[];
  edges: SkillEdge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onToggleCompletion: (skillId: string) => void;
  onDeleteSkill: (skillId: string) => void;
  highlightedNodeIds: Set<string>;
}

// Default edge options
const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#6b7280',
    strokeWidth: 1,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    strokeWidth: 1,
  },
};
export const SkillTreeCanvas: React.FC<SkillTreeCanvasProps> = ({
  id,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onToggleCompletion,
  onDeleteSkill,
  highlightedNodeIds,
}) => {
  // Create memoized node types using the factory
  const nodeTypes = useMemo(
    () =>
      createNodeTypes(highlightedNodeIds, onToggleCompletion, onDeleteSkill),
    [highlightedNodeIds, onToggleCompletion, onDeleteSkill]
  );

  // Custom minimap node color function
  const getNodeColor = useCallback((node: SkillNodeType) => {
    if (node.data.isCompleted) return '#22C55E';
    if (node.data.isUnlocked) return '#3B82F6';
    return '#9CA3AF';
  }, []);

  return (
    <main id={id} className="skill-tree-canvas" role="main">
      <div
        className="skill-tree-viewport"
        role="application"
        aria-label="Interactive skill tree"
        aria-describedby="skill-tree-instructions"
      >
        <div id="skill-tree-instructions" className="sr-only">
          Use tab to navigate between skills. Use arrow keys to pan the view.
          Use mouse wheel or plus/minus keys to zoom. Drag from skill connection
          points to create prerequisites.
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: true,
            minZoom: 0.5,
          }}
          className="react-flow-canvas"
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={getNodeColor}
            nodeStrokeWidth={1}
            zoomable
            pannable
            position="top-left"
          />
        </ReactFlow>

        {nodes.length === 0 && (
          <div className="empty-state" role="status" aria-live="polite">
            <div className="empty-state-content">
              <div className="empty-state-icon" aria-hidden="true">
                🎯
              </div>
              <h3>No skills yet</h3>
              <p>Start building your skill tree by adding your first skill!</p>
              <div className="empty-state-hint">
                <strong>Getting Started:</strong>
                <ul>
                  <li>Add skills using the "Add Skill" button</li>
                  <li>
                    Drag from the bottom handle of one skill to the top of
                    another to create prerequisites
                  </li>
                  <li>
                    Click skills to mark them as complete when prerequisites are
                    met
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
