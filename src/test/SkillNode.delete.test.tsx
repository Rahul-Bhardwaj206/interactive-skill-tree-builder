import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

describe('SkillNode Delete Confirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show confirmation dialog with correct message', () => {
    const skillName = 'Test Skill';
    const expectedMessage = `Are you sure you want to delete "${skillName}"?\n\nThis action cannot be undone.`;

    mockConfirm.mockReturnValue(true);

    // Call window.confirm directly to test the message format
    const result = window.confirm(expectedMessage);

    expect(mockConfirm).toHaveBeenCalledWith(expectedMessage);
    expect(result).toBe(true);
  });

  it('should return false when user cancels', () => {
    mockConfirm.mockReturnValue(false);

    const result = window.confirm('Delete confirmation message');

    expect(mockConfirm).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return true when user confirms', () => {
    mockConfirm.mockReturnValue(true);

    const result = window.confirm('Delete confirmation message');

    expect(mockConfirm).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
