import React, { useEffect, useRef } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  id?: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  resultsCount: number;
  totalCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  id,
  searchTerm,
  onSearchChange,
  resultsCount,
  totalCount,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onSearchChange('');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchId = 'skill-search-input';
  const resultsId = 'search-results-info';

  return (
    <div id={id} className="search-bar" role="search">
      <label htmlFor={searchId} className="sr-only">
        Search skills
      </label>
      <div className="search-input-wrapper">
        <div className="search-icon" aria-hidden="true">
          🔎
        </div>
        <input
          ref={searchInputRef}
          id={searchId}
          type="text"
          placeholder="Type skill name or description to search (⌘K / Ctrl+K)"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          aria-describedby={searchTerm ? resultsId : undefined}
          aria-expanded={searchTerm ? 'true' : 'false'}
          aria-haspopup="listbox"
          role="searchbox"
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear"
            aria-label={`Clear search term: ${searchTerm}`}
            title="Clear search"
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>

      {searchTerm && (
        <div
          id={resultsId}
          className="search-results-info"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {resultsCount === 0 ? (
            <span className="no-results">
              No skills found for "{searchTerm}"
            </span>
          ) : (
            <span className="results-count">
              Showing {resultsCount} of {totalCount} skills
            </span>
          )}
        </div>
      )}
    </div>
  );
};
