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
  describe('localStorage edge cases', () => {
    it('should handle localStorage being unavailable', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Simulate localStorage throwing (e.g., in private browsing mode)
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      saveSkillTreeToStorage(mockSkillTreeState);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save skill tree to localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle localStorage quota exceeded', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      localStorageMock.setItem.mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      saveSkillTreeToStorage(mockSkillTreeState);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save skill tree to localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle localStorage getItem throwing error', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('SecurityError: localStorage access denied');
      });

      const result = loadSkillTreeFromStorage();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load skill tree from localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('data integrity and validation', () => {
    beforeEach(() => {
      // Reset all mocks to their default behavior for this test suite
      vi.clearAllMocks();
      localStorageMock.setItem.mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.removeItem.mockImplementation(() => {});
    });

    it('should handle empty string from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('');

      const result = loadSkillTreeFromStorage();

      expect(result).toBeNull();
    });

    it('should handle whitespace-only string from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('   ');

      const result = loadSkillTreeFromStorage();

      expect(result).toBeNull();
    });

    it('should handle valid JSON but wrong structure', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Valid JSON but not a skill tree state
      localStorageMock.getItem.mockReturnValue('{"someOtherData": "value"}');

      const result = loadSkillTreeFromStorage();

      // Should still return the parsed object even if structure is wrong
      // The validation would be handled at a higher level
      expect(result).toEqual({ someOtherData: 'value' });

      consoleSpy.mockRestore();
    });

    it('should handle large skill tree data', () => {
      // Create a large skill tree state
      const largeState: SkillTreeState = {
        nodes: Array.from({ length: 100 }, (_, i) => ({
          id: `node-${i}`,
          type: 'default' as const,
          position: { x: i * 10, y: i * 20 },
          data: {
            id: `node-${i}`,
            name: `Skill ${i}`,
            description: `This is a very long description for skill ${i} that contains a lot of text to test how the storage handles larger amounts of data without issues`,
            isUnlocked: i < 50,
            isCompleted: i < 25,
            cost: i * 10,
            level: undefined,
          },
        })),
        edges: Array.from({ length: 50 }, (_, i) => ({
          id: `edge-${i}`,
          source: `node-${i}`,
          target: `node-${i + 1}`,
          type: 'default' as const,
        })),
      };

      saveSkillTreeToStorage(largeState);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'skillTreeState',
        JSON.stringify(largeState)
      );
    });

    it('should handle skill tree with special characters', () => {
      const specialCharState: SkillTreeState = {
        nodes: [
          {
            id: 'node-special',
            type: 'default',
            position: { x: 0, y: 0 },
            data: {
              id: 'node-special',
              name: 'C++ & Node.js™',
              description:
                'Learn C++ and Node.js! :rocket: "Advanced" concepts (including UTF-8: 中文)',
              isUnlocked: true,
              isCompleted: false,
            },
          },
        ],
        edges: [],
      };

      saveSkillTreeToStorage(specialCharState);
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(specialCharState)
      );

      const result = loadSkillTreeFromStorage();

      expect(result).toEqual(specialCharState);
    });

    it('should handle undefined and null values in data', () => {
      const stateWithNulls: SkillTreeState = {
        nodes: [
          {
            id: 'node-null',
            type: 'default',
            position: { x: 0, y: 0 },
            data: {
              id: 'node-null',
              name: 'Test Skill',
              description: 'Test description',
              isUnlocked: true,
              isCompleted: false,
              cost: undefined,
              level: undefined,
            },
          },
        ],
        edges: [],
      };

      saveSkillTreeToStorage(stateWithNulls);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'skillTreeState',
        JSON.stringify(stateWithNulls)
      );
    });
  });

  describe('backwards compatibility', () => {
    it('should handle loading data saved in old format', () => {
      // Simulate old format that might be missing some fields
      const oldFormatData = {
        nodes: [
          {
            id: 'old-node',
            position: { x: 0, y: 0 },
            data: {
              id: 'old-node',
              name: 'Old Skill',
              description: 'Old format',
              isUnlocked: true,
              isCompleted: false,
              // Missing type field that might be added later
            },
          },
        ],
        edges: [],
        // Missing some new fields that might be added
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(oldFormatData));

      const result = loadSkillTreeFromStorage();

      expect(result).toEqual(oldFormatData);
    });
  });
});
