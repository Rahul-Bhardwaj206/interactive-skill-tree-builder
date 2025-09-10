import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactFlowProvider } from '@xyflow/react';
import { SkillNode } from '../components/SkillNode/SkillNode';
import type { SkillData } from '../types/skill.types';

describe('SkillNode Keyboard Interactions', () => {
  const mockOnDelete = vi.fn();
  const mockOnToggleCompletion = vi.fn();

  const mockSkillData: SkillData = {
    id: 'test-skill',
    name: 'Test Skill',
    description: 'A test skill for keyboard interaction testing',
    isCompleted: false,
    isUnlocked: true,
  };

  const mockNodeProps = {
    type: 'skill',
    dragging: false,
    zIndex: 1,
    selectable: true,
    selected: false,
    deletable: true,
    draggable: true,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    width: 200,
    height: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to wrap components with React Flow provider
  const renderWithReactFlow = (component: React.ReactElement) => {
    return render(<ReactFlowProvider>{component}</ReactFlowProvider>);
  };

  it('should delete skill when Enter key is pressed on delete button', async () => {
    const user = userEvent.setup();

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={mockSkillData}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
        {...mockNodeProps}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete skill: test skill/i,
    });

    // Focus the delete button and press Enter
    deleteButton.focus();
    await user.keyboard('{Enter}');

    expect(mockOnDelete).toHaveBeenCalledWith('test-skill');
  });

  it('should delete skill when Space key is pressed on delete button', async () => {
    const user = userEvent.setup();

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={mockSkillData}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
        {...mockNodeProps}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete skill: test skill/i,
    });

    // Focus the delete button and press Space
    deleteButton.focus();
    await user.keyboard(' ');

    expect(mockOnDelete).toHaveBeenCalledWith('test-skill');
  });

  it('should toggle completion when Enter key is pressed on toggle button', async () => {
    const user = userEvent.setup();

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={mockSkillData}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
        {...mockNodeProps}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /complete skill/i,
    });

    // Focus the toggle button and press Enter
    toggleButton.focus();
    await user.keyboard('{Enter}');

    expect(mockOnToggleCompletion).toHaveBeenCalledWith('test-skill');
  });

  it('should toggle completion when Space key is pressed on toggle button', async () => {
    const user = userEvent.setup();

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={mockSkillData}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
        {...mockNodeProps}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /complete skill/i,
    });

    // Focus the toggle button and press Space
    toggleButton.focus();
    await user.keyboard(' ');

    expect(mockOnToggleCompletion).toHaveBeenCalledWith('test-skill');
  });

  it('should not respond to other keys on delete button', async () => {
    const user = userEvent.setup();

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={mockSkillData}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
        {...mockNodeProps}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete skill: test skill/i,
    });

    // Focus the delete button and press other keys
    deleteButton.focus();
    await user.keyboard('{Escape}');
    await user.keyboard('a');
    await user.keyboard('{Tab}');

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should navigate between buttons using Tab key', async () => {
    const user = userEvent.setup();

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={mockSkillData}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
        {...mockNodeProps}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete skill: test skill/i,
    });
    const toggleButton = screen.getByRole('button', {
      name: /complete skill/i,
    });

    // Start by focusing the first button
    deleteButton.focus();
    expect(deleteButton).toHaveFocus();

    // Tab to the next button
    await user.keyboard('{Tab}');
    expect(toggleButton).toHaveFocus();
  });

  it('should not allow interaction with disabled toggle button', async () => {
    const user = userEvent.setup();

    const lockedSkillData: SkillData = {
      ...mockSkillData,
      isUnlocked: false,
      isCompleted: false,
    };

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={lockedSkillData}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
        {...mockNodeProps}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /complete skill/i,
    });

    expect(toggleButton).toBeDisabled();

    // Try to interact with disabled button
    toggleButton.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(mockOnToggleCompletion).not.toHaveBeenCalled();
  });

  it('should handle completed skill state correctly', async () => {
    const user = userEvent.setup();

    const completedSkillData: SkillData = {
      ...mockSkillData,
      isCompleted: true,
      isUnlocked: true,
    };

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={completedSkillData}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
        {...mockNodeProps}
      />
    );

    const toggleButton = screen.getByRole('button', {
      name: /mark incomplete/i,
    });

    // Should work with completed skills
    toggleButton.focus();
    await user.keyboard('{Enter}');

    expect(mockOnToggleCompletion).toHaveBeenCalledWith('test-skill');
  });

  it('should prevent event propagation on delete button click', async () => {
    const user = userEvent.setup();
    const mockContainerClick = vi.fn();

    renderWithReactFlow(
      <div onClick={mockContainerClick}>
        <SkillNode
          id="test-skill"
          data={mockSkillData}
          onDelete={mockOnDelete}
          onToggleCompletion={mockOnToggleCompletion}
          {...mockNodeProps}
        />
      </div>
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete skill: test skill/i,
    });

    // Click the delete button
    deleteButton.focus();
    await user.keyboard('{Enter}');

    expect(mockOnDelete).toHaveBeenCalledWith('test-skill');
    // Container click should not be triggered due to stopPropagation
    expect(mockContainerClick).not.toHaveBeenCalled();
  });

  it('should handle keyboard events when handlers are not provided', async () => {
    const user = userEvent.setup();

    renderWithReactFlow(
      <SkillNode
        id="test-skill"
        data={mockSkillData}
        // Not providing onDelete and onToggleCompletion handlers
        {...mockNodeProps}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: /delete skill: test skill/i,
    });
    const toggleButton = screen.getByRole('button', {
      name: /complete skill/i,
    });

    // Should not throw errors when handlers are not provided
    deleteButton.focus();
    await user.keyboard('{Enter}');

    toggleButton.focus();
    await user.keyboard('{Enter}');

    // No assertions needed - just ensuring no errors are thrown
  });
});
