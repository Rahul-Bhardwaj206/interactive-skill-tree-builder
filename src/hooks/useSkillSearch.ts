import { useMemo, useState } from 'react';
import type { SkillNode } from '../types/skill.types';

export const useSkillSearch = (nodes: SkillNode[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) {
      return nodes;
    }

    const term = searchTerm.toLowerCase();
    return nodes.filter(
      (node) =>
        node.data.name.toLowerCase().includes(term) ||
        node.data.description.toLowerCase().includes(term)
    );
  }, [nodes, searchTerm]);

  const highlightedNodeIds = useMemo(() => {
    if (!searchTerm.trim()) {
      return new Set<string>();
    }
    return new Set(filteredNodes.map((node) => node.id));
  }, [filteredNodes, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredNodes,
    highlightedNodeIds,
    hasActiveSearch: searchTerm.trim().length > 0,
  };
};
