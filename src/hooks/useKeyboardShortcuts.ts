import { useEffect } from 'react';

interface UseKeyboardShortcutsProp {
  onAddSkill: () => void;
  onClearAll: () => void;
  onCloseModal?: () => void;
  skillCount: number;
}

export const useKeyboardShortcuts = ({
  onAddSkill,
  onClearAll,
  onCloseModal,
  skillCount,
}: UseKeyboardShortcutsProp) => {
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
      // Alt + N: Add new skill (avoid conflict with browser/new tab shortcuts)
      if (e.altKey && e.key === 'n' && !e.ctrlKey && !e.metaKey) {
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

      // Escape: Close modals or forms (if any are open)
      if (e.key === 'Escape' && onCloseModal) {
        e.preventDefault();
        onCloseModal();
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
        '• Escape: Close dialogs or modals',
        '• ?: Show this help',
      ].join('\n');
      alert(helpText);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onAddSkill, onClearAll, onCloseModal, skillCount]);
};
