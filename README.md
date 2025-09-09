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

## Usage

### Creating Skills

1. Click the "Add Skill" button to open the form
2. Fill in the required fields:
   - Name: The skill title
   - Description: Detailed information about the skill
   - Level (Optional): Choose from Beginner, Intermediate, or Advanced
   - Cost (Optional): Point cost to acquire the skill

### Managing the Skill Tree

- **Arrange Skills**: Drag nodes to position them
- **Create Prerequisites**: Drag from one node's bottom handle to another node's top handle
- **Complete Skills**: Click "Complete Skill" on unlocked skills
- **Remove Skills**: Click the "X" button on any skill node
- **Navigate**:
  - Use mouse wheel or Controls panel to zoom
  - Drag empty space to pan
  - Use Minimap for quick navigation
  - Initial view is zoomed out for better overview

### Searching Skills

1. Use the search bar to filter skills
2. Search works across skill names and descriptions
3. Matching skills will be highlighted
4. Clear search using the "X" button

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
