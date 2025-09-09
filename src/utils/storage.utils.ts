import type { SkillTreeState } from '../types/skill.types';

const STORAGE_KEY = 'skillTreeState';

/**
 * Saves the skill tree state to localStorage
 */
export const saveSkillTreeToStorage = (state: SkillTreeState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Failed to save skill tree to localStorage:', error);
  }
};

/**
 * Loads the skill tree state from localStorage
 */
export const loadSkillTreeFromStorage = (): SkillTreeState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return null;
    }
    return JSON.parse(serializedState) as SkillTreeState;
  } catch (error) {
    console.error('Failed to load skill tree from localStorage:', error);
    return null;
  }
};

/**
 * Clears the skill tree state from localStorage
 */
export const clearSkillTreeFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear skill tree from localStorage:', error);
  }
};
