import type { SkillNode, SkillEdge } from '../types/skill.types';
import { generateId } from './id.utils';

export const createDemoSkillTree = (): {
  nodes: SkillNode[];
  edges: SkillEdge[];
} => {
  // Generate stable IDs to ensure edges connect properly
  const nodeIds = {
    webFundamentals: generateId(),
    htmlBasics: generateId(),
    cssBasics: generateId(),
    jsBasics: generateId(),
    responsiveDesign: generateId(),
    accessibility: generateId(),
    jsIntermediate: generateId(),
    frontendFrameworks: generateId(),
  };

  // Define the spacing between nodes
  const verticalSpacing = 150;

  // Create nodes
  const nodes: SkillNode[] = [
    {
      id: nodeIds.webFundamentals,
      type: 'default',
      position: { x: 400, y: 0 }, // Root node centered at top
      data: {
        id: nodeIds.webFundamentals,
        name: 'Web Development Fundamentals',
        description: 'Core concepts of web development',
        isUnlocked: true,
        isCompleted: false,
      },
    },
    {
      id: nodeIds.htmlBasics,
      type: 'default',
      position: { x: 100, y: verticalSpacing + 150 },
      data: {
        id: nodeIds.htmlBasics,
        name: 'HTML Basics',
        description: 'Structure and semantic markup',
        isUnlocked: true,
        isCompleted: false,
      },
    },
    {
      id: nodeIds.cssBasics,
      type: 'default',
      position: { x: 400, y: verticalSpacing + 150 },
      data: {
        id: nodeIds.cssBasics,
        name: 'CSS Basics',
        description: 'Styling and layout fundamentals',
        isUnlocked: true,
        isCompleted: false,
      },
    },
    {
      id: nodeIds.jsBasics,
      type: 'default',
      position: { x: 700, y: verticalSpacing + 150 },
      data: {
        id: nodeIds.jsBasics,
        name: 'JavaScript Basics',
        description: 'Core language concepts and DOM manipulation',
        isUnlocked: true,
        isCompleted: false,
      },
    },
    {
      id: nodeIds.accessibility,
      type: 'default',
      position: { x: 100, y: 2 * verticalSpacing + 300 },
      data: {
        id: nodeIds.accessibility,
        name: 'Accessibility (A11y)',
        description: 'Creating inclusive web experiences',
        isUnlocked: false,
        isCompleted: false,
      },
    },
    {
      id: nodeIds.responsiveDesign,
      type: 'default',
      position: { x: 400, y: 2 * verticalSpacing + 300 },
      data: {
        id: nodeIds.responsiveDesign,
        name: 'Responsive Design',
        description: 'Making websites work on all screen sizes',
        isUnlocked: false,
        isCompleted: false,
      },
    },
    {
      id: nodeIds.jsIntermediate,
      type: 'default',
      position: { x: 700, y: 2 * verticalSpacing + 300 },
      data: {
        id: nodeIds.jsIntermediate,
        name: 'Intermediate JavaScript',
        description: 'Async, ES6+, and advanced patterns',
        isUnlocked: false,
        isCompleted: false,
      },
    },
    {
      id: nodeIds.frontendFrameworks,
      type: 'default',
      position: { x: 700, y: 3 * verticalSpacing + 400 },
      data: {
        id: nodeIds.frontendFrameworks,
        name: 'Frontend Frameworks',
        description: 'React, Vue, or Angular',
        isUnlocked: false,
        isCompleted: false,
      },
    },
  ];

  // Create edges (prerequisites)
  const edges: SkillEdge[] = [
    {
      id: generateId(),
      source: nodeIds.webFundamentals,
      target: nodeIds.htmlBasics,
      type: 'default',
    },
    {
      id: generateId(),
      source: nodeIds.webFundamentals,
      target: nodeIds.cssBasics,
      type: 'default',
    },
    {
      id: generateId(),
      source: nodeIds.webFundamentals,
      target: nodeIds.jsBasics,
      type: 'default',
    },
    {
      id: generateId(),
      source: nodeIds.htmlBasics,
      target: nodeIds.accessibility,
      type: 'default',
    },
    {
      id: generateId(),
      source: nodeIds.cssBasics,
      target: nodeIds.responsiveDesign,
      type: 'default',
    },
    {
      id: generateId(),
      source: nodeIds.jsBasics,
      target: nodeIds.jsIntermediate,
      type: 'default',
    },
    {
      id: generateId(),
      source: nodeIds.jsIntermediate,
      target: nodeIds.frontendFrameworks,
      type: 'default',
    },
  ];

  return { nodes, edges };
};
