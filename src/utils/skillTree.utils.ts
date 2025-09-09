import type { SkillEdge, SkillNode } from '../types/skill.types';

/**
 * Detects if adding a new edge would create a cycle in the graph
 * Uses  DFS to check for cycles
 */
export const wouldCreateCycle = (
  nodes: SkillNode[],
  edges: SkillEdge[],
  newEdge: { source: string; target: string }
): boolean => {
  // Create adjacency list including the new edge
  const adjacencyList = new Map<string, string[]>();

  // Initialize adjacency list
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  // Add existing edges
  edges.forEach((edge) => {
    const targets = adjacencyList.get(edge.source) || [];
    targets.push(edge.target);
    adjacencyList.set(edge.source, targets);
  });

  // Add new edge
  const newTargets = adjacencyList.get(newEdge.source) || [];
  newTargets.push(newEdge.target);
  adjacencyList.set(newEdge.source, newTargets);

  // Check for cycles using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) {
      return true; // Found a cycle
    }

    if (visited.has(nodeId)) {
      return false; // Already proceed this node
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) {
        return true;
      }
    }
    recursionStack.delete(nodeId);
    return false;
  };

  //Check for cycles starting from any node
  for (const nodeId of adjacencyList.keys()) {
    if (!visited.has(nodeId)) {
      if (hasCycle(nodeId)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Check if skill can be unlocked based on its prerequisites
 */
export const canUnlockSkill = (
  skillId: string,
  nodes: SkillNode[],
  edges: SkillEdge[]
): boolean => {
  // Find all prerequisite skills (edges pointing to this skill)
  const prerequisites = edges.filter((edge) => edge.target === skillId);

  // If no prerequisite, skill can be unlocked
  if (prerequisites.length === 0) {
    return true;
  }

  // Check if all prerequisite skills are completed
  return prerequisites.every((edge) => {
    const prerequisiteNode = nodes.find((node) => node.id === edge.source);
    return prerequisiteNode?.data.isCompleted === true;
  });
};

/**
 * Updates the unlock status of all skills based on their prerequisites
 */
export const updateSkillUnlockStatus = (
  nodes: SkillNode[],
  edges: SkillEdge[]
): SkillNode[] => {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      isUnlocked: canUnlockSkill(node.id, nodes, edges),
    },
  }));
};
