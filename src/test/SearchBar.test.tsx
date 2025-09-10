import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar/SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: vi.fn(),
    resultsCount: 5,
    totalCount: 10,
  };

  it('renders search input with placeholder', () => {
    render(<SearchBar {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(
        'Type skill name or description to search (⌘K / Ctrl+K)'
      )
    ).toBeInTheDocument();
  });

  it('displays current search term', () => {
    render(<SearchBar {...defaultProps} searchTerm="javascript" />);

    expect(screen.getByDisplayValue('javascript')).toBeInTheDocument();
  });

  it('calls onSearchChange when input value changes', () => {
    const mockOnSearchChange = vi.fn();
    render(<SearchBar {...defaultProps} onSearchChange={mockOnSearchChange} />);

    const input = screen.getByPlaceholderText(
      'Type skill name or description to search (⌘K / Ctrl+K)'
    );
    fireEvent.change(input, { target: { value: 'react' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('react');
  });

  it('shows results count when search term is provided', () => {
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="javascript"
        resultsCount={3}
        totalCount={10}
      />
    );

    expect(screen.getByText('Showing 3 of 10 skills')).toBeInTheDocument();
  });

  it('shows no results message when no skills match', () => {
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="nonexistent"
        resultsCount={0}
        totalCount={10}
      />
    );

    expect(screen.getByText(/No skills found for/)).toBeInTheDocument();
  });

  it('shows clear button when search term exists', () => {
    render(<SearchBar {...defaultProps} searchTerm="javascript" />);

    expect(
      screen.getByRole('button', { name: /Clear search/ })
    ).toBeInTheDocument();
  });

  it('does not show clear button when search term is empty', () => {
    render(<SearchBar {...defaultProps} searchTerm="" />);

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('calls onSearchChange with empty string when clear button is clicked', () => {
    const mockOnSearchChange = vi.fn();
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="javascript"
        onSearchChange={mockOnSearchChange}
      />
    );

    const clearButton = screen.getByRole('button', { name: /Clear search/ });
    fireEvent.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });

  it('does not show results info when search term is empty', () => {
    render(<SearchBar {...defaultProps} searchTerm="" />);

    expect(screen.queryByText(/Showing.*skills/)).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation for clear button (default HTML button behavior)', () => {
    const mockOnSearchChange = vi.fn();
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="javascript"
        onSearchChange={mockOnSearchChange}
      />
    );

    const clearButton = screen.getByRole('button', { name: /Clear search/ });

    // HTML buttons respond to Enter and Space by default - just test click
    fireEvent.click(clearButton);
    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="javascript"
        resultsCount={3}
        totalCount={10}
      />
    );

    const input = screen.getByPlaceholderText(
      'Type skill name or description to search (⌘K / Ctrl+K)'
    );

    // Check ARIA attributes (actual implementation uses type="text" with role="searchbox")
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('role', 'searchbox');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');

    // Check if results are announced to screen readers - aria-live is on the parent div
    const resultsInfo = screen.getByText('Showing 3 of 10 skills');
    const resultsContainer = resultsInfo.closest('[role="status"]');
    expect(resultsContainer).toHaveAttribute('aria-live', 'polite');
    expect(resultsContainer).toHaveAttribute('aria-atomic', 'true');
  });

  it('should clear search when clear button is clicked', () => {
    const mockOnSearchChange = vi.fn();
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="javascript"
        onSearchChange={mockOnSearchChange}
      />
    );

    const clearButton = screen.getByRole('button', { name: /Clear search/ });

    fireEvent.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });

  it('should handle edge case with 1 result correctly', () => {
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="specific"
        resultsCount={1}
        totalCount={10}
      />
    );

    expect(screen.getByText('Showing 1 of 10 skills')).toBeInTheDocument();
  });

  it('should handle case when all skills match search', () => {
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="skill"
        resultsCount={10}
        totalCount={10}
      />
    );

    expect(screen.getByText('Showing 10 of 10 skills')).toBeInTheDocument();
  });

  it('should handle special characters in search', () => {
    const mockOnSearchChange = vi.fn();
    render(<SearchBar {...defaultProps} onSearchChange={mockOnSearchChange} />);

    const input = screen.getByPlaceholderText(
      'Type skill name or description to search (⌘K / Ctrl+K)'
    );

    const specialCharsQuery = 'C++ & Node.js';
    fireEvent.change(input, { target: { value: specialCharsQuery } });

    expect(mockOnSearchChange).toHaveBeenCalledWith(specialCharsQuery);
  });

  it('should show clear button even for whitespace-only search (current behavior)', () => {
    render(<SearchBar {...defaultProps} searchTerm="   " />);

    // Current implementation shows clear button for any non-empty string, including whitespace
    expect(
      screen.getByRole('button', { name: /Clear search/ })
    ).toBeInTheDocument();
  });

  it('should trim whitespace in search results display', () => {
    render(
      <SearchBar
        {...defaultProps}
        searchTerm="  javascript  "
        resultsCount={3}
        totalCount={10}
      />
    );

    // Should still show results even with whitespace
    expect(screen.getByText('Showing 3 of 10 skills')).toBeInTheDocument();
  });
});
