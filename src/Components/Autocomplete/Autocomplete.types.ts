import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

import './Autocomplete.css';
import { AiOutlineDown } from 'react-icons/ai';

export interface AutocompleteProps<T> {
  options: Array<Option<T>>;
  placeholder: string;
  value: T | null;
  onChange: (value: T | null) => any,
  bindKey: (value: T) => string | number;
  onSearchChange?: (input: string) => void
}

export interface Option<T> {
  label: string;
  value: T;
}

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
  const ref = useRef(null);
  const [ searchText, setSearchText ] = useState('');
  const [ activeIndex, setActiveIndex ] = useState(0);
  const [ filteredOptions, setFilteredOptions ] = useState<Array<Option<T>>>();
  const [ show, setShow ] = useState(false);
  
  const selectedOption = useMemo<Option<T> | null>(() => value
    ? options?.find(option => bindKey(option.value) === bindKey(value))!
    : null, [ bindKey, value, options ]);
  
  const selectedOptionIndex = useMemo<number>(() => value
    ? options?.findIndex(option => bindKey(option.value) === bindKey(value))!
    : 0, [ bindKey, value, options ]);
  
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setActiveIndex(0);
    onSearchChange?.(event.target.value);
    setSearchText(event.target.value);
  }, [ onSearchChange ]);
  
  const handleClickOutside = () => {
    setShow(false);
  };
  
  
  useClickOutside(ref, handleClickOutside);
  
  useEffect(() => {
    (async () => {
      const newFilteredOptions = options?.filter(option => option.label?.toLowerCase().includes(searchText?.toLowerCase()));
      setFilteredOptions(newFilteredOptions);
    })();
  }, [ searchText, options ]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveIndex(activeIndex);
      setShow(false);
      onChange(options[activeIndex].value);
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prevState) => prevState > 0 ? prevState - 1 : (filteredOptions!.length - 1));
    } else if (e.key === 'ArrowDown') {
      setActiveIndex((prevState => prevState < filteredOptions!.length - 1 ? prevState + 1 : prevState));
    } else {
      return;
    }
  }, [ activeIndex, options ]);
  
  const handleOptionClick = (option: Option<T>, index: number) => {
    setActiveIndex(index);
    onChange(option.value);
  };
  
  
  const handleShowSuggestions = useCallback(() => setShow(true), []);
  return (
    <div className="autocomplete-container">
      <div className="input-group">
        <input
          type="text"
          placeholder={placeholder}
          value={selectedOption?.label ?? searchText}
          ref={ref}
          onClick={handleShowSuggestions}
          onKeyDown={e => handleKeyDown(e)}
          onChange={handleChange}/>
        <AiOutlineDown className={`icon ${show ? 'rotate-icon' : ''}`}/>
      </div>
      <div
        className={`suggestions-container ${show ? 'animate-suggestions' : ''}`}
      >
        {
          show &&
          <ul className="suggestions">
            {
              filteredOptions?.map((option, index) => (
                <li
                  onClick={() => handleOptionClick(option, index)}
                  className={`${activeIndex === index && 'suggestion-active'} suggestion`}
                  key={bindKey(option.value)}>
                  {option.label}
                </li>
              ))}
          </ul>
        }
        {
          !filteredOptions?.length
          && <div className="no-suggestions">
            <em>No suggestions!</em>
          </div>
        }
      </div>
    </div>
  );
};
