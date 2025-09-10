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

  // Edge cases and robustness tests
  it('should handle empty nodes array', () => {
    const { result } = renderHook(() => useSkillSearch([]));

    expect(result.current.filteredNodes).toEqual([]);
    expect(result.current.highlightedNodeIds.size).toBe(0);

    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    expect(result.current.filteredNodes).toEqual([]);
    expect(result.current.highlightedNodeIds.size).toBe(0);
  });

  it('should handle special characters in search term', () => {
    const specialNode = createMockNode(
      '5',
      'C++/C# Programming',
      'Learn C++ and C# languages'
    );
    const nodesWithSpecial = [...mockNodes, specialNode];
    const { result } = renderHook(() => useSkillSearch(nodesWithSpecial));

    act(() => {
      result.current.setSearchTerm('C++');
    });

    expect(result.current.filteredNodes).toHaveLength(1);
    expect(result.current.filteredNodes[0].data.name).toBe(
      'C++/C# Programming'
    );
  });

  it('should handle regex special characters safely', () => {
    const regexNode = createMockNode(
      '6',
      'Regex (.*) Patterns',
      'Learn regular expressions'
    );
    const nodesWithRegex = [...mockNodes, regexNode];
    const { result } = renderHook(() => useSkillSearch(nodesWithRegex));

    act(() => {
      result.current.setSearchTerm('(.*)');
    });

    expect(result.current.filteredNodes).toHaveLength(1);
    expect(result.current.filteredNodes[0].data.name).toBe(
      'Regex (.*) Patterns'
    );
  });

  it('should handle whitespace in search term correctly', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    act(() => {
      result.current.setSearchTerm('  JavaScript  ');
    });

    // The implementation uses raw searchTerm for filtering (not trimmed)
    // so leading/trailing spaces will prevent matches
    expect(result.current.searchTerm).toBe('  JavaScript  ');
    expect(result.current.filteredNodes).toHaveLength(0); // No matches due to spaces
    expect(result.current.hasActiveSearch).toBe(true); // But still considered active (trim() > 0)

    // However, search without extra spaces should work
    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    expect(result.current.filteredNodes).toHaveLength(2);
  });

  it('should handle very long search terms', () => {
    const longSearchTerm = 'JavaScript'.repeat(100);
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    act(() => {
      result.current.setSearchTerm(longSearchTerm);
    });

    expect(result.current.filteredNodes).toHaveLength(0);
    expect(result.current.hasActiveSearch).toBe(true);
  });

  it('should handle unicode characters', () => {
    const unicodeNode = createMockNode(
      '7',
      'Español Programming',
      'Programación en español :es:'
    );
    const nodesWithUnicode = [...mockNodes, unicodeNode];
    const { result } = renderHook(() => useSkillSearch(nodesWithUnicode));

    act(() => {
      result.current.setSearchTerm(':es:');
    });

    expect(result.current.filteredNodes).toHaveLength(1);
    expect(result.current.filteredNodes[0].data.name).toBe(
      'Español Programming'
    );
  });

  it('should handle nodes with missing data properties gracefully', () => {
    const nodeWithMissingData: SkillNode = {
      id: '8',
      type: 'default',
      position: { x: 0, y: 0 },
      data: {
        id: '8',
        name: '',
        description: '',
        isUnlocked: true,
        isCompleted: false,
      },
    };
    const nodesWithEmpty = [...mockNodes, nodeWithMissingData];
    const { result } = renderHook(() => useSkillSearch(nodesWithEmpty));

    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    expect(result.current.filteredNodes).toHaveLength(2); // Should still find the other nodes
  });

  it('should maintain search results when nodes array changes', () => {
    const { result, rerender } = renderHook(
      ({ nodes }) => useSkillSearch(nodes),
      { initialProps: { nodes: mockNodes } }
    );

    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    expect(result.current.filteredNodes).toHaveLength(2);

    // Add a new node that matches the search
    const newNode = createMockNode(
      '9',
      'Advanced JavaScript',
      'Advanced JS concepts'
    );
    const updatedNodes = [...mockNodes, newNode];

    rerender({ nodes: updatedNodes });

    expect(result.current.filteredNodes).toHaveLength(3);
    expect(result.current.searchTerm).toBe('JavaScript'); // Search term should persist
  });

  it('should handle rapid search term changes', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    // Simulate rapid typing
    act(() => {
      result.current.setSearchTerm('J');
    });
    act(() => {
      result.current.setSearchTerm('Ja');
    });
    act(() => {
      result.current.setSearchTerm('Jav');
    });
    act(() => {
      result.current.setSearchTerm('Java');
    });
    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    expect(result.current.searchTerm).toBe('JavaScript');
    expect(result.current.filteredNodes).toHaveLength(2);
    expect(result.current.hasActiveSearch).toBe(true);
  });

  it('should handle search with only numbers', () => {
    const numberNode = createMockNode(
      '10',
      'Version 2.0 Features',
      'Learn about version 2.0'
    );
    const nodesWithNumbers = [...mockNodes, numberNode];
    const { result } = renderHook(() => useSkillSearch(nodesWithNumbers));

    act(() => {
      result.current.setSearchTerm('2.0');
    });

    expect(result.current.filteredNodes).toHaveLength(1);
    expect(result.current.filteredNodes[0].data.name).toBe(
      'Version 2.0 Features'
    );
  });

  it('should clear search results when search term is cleared', () => {
    const { result } = renderHook(() => useSkillSearch(mockNodes));

    // Set search term
    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    expect(result.current.filteredNodes).toHaveLength(2);
    expect(result.current.hasActiveSearch).toBe(true);

    // Clear search term
    act(() => {
      result.current.setSearchTerm('');
    });

    expect(result.current.filteredNodes).toEqual(mockNodes);
    expect(result.current.hasActiveSearch).toBe(false);
    expect(result.current.highlightedNodeIds.size).toBe(0);
  });

  it('should handle search in both name and description simultaneously', () => {
    const multiMatchNode = createMockNode(
      '11',
      'JavaScript Advanced',
      'Learn advanced JavaScript fundamentals'
    );
    const nodesWithMulti = [...mockNodes, multiMatchNode];
    const { result } = renderHook(() => useSkillSearch(nodesWithMulti));

    act(() => {
      result.current.setSearchTerm('JavaScript');
    });

    // Should find nodes that match in name OR description
    const expectedMatches = nodesWithMulti.filter(
      (node) =>
        node.data.name.toLowerCase().includes('javascript') ||
        node.data.description.toLowerCase().includes('javascript')
    );

    expect(result.current.filteredNodes).toHaveLength(expectedMatches.length);
  });
});
