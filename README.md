# Interactive Skill Tree Builder

A React-based interactive skill tree builder that allows users to create, manage, and visualize skill progression trees. Built with TypeScript, Vite, and @xyflow/react for fluid, interactive node-based visualizations.

## Features

- 🌳 Interactive Skill Tree Canvas
  - Drag & drop interface for skill arrangement
  - Zoom and pan controls
  - Minimap for easy navigation
  - Custom zoom levels for better overview
  - Automatic layout with node fitting

- 🔄 Skill Management
  - Add new skills with name, description, and level
  - Set skill prerequisites through node connections
  - Mark skills as completed or incomplete
  - Delete skills with proper cleanup
  - Three-tier skill levels (Beginner, Intermediate, Advanced)

- 🔍 Search and Filter
  - Search skills by name and description
  - Real-time filtering
  - Highlighted search results
  - Clear search functionality

- ♿ Accessibility Features
  - Keyboard navigation support
  - ARIA labels and descriptions
  - Screen reader friendly
  - Skip links for navigation
  - Focus management+ TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/interactive-skill-tree-builder.git
cd interactive-skill-tree-builder
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

4. Run tests

```bash
  # Run tests once
  npm run test
```

5. Build the application

```bash
  npm run build
```

## Usage Guide

### Adding Skills

1. Click the "Add Skill" button in the toolbar
2. Fill in the skill name and description (required)
3. Optionally add cost and level values
4. Click "Add Skill" to create the node

### Creating Prerequisites

1. Drag from the bottom handle (circle) of a prerequisite skill
2. Drop onto the top handle of the target skill
3. The system will prevent circular dependencies and show feedback

### Completing Skills

1. Skills with no prerequisites start as "Available"
2. Click the "Complete Skill" button on available skills
3. Dependent skills become available as their prerequisites are completed

### Search and Navigation

1. Use the search bar to find skills by name or description
2. Matching skills are highlighted in orange
3. Use the minimap and controls for easier navigation

## Project Structure

```
src/
├── components/          # React components
│   ├── AddSkillForm/   # Modal form for adding skills
│   ├── SearchBar/      # Search functionality
│   ├── SkillNode/      # Custom node component
│   ├── SkillTreeCanvas/# Main canvas with React Flow
│   └── Toolbar/        # App header and controls
├── hooks/              # Custom React hooks
│   ├── useSkillSearch.ts  # Search functionality
│   └── useSkillTree.ts    # Main state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── skillTree.utils.ts # Graph logic and validation
│   └── storage.utils.ts   # localStorage operations
└── test/               # Unit tests
```

## Architecture Decisions

### State Management

- Uses React hooks (useState, useEffect) for simple state management
- Custom hooks encapsulate complex logic and provide clean APIs
- localStorage integration for automatic persistence

### Graph Visualization

- React Flow provides robust node/edge management
- Custom node components for skill-specific UI
- Built-in pan, zoom, and minimap functionality

### Cycle Detection

- Depth-First Search (DFS) algorithm to detect circular dependencies
- Prevents invalid connections with user feedback
- Maintains graph integrity

### Type Safety

- Comprehensive TypeScript types for all data structures
- Strict type checking enabled
- Proper interfaces for component props

## Testing Strategy

- _Unit Tests_: Core utility functions and hooks
- _Component Tests_: UI behavior and user interactions
- _Integration Tests_: End-to-end workflows
- _Coverage_: Key business logic and user paths

## Completed Bonuses

1. _Cycle Prevention_: Implemented with DFS algorithm and user feedback
2. _Search and Filter_: Real-time search with node highlighting

## AI Tool Usage Disclosure

This project was developed with assistance from GitHub Copilot, which helped with:

- Code structure and TypeScript types
- Testing setup and test cases
- CSS styling and responsive design

The core logic, architecture decisions, and feature implementation were designed and reviewed by the developer.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Efficient graph algorithms with O(V+E) complexity
- Memoized search results to prevent unnecessary re-renders
- LocalStorage operations are debounced for better performance
- React Flow handles large graphs efficiently with built-in virtualization

## Accessibility

This project includes several accessibility features to ensure the skill tree is usable by everyone:

- Keyboard navigation support throughout the application
- ARIA attributes for screen reader compatibility
- Focus management for interactive elements
- High contrast mode support
- Screen reader announcements for dynamic content changes

For detailed information about accessibility features, implementation details, and testing protocols, please see the [Accessibility Documentation](./ACCESSIBILITY.md).

```

```
