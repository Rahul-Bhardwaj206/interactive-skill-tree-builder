import type { Edge, Node } from '@xyflow/react';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SkillData extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  cost?: number;
  level?: SkillLevel;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export type SkillNode = Node<SkillData>;

export interface SkillEdge extends Edge {
  id: string;
  source: string;
  target: string;
}

export interface SkillTreeState {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export interface AddSkillFormData {
  name: string;
  description: string;
  cost?: number;
  level?: SkillLevel;
}
