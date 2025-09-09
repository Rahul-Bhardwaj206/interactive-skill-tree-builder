import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveSkillTreeToStorage,
  loadSkillTreeFromStorage,
  clearSkillTreeFromStorage,
} from '../utils/storage.utils';
import type { SkillTreeState } from '../types/skill.types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

vi.stubGlobal('localStorage', localStorageMock);

const mockSkillTreeState: SkillTreeState = {
  nodes: [
    {
      id: 'node-1',
      type: 'default',
      position: { x: 100, y: 100 },
      data: {
        id: 'node-1',
        name: 'JavaScript Basics',
        description: 'Learn the fundamentals',
        isUnlocked: true,
        isCompleted: true,
      },
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'default',
    },
  ],
};

describe('storage.utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveSkillTreeToStorage', () => {
    it('should save skill tree state to localStorage', () => {
      saveSkillTreeToStorage(mockSkillTreeState);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'skillTreeState',
        JSON.stringify(mockSkillTreeState)
      );
    });

    it('should handle JSON stringify errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Create an object that can't be serialized
      const circularRef: Record<string, unknown> = {};
      circularRef.self = circularRef;
      const badState = {
        ...mockSkillTreeState,
        circularRef,
      };

      saveSkillTreeToStorage(badState);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save skill tree to localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('loadSkillTreeFromStorage', () => {
    it('should load skill tree state from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockSkillTreeState)
      );

      const result = loadSkillTreeFromStorage();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('skillTreeState');
      expect(result).toEqual(mockSkillTreeState);
    });

    it('should return null when no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = loadSkillTreeFromStorage();

      expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue('invalid json');

      const result = loadSkillTreeFromStorage();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load skill tree from localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('clearSkillTreeFromStorage', () => {
    it('should remove skill tree data from localStorage', () => {
      clearSkillTreeFromStorage();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'skillTreeState'
      );
    });

    it('should handle removal errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      clearSkillTreeFromStorage();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear skill tree from localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
 });
});
});