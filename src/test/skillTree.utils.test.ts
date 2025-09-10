import { describe, it, expect } from 'vitest';
import {
  wouldCreateCycle,
  canUnlockSkill,
  updateSkillUnlockStatus,
} from '../utils/skillTree.utils';
import type { SkillNode, SkillEdge } from '../types/skill.types';

const createMockNode = (
  id: string,
  name: string,
  isCompleted = false
): SkillNode => ({
  id,
  type: 'default',
  position: { x: 0, y: 0 },
  data: {
    id,
    name,
    description: `Description for ${name}`,
    isUnlocked: true,
    isCompleted,
  },
});

const createMockEdge = (
  id: string,
  source: string,
  target: string
): SkillEdge => ({
  id,
  source,
  target,
  type: 'default',
});

describe('skillTree.utils', () => {
  describe('wouldCreateCycle', () => {
    it('should return false for no existing edges', () => {
      const nodes = [
        createMockNode('A', 'Skill A'),
        createMockNode('B', 'Skill B'),
      ];
      const edges: SkillEdge[] = [];
      const newEdge = { source: 'A', target: 'B' };

      expect(wouldCreateCycle(nodes, edges, newEdge)).toBe(false);
    });

    it('should return false for a simple chain', () => {
      const nodes = [
        createMockNode('A', 'Skill A'),
        createMockNode('B', 'Skill B'),
        createMockNode('C', 'Skill C'),
      ];
      const edges = [createMockEdge('1', 'A', 'B')];
      const newEdge = { source: 'B', target: 'C' };

      expect(wouldCreateCycle(nodes, edges, newEdge)).toBe(false);
    });

    it('should return true for a direct cycle', () => {
      const nodes = [
        createMockNode('A', 'Skill A'),
        createMockNode('B', 'Skill B'),
      ];
      const edges = [createMockEdge('1', 'A', 'B')];
      const newEdge = { source: 'B', target: 'A' };

      expect(wouldCreateCycle(nodes, edges, newEdge)).toBe(true);
    });

    it('should return true for an indirect cycle', () => {
      const nodes = [
        createMockNode('A', 'Skill A'),
        createMockNode('B', 'Skill B'),
        createMockNode('C', 'Skill C'),
      ];
      const edges = [
        createMockEdge('1', 'A', 'B'),
        createMockEdge('2', 'B', 'C'),
      ];
      const newEdge = { source: 'C', target: 'A' };

      expect(wouldCreateCycle(nodes, edges, newEdge)).toBe(true);
    });
  });

  describe('canUnlockSkill', () => {
    it('should return true for skill with no prerequisites', () => {
      const nodes = [createMockNode('A', 'Skill A')];
      const edges: SkillEdge[] = [];

      expect(canUnlockSkill('A', nodes, edges)).toBe(true);
    });

    it('should return true when all prerequisites are completed', () => {
      const nodes = [
        createMockNode('A', 'Skill A', true),
        createMockNode('B', 'Skill B', true),
        createMockNode('C', 'Skill C', false),
      ];
      const edges = [
        createMockEdge('1', 'A', 'C'),
        createMockEdge('2', 'B', 'C'),
      ];

      expect(canUnlockSkill('C', nodes, edges)).toBe(true);
    });

    it('should return false when some prerequisites are not completed', () => {
      const nodes = [
        createMockNode('A', 'Skill A', true),
        createMockNode('B', 'Skill B', false),
        createMockNode('C', 'Skill C', false),
      ];
      const edges = [
        createMockEdge('1', 'A', 'C'),
        createMockEdge('2', 'B', 'C'),
      ];

      expect(canUnlockSkill('C', nodes, edges)).toBe(false);
    });
  });

  describe('updateSkillUnlockStatus', () => {
    it('should unlock skills with no prerequisites', () => {
      const nodes = [
        createMockNode('A', 'Skill A'),
        createMockNode('B', 'Skill B'),
      ];
      const edges: SkillEdge[] = [];

      const result = updateSkillUnlockStatus(nodes, edges);

      expect(result[0].data.isUnlocked).toBe(true);
      expect(result[1].data.isUnlocked).toBe(true);
    });
    it('should properly update unlock status based on prerequisites', () => {
      const nodes = [
        createMockNode('A', 'Skill A', true),
        createMockNode('B', 'Skill B', false),
        createMockNode('C', 'Skill C', false),
      ];
      const edges = [
        createMockEdge('1', 'A', 'B'),
        createMockEdge('2', 'B', 'C'),
      ];

      const result = updateSkillUnlockStatus(nodes, edges);

      // A should be unlocked (no prerequisites)
      expect(result.find((n) => n.id === 'A')?.data.isUnlocked).toBe(true);
      // B should be unlocked (A is completed)
      expect(result.find((n) => n.id === 'B')?.data.isUnlocked).toBe(true);
      // C should be locked (B is not completed)
      expect(result.find((n) => n.id === 'C')?.data.isUnlocked).toBe(false);
    });

    it('should handle complex dependency trees', () => {
      const nodes = [
        createMockNode('A', 'Skill A', true), // completed
        createMockNode('B', 'Skill B', true), // completed
        createMockNode('C', 'Skill C', false), // unlocked (A,B completed)
        createMockNode('D', 'Skill D', false), // unlocked (A completed)
        createMockNode('E', 'Skill E', false), // locked (C,D not completed)
      ];
      const edges = [
        createMockEdge('1', 'A', 'C'), // A -> C
        createMockEdge('2', 'B', 'C'), // B -> C
        createMockEdge('3', 'A', 'D'), // A -> D
        createMockEdge('4', 'C', 'E'), // C -> E
        createMockEdge('5', 'D', 'E'), // D -> E
      ];

      const result = updateSkillUnlockStatus(nodes, edges);

      expect(result.find((n) => n.id === 'A')?.data.isUnlocked).toBe(true);
      expect(result.find((n) => n.id === 'B')?.data.isUnlocked).toBe(true);
      expect(result.find((n) => n.id === 'C')?.data.isUnlocked).toBe(true); // A,B completed
      expect(result.find((n) => n.id === 'D')?.data.isUnlocked).toBe(true); // A completed
      expect(result.find((n) => n.id === 'E')?.data.isUnlocked).toBe(false); // C,D not completed
    });

    it('should preserve completed status when updating unlock status', () => {
      const nodes = [
        createMockNode('A', 'Skill A', true),
        createMockNode('B', 'Skill B', true),
      ];
      const edges: SkillEdge[] = [];

      const result = updateSkillUnlockStatus(nodes, edges);

      expect(result.find((n) => n.id === 'A')?.data.isCompleted).toBe(true);
      expect(result.find((n) => n.id === 'B')?.data.isCompleted).toBe(true);
    });
  });

  describe('wouldCreateCycle - additional edge cases', () => {
    it('should return true for self-loop (skill depending on itself)', () => {
      const nodes = [createMockNode('A', 'Skill A')];
      const edges: SkillEdge[] = [];
      const newEdge = { source: 'A', target: 'A' };

      // Self-loops should be detected as cycles
      expect(wouldCreateCycle(nodes, edges, newEdge)).toBe(true);
    });

    it('should handle complex cycle detection with multiple paths', () => {
      const nodes = [
        createMockNode('A', 'Skill A'),
        createMockNode('B', 'Skill B'),
        createMockNode('C', 'Skill C'),
        createMockNode('D', 'Skill D'),
      ];
      const edges = [
        createMockEdge('1', 'A', 'B'),
        createMockEdge('2', 'B', 'C'),
        createMockEdge('3', 'B', 'D'),
        createMockEdge('4', 'D', 'C'),
      ];
      const newEdge = { source: 'C', target: 'A' };

      expect(wouldCreateCycle(nodes, edges, newEdge)).toBe(true);
    });

    it('should return false when adding edge to disconnected component', () => {
      const nodes = [
        createMockNode('A', 'Skill A'),
        createMockNode('B', 'Skill B'),
        createMockNode('C', 'Skill C'),
        createMockNode('D', 'Skill D'),
      ];
      const edges = [createMockEdge('1', 'A', 'B')];
      const newEdge = { source: 'C', target: 'D' };

      expect(wouldCreateCycle(nodes, edges, newEdge)).toBe(false);
    });

    it('should handle empty nodes array', () => {
      const nodes: SkillNode[] = [];
      const edges: SkillEdge[] = [];
      const newEdge = { source: 'A', target: 'B' };

      expect(wouldCreateCycle(nodes, edges, newEdge)).toBe(false);
    });
  });

  describe('canUnlockSkill - additional edge cases', () => {
    it('should return true for non-existent skill (no prerequisites defined)', () => {
      const nodes = [createMockNode('A', 'Skill A')];
      const edges: SkillEdge[] = [];

      // Non-existent skills have no prerequisites, so they can be "unlocked"
      expect(canUnlockSkill('NONEXISTENT', nodes, edges)).toBe(true);
    });

    it('should handle skill with multiple prerequisite chains', () => {
      const nodes = [
        createMockNode('A', 'Skill A', true),
        createMockNode('B', 'Skill B', false),
        createMockNode('C', 'Skill C', true),
        createMockNode('D', 'Skill D', false),
        createMockNode('E', 'Skill E', false),
      ];
      const edges = [
        createMockEdge('1', 'A', 'B'),
        createMockEdge('2', 'B', 'E'),
        createMockEdge('3', 'C', 'D'),
        createMockEdge('4', 'D', 'E'),
      ];

      // E needs both B and D to be completed, but B is not completed
      expect(canUnlockSkill('E', nodes, edges)).toBe(false);
    });

    it('should return true for already completed skill', () => {
      const nodes = [
        createMockNode('A', 'Skill A', true),
        createMockNode('B', 'Skill B', true),
      ];
      const edges = [createMockEdge('1', 'A', 'B')];

      expect(canUnlockSkill('B', nodes, edges)).toBe(true);
    });

    it('should handle empty edges array', () => {
      const nodes = [createMockNode('A', 'Skill A')];
      const edges: SkillEdge[] = [];

      expect(canUnlockSkill('A', nodes, edges)).toBe(true);
    });

    it('should handle empty nodes array (no prerequisites means unlockable)', () => {
      const nodes: SkillNode[] = [];
      const edges: SkillEdge[] = [];

      // With no nodes and no edges, any skill has no prerequisites
      expect(canUnlockSkill('A', nodes, edges)).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    it('should handle a realistic skill tree progression', () => {
      const nodes = [
        createMockNode('HTML', 'HTML Basics', true),
        createMockNode('CSS', 'CSS Basics', true),
        createMockNode('JS', 'JavaScript', false),
        createMockNode('React', 'React', false),
        createMockNode('Node', 'Node.js', false),
        createMockNode('Fullstack', 'Full Stack', false),
      ];
      const edges = [
        createMockEdge('1', 'HTML', 'JS'),
        createMockEdge('2', 'CSS', 'JS'),
        createMockEdge('3', 'JS', 'React'),
        createMockEdge('4', 'JS', 'Node'),
        createMockEdge('5', 'React', 'Fullstack'),
        createMockEdge('6', 'Node', 'Fullstack'),
      ];

      const result = updateSkillUnlockStatus(nodes, edges);

      expect(result.find((n) => n.id === 'HTML')?.data.isUnlocked).toBe(true);
      expect(result.find((n) => n.id === 'CSS')?.data.isUnlocked).toBe(true);
      expect(result.find((n) => n.id === 'JS')?.data.isUnlocked).toBe(true); // HTML,CSS completed
      expect(result.find((n) => n.id === 'React')?.data.isUnlocked).toBe(false); // JS not completed
      expect(result.find((n) => n.id === 'Node')?.data.isUnlocked).toBe(false); // JS not completed
      expect(result.find((n) => n.id === 'Fullstack')?.data.isUnlocked).toBe(
        false
      ); // React,Node not completed
    });

    it('should prevent creating cycles in realistic scenarios', () => {
      const nodes = [
        createMockNode('Frontend', 'Frontend'),
        createMockNode('Backend', 'Backend'),
        createMockNode('Database', 'Database'),
        createMockNode('API', 'API Design'),
      ];
      const edges = [
        createMockEdge('1', 'Frontend', 'API'),
        createMockEdge('2', 'Backend', 'API'),
        createMockEdge('3', 'Database', 'Backend'),
      ];

      // Should not allow API -> Database (would create Frontend -> API -> Database -> Backend -> API cycle)
      const newEdge1 = { source: 'API', target: 'Database' };
      expect(wouldCreateCycle(nodes, edges, newEdge1)).toBe(true);

      // Should allow Frontend -> Database (no cycle)
      const newEdge2 = { source: 'Frontend', target: 'Database' };
      expect(wouldCreateCycle(nodes, edges, newEdge2)).toBe(false);
    });
  });
});
