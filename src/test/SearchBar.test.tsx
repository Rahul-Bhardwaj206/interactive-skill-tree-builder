import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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
      screen.getByPlaceholderText('Search skills by name or description...')
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
      'Search skills by name or description...'
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
});
