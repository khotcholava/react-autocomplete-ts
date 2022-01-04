import React from 'react';
import './Autocomplete.css';
import { AiOutlineDown } from 'react-icons/ai';
import { AutocompleteProps } from './Autocomplete.types';
import { SuggestedItem } from '../SuggestedItem/SuggestedItem';
import { useAutocomplete } from '../../hooks/useAutocomplete';

export const Autocomplete = <T extends unknown>(
  {
    options,
    onSearchChange,
    value,
    onChange,
    bindKey,
    placeholder = 'Search',
  }: AutocompleteProps<T>,
) => {
  const {
    searchText,
    filteredOptions,
    inputRef,
    containerRef,
    activeIndex,
    show,
    selectedOption,
    handleChange,
    handleKeyDown,
    handleOptionClick,
    handleShowSuggestions,
  } = useAutocomplete({
    options,
    onChange,
    value,
    bindKey,
    onSearchChange,
  });
  const suggestionContainerClassName = `suggestions-container ${show ? 'animate-suggestions' : ''}`;
  return (
    <div className="autocomplete-container">
      <div className="input-group">
        <input
          type="text"
          placeholder={placeholder}
          value={selectedOption?.label ?? searchText}
          ref={inputRef}
          onClick={handleShowSuggestions}
          onKeyDown={e => handleKeyDown(e)}
          onChange={handleChange}/>
        <AiOutlineDown className={`icon ${show ? 'rotate-icon' : ''}`}/>
      </div>
      <div className={suggestionContainerClassName}>
        {show &&
          <ul ref={containerRef} className="suggestions">
            {
              filteredOptions?.map((option, index) => (
                <SuggestedItem
                  key={bindKey(option.value)}
                  index={index}
                  value={option.value}
                  isActive={activeIndex === index}
                  label={option.label}
                  onClick={handleOptionClick}
                />
              ))}
          </ul>
        }
        {!filteredOptions?.length
          && <div className="no-suggestions">
            <i>No suggestions!</i>
          </div>
        }
      </div>
    </div>
  );
};
