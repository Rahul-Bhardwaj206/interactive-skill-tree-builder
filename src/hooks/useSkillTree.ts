import { useCallback, useEffect, useState } from 'react';
import type {
  AddSkillFormData,
  SkillEdge,
  SkillNode,
} from '../types/skill.types';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import {
  loadSkillTreeFromStorage,
  saveSkillTreeToStorage,
} from '../utils/storage.utils';
import {
  updateSkillUnlockStatus,
  wouldCreateCycle,
} from '../utils/skillTree.utils';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const INITIAL_NODES: SkillNode[] = [];
const INITIAL_EDGES: SkillEdge[] = [];

export const useSkillTree = () => {
  const [nodes, setNodes] = useState<SkillNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<SkillEdge[]>(INITIAL_EDGES);
  const [isLoaded, setIsLoaded] = useState(false);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as SkillNode[]),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((nds) => applyEdgeChanges(changes, nds) as SkillEdge[]),
    []
  );

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = loadSkillTreeFromStorage();
    if (savedState) {
      const updatedNodes = updateSkillUnlockStatus(
        savedState.nodes,
        savedState.edges
      );

      setNodes(updatedNodes);
      setEdges(savedState.edges);
    }
    setIsLoaded(true);
  }, [setNodes, setEdges]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) saveSkillTreeToStorage({ nodes, edges });
  }, [nodes, edges, isLoaded]);

  // Add a new skill node
  const addSkill = useCallback(
    (skillData: AddSkillFormData) => {
      const newNode: SkillNode = {
        id: uuidv4(),
        type: 'default',
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 400 + 200,
        },
        data: {
          id: uuidv4(),
          name: skillData.name,
          description: skillData.description,
          cost: skillData.cost,
          level: skillData.level,
          isUnlocked: true, // New skills start unlocked if no prerequisites
          isCompleted: false,
        },
      };

      setNodes((prevNodes) => {
        const updatedNodes = [...prevNodes, newNode];
        return updateSkillUnlockStatus(updatedNodes, edges);
      });

      toast.success(`Added skill: ${skillData.name}`);
    },
    [setNodes, edges]
  );

  // Toggle skill completion status
  const toggleSkillCompletion = useCallback(
    (skillId: string) => {
      setNodes((prevNodes) => {
        let updatedNodes = prevNodes.map((node) => {
          if (node.id === skillId) {
            const canComplete = node.data.isUnlocked;
            if (!canComplete && !node.data.isCompleted) {
              toast.error('Complete prerequisites first!');
              return node;
            }

            const newCompletionStatus = !node.data.isCompleted;
            toast.success(
              `${node.data.name} ${newCompletionStatus ? 'completed' : 'uncompleted'}!`
            );

            return {
              ...node,
              data: {
                ...node.data,
                isCompleted: newCompletionStatus,
              },
            };
          }
          return node;
        });

        // If a skill was marked incomplete, also mark dependent skills incomplete
        const toggleNode = updatedNodes.find((node) => node.id === skillId);
        if (toggleNode && !toggleNode.data.isCompleted) {
          const dependentSkillIds = edges
            .filter((edge) => edge.source === skillId)
            .map((edge) => edge.target);
          if (dependentSkillIds.length > 0) {
            updatedNodes = updatedNodes.map((node) => {
              if (
                dependentSkillIds.includes(node.id) &&
                node.data.isCompleted
              ) {
                toast(
                  `${node.data.name} has been reset because a prerequisite was marked as incomplete.`
                );
                return {
                  ...node,
                  data: {
                    ...node.data,
                    isCompleted: false,
                  },
                };
              }
              return node;
            });
          }
        }

        // Update unlock status for all nodes
        return updateSkillUnlockStatus(updatedNodes, edges);
      });
    },
    [setNodes, edges]
  );

  // Handle new connections (prerequisites)
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      if (!params.source || !params.target) return;

      // Check if this would create a cycle
      if (wouldCreateCycle(nodes, edges, params)) {
        toast.error(
          'Cannot create connection: This would create a circular dependency!'
        );
        return;
      }

      const newEdge = {
        ...params,
        id: uuidv4(),
        type: 'default',
      } as SkillEdge;

      setEdges((prevEdges) => addEdge(newEdge, prevEdges));

      // Update unlock status for all nodes
      setNodes((prevNodes) => {
        const updatedNodes = updateSkillUnlockStatus(prevNodes, [
          ...edges,
          newEdge,
        ]);
        return updatedNodes;
      });

      toast.success('Prerequisite connection added!');
    },
    [nodes, edges, setEdges, setNodes]
  );

  // Delete a skill node
  const deleteSkill = useCallback(
    (skillId: string) => {
      // Check if this skill is a prerequisite for other skills
      const dependentEdges = edges.filter((edge) => edge.source === skillId);
      const nodeToDelete = nodes.find((node) => node.id === skillId);

      if (dependentEdges.length > 0) {
        const dependentSkills = dependentEdges
          .map((edge) => {
            const dependentNode = nodes.find((node) => node.id === edge.target);
            return dependentNode?.data.name;
          })
          .filter(Boolean);

        const skillNames = dependentSkills.join(', ');
        toast.error(
          `Cannot delete "${nodeToDelete?.data.name}". It's a prerequisite for: ${skillNames}`
        );
        return;
      }

      setNodes((prevNodes) => {
        if (nodeToDelete) {
          toast.success(`Deleted skill: ${nodeToDelete.data.name}`);
        }
        const updatedNodes = prevNodes.filter((node) => node.id !== skillId);

        // Update unlock status after deletion
        const remainingEdges = edges.filter(
          (edge) => edge.source !== skillId && edge.target !== skillId
        );
        return updateSkillUnlockStatus(updatedNodes, remainingEdges);
      });

      // Remove edges connected to this node
      setEdges((prevEdges) =>
        prevEdges.filter(
          (edge) => edge.source !== skillId && edge.target !== skillId
        )
      );
    },
    [setNodes, setEdges, nodes, edges]
  );

  // Clear all data
  const clearSkillTree = useCallback(() => {
    setNodes([]);
    setEdges([]);
    toast.success('Skill tree cleared!');
  }, [setNodes, setEdges]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addSkill,
    toggleSkillCompletion,
    deleteSkill,
    clearSkillTree,
    isLoaded,
  };
};
