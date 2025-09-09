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
  });
});
