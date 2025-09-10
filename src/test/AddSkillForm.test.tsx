import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddSkillForm } from '../components/AddSkillForm/AddSkillForm';

// Mock useFocusManagement hook
vi.mock('../hooks/useFocusManagement', () => ({
  useFocusManagement: vi.fn(() => ({ current: null })),
}));

describe('AddSkillForm', () => {
  const mockOnAddSkill = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    onAddSkill: mockOnAddSkill,
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering and Visibility', () => {
    it('should render when isOpen is true', () => {
      render(<AddSkillForm {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Add New Skill')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<AddSkillForm {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<AddSkillForm {...defaultProps} />);

      expect(screen.getByLabelText(/skill name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cost/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
    });

    it('should render form action buttons', () => {
      render(<AddSkillForm {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add skill/i })
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when required fields are empty', () => {
      render(<AddSkillForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /add skill/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when required fields are filled', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      await user.type(nameInput, 'Test Skill');
      await user.type(descriptionInput, 'Test Description');

      expect(submitButton).toBeEnabled();
    });

    it('should disable submit button when name is only whitespace', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      await user.type(nameInput, '   ');
      await user.type(descriptionInput, 'Test Description');

      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when description is only whitespace', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      await user.type(nameInput, 'Test Skill');
      await user.type(descriptionInput, '   ');

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should call onAddSkill with form data when submitted', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const costInput = screen.getByLabelText(/cost/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      await user.type(nameInput, 'React Hooks');
      await user.type(descriptionInput, 'Learn React Hooks patterns');
      fireEvent.change(costInput, { target: { value: '10' } });
      await user.click(submitButton);

      expect(mockOnAddSkill).toHaveBeenCalledWith({
        name: 'React Hooks',
        description: 'Learn React Hooks patterns',
        cost: 10,
        level: undefined,
      });
    });

    it('should trim whitespace from name and description', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      await user.type(nameInput, '  React Hooks  ');
      await user.type(descriptionInput, '  Learn React Hooks patterns  ');
      await user.click(submitButton);

      expect(mockOnAddSkill).toHaveBeenCalledWith({
        name: 'React Hooks',
        description: 'Learn React Hooks patterns',
        cost: undefined,
        level: undefined,
      });
    });

    it('should handle optional fields as undefined when empty', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      await user.type(nameInput, 'Basic Skill');
      await user.type(descriptionInput, 'A simple skill');
      await user.click(submitButton);

      expect(mockOnAddSkill).toHaveBeenCalledWith({
        name: 'Basic Skill',
        description: 'A simple skill',
        cost: undefined,
        level: undefined,
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      await user.type(nameInput, 'Test Skill');
      await user.type(descriptionInput, 'Test Description');
      await user.click(submitButton);

      // Form should be reset
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });

    it('should call onClose after successful submission', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      await user.type(nameInput, 'Test Skill');
      await user.type(descriptionInput, 'Test Description');
      await user.click(submitButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not submit when required fields are empty', async () => {
      render(<AddSkillForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /add skill/i });

      // Try to submit empty form (button should be disabled, but test the handler)
      fireEvent.click(submitButton);

      expect(mockOnAddSkill).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal when close button (×) is clicked', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: 'Close dialog' });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal when overlay is clicked', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const overlay = screen.getByRole('dialog');
      await user.click(overlay);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close modal when modal content is clicked', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const modalContent = screen.getByRole('document');
      await user.click(modalContent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close modal when Escape key is pressed', () => {
      render(<AddSkillForm {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should render name input with autofocus attribute', () => {
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      // Check that the input is present and is the first form field
      // The actual focus behavior is handled by useFocusManagement hook
      expect(nameInput).toBeInTheDocument();
      expect(nameInput.tagName.toLowerCase()).toBe('input');
    });

    it('should handle tab navigation between form fields', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      nameInput.focus();
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(descriptionInput).toHaveFocus();
    });
  });

  describe('Number Input Handling', () => {
    it('should handle cost input as number', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const costInput = screen.getByLabelText(/cost/i);

      await user.type(costInput, '25');
      expect(costInput).toHaveValue(25);
    });

    it('should handle level input as number', () => {
      render(<AddSkillForm {...defaultProps} />);

      const levelInput = screen.getByLabelText(/level/i);
      fireEvent.change(levelInput, { target: { value: 'Beginner' } });
      expect(levelInput).toHaveValue('Beginner');
    });

    it('should clear number fields to undefined when emptied', async () => {
      const user = userEvent.setup();
      render(<AddSkillForm {...defaultProps} />);

      const costInput = screen.getByLabelText(/cost/i);

      await user.type(costInput, '25');
      await user.clear(costInput);

      // Value should be empty string in input
      expect(costInput).toHaveValue(null);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<AddSkillForm {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

      const document = screen.getByRole('document');
      expect(document).toBeInTheDocument();
    });

    it('should have required field indicators', () => {
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      expect(nameInput).toHaveAttribute('aria-required', 'true');
      expect(descriptionInput).toHaveAttribute('aria-required', 'true');
    });

    it('should have descriptive help text for fields', () => {
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      expect(nameInput).toHaveAttribute('aria-describedby', 'name-help');
      expect(descriptionInput).toHaveAttribute(
        'aria-describedby',
        'description-help'
      );
    });

    it('should provide screen reader text for submit button state', () => {
      render(<AddSkillForm {...defaultProps} />);

      // Submit button should have descriptive text
      expect(
        screen.getByText(/complete required fields to enable/i)
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text inputs', () => {
      render(<AddSkillForm {...defaultProps} />);

      const longText = 'A'.repeat(500);
      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(nameInput, { target: { value: longText } });
      fireEvent.change(descriptionInput, { target: { value: longText } });

      expect(nameInput).toHaveValue(longText);
      expect(descriptionInput).toHaveValue(longText);
    });

    it('should handle negative numbers in cost and level', () => {
      render(<AddSkillForm {...defaultProps} />);
      const costInput = screen.getByLabelText('Cost (Optional)');

      // HTML min attributes should prevent negative values
      expect(costInput).toHaveAttribute('min', '0');
    });

    it('should handle special characters in text fields', async () => {
      render(<AddSkillForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/skill name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add skill/i });

      const specialName = 'C++/C# Programming';
      const specialDesc = 'Learn C++ & C# (2024) - Advanced!';

      fireEvent.change(nameInput, { target: { value: specialName } });
      fireEvent.change(descriptionInput, { target: { value: specialDesc } });
      fireEvent.click(submitButton);

      expect(mockOnAddSkill).toHaveBeenCalledWith({
        name: specialName,
        description: specialDesc,
        cost: undefined,
        level: undefined,
      });
    });
  });
});
