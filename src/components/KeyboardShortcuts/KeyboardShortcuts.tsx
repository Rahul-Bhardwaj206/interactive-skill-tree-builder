import React, { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onAddSkill: () => void;
  onClearAll: () => void;
  skillCount: number;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onAddSkill,
  onClearAll,
  skillCount,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when not in an input/textarea/modal
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        document.querySelector('[role="dialog"]')
      ) {
        return;
      }

      // Cmd/Ctrl + N: Add new skill
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        onAddSkill();
      }

      // Cmd/Ctrl + Shift + Delete: Clear all (if skills exist)
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key === 'Delete' &&
        skillCount > 0
      ) {
        e.preventDefault();
        onClearAll();
      }

      // Show help with '?'
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        showKeyboardHelp();
      }
    };

    const showKeyboardHelp = () => {
      const helpText = [
        'Keyboard Shortcuts:',
        '• Cmd/Ctrl + N: Add new skill',
        '• Cmd/Ctrl + Shift + Delete: Clear all skills',
        '• Tab: Navigate between elements',
        '• Enter/Space: Activate buttons',
        '• Escape: Close dialogs',
        '• ?: Show this help',
      ].join('\n');

      alert(helpText);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAddSkill, onClearAll, skillCount]);

  return null; // This component doesn't render anything
};
