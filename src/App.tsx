import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import '@xyflow/react/dist/style.css';

import { useSkillTree } from './hooks/useSkillTree';
import { useSkillSearch } from './hooks/useSkillSearch';
import { SkipLinks } from './components/SkipLinks/SkipLinks';
import { Toolbar } from './components/Toolbar/Toolbar';
import { SearchBar } from './components/SearchBar/SearchBar';
import { AddSkillForm } from './components/AddSkillForm/AddSkillForm';
import { SkillTreeCanvas } from './components/SkillTreeCanvas/SkillTreeCanvas';
import './App.css';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [isAddSkillFormOpen, setIsAddSkillFormOpen] = useState(false);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addSkill,
    toggleSkillCompletion,
    deleteSkill,
    clearSkillTree,
    loadSampleSkillTree,
    isLoaded,
  } = useSkillTree();

  const { searchTerm, setSearchTerm, filteredNodes, highlightedNodeIds } =
    useSkillSearch(nodes);

  useKeyboardShortcuts({
    onAddSkill: () => setIsAddSkillFormOpen(true),
    onClearAll: () => {
      if (
        window.confirm(
          'Are you sure you want to clear all skills? This action cannot be undone.'
        )
      ) {
        clearSkillTree();
      }
    },
    skillCount: nodes.length,
  });

  const handleCloseAddSkillForm = () => {
    setIsAddSkillFormOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="app-loading" role="main" aria-live="polite">
        <div className="loading-spinner" aria-label="Loading application">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <SkipLinks />

      <div className="app-container">
        <Toolbar
          id="main-toolbar"
          onAddSkill={() => setIsAddSkillFormOpen(true)}
          onClearAll={() => {
            if (
              window.confirm(
                'Are you sure you want to clear all skills? This action cannot be undone.'
              )
            ) {
              clearSkillTree();
            }
          }}
          onLoadSample={loadSampleSkillTree}
          skillCount={nodes.length}
        />

        <SearchBar
          id="skill-search"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultsCount={filteredNodes.length}
          totalCount={nodes.length}
        />

        <SkillTreeCanvas
          id="main-content"
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onToggleCompletion={toggleSkillCompletion}
          onDeleteSkill={deleteSkill}
          highlightedNodeIds={highlightedNodeIds}
        />
      </div>

      <AddSkillForm
        isOpen={isAddSkillFormOpen}
        onClose={handleCloseAddSkillForm}
        onAddSkill={addSkill}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}

export default App;
