import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSkillSearch } from '../hooks/useSkillSearch';
import type { SkillNode } from '../types/skill.types';

const createMockNode = (
  id: string,
  name: string,
  description: string
): SkillNode => ({
  id,
  type: 'default',
  position: { x: 0, y: 0 },
  data: {
    id,
    name,
    description,
    isUnlocked: true,
    isCompleted: false,
  },
});

const mockNodes: SkillNode[] = [
  createMockNode(
    '1',
    'JavaScript Basics',
    'Learn the fundamentals of JavaScript'
  ),
  createMockNode('2', 'React Components', 'Build reusable UI components'),
  createMockNode('3', 'Node.js Server', 'Create backend applications'),
  createMockNode('4', 'TypeScript Types', 'Add type safety to JavaScript'),
];

describe('useSkillSearch', () => {
  it('should initialize with empty search term', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    expect(result.current.searchTerm).toBe('');
    expect(result.current.hasActiveSearch).toBe(false);
  });

  it('should return all nodes when search term is empty', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    expect(result.current.filteredNodes).toEqual(mockNodes);
    expect(result.current.highlightedNodeIds.size).toBe(0);
  });

  it('should filter nodes by name', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    expect(result.current.filteredNodes).toHaveLength(2); // JavaScript Basics and TypeScript Types
    expect(result.current.filteredNodes[0].data.name).toBe('JavaScript Basics');
    expect(result.current.filteredNodes[1].data.name).toBe('TypeScript Types');
  });

  it('should filter nodes by description', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    act(() => {
      result.current.setSearchTerm('fundamentals');
    });

    expect(result.current.filteredNodes).toHaveLength(1);
    expect(result.current.filteredNodes[0].data.name).toBe('JavaScript Basics');
  });

  it('should be case insensitive', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    act(() => {
      result.current.setSearchTerm('REACT');
    });

    expect(result.current.filteredNodes).toHaveLength(1);
    expect(result.current.filteredNodes[0].data.name).toBe('React Components');
  });

  it('should handle partial matches', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    act(() => {
      result.current.setSearchTerm('Type');
    });

    expect(result.current.filteredNodes).toHaveLength(1);
    expect(result.current.filteredNodes[0].data.name).toBe('TypeScript Types');
  });

  it('should return empty array for no matches', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    act(() => {
      result.current.setSearchTerm('nonexistent');
    });

    expect(result.current.filteredNodes).toHaveLength(0);
    expect(result.current.highlightedNodeIds.size).toBe(0);
  });

  it('should create highlighted node IDs for matches', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    expect(result.current.highlightedNodeIds.size).toBe(2);
    expect(result.current.highlightedNodeIds.has('1')).toBe(true); // JavaScript Basics
    expect(result.current.highlightedNodeIds.has('4')).toBe(true); // TypeScript Types
  });

  it('should update hasActiveSearch based on search term', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    expect(result.current.hasActiveSearch).toBe(false);

    act(() => {
      result.current.setSearchTerm('React');
    });

    expect(result.current.hasActiveSearch).toBe(true);

    act(() => {
      result.current.setSearchTerm('   '); // whitespace only
    });

    expect(result.current.hasActiveSearch).toBe(false);
  });
});
