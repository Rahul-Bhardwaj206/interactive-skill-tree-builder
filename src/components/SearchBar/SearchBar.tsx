import React from 'react';
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
  const handleClear = () => {
    onSearchChange('');
  };

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
          id={searchId}
          type="text"
          placeholder="Search skills by name or description..."
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
