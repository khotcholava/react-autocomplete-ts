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
import { AutocompleteProps, KEYBOARD_KEYS, Option } from './Autocomplete.types';

/**
 *  Function to pass custom key to autocomplete element
 *
 *   bindKey: (value: T) => string | number;
 *   @param {value: T} passed option object
 *
 *   bindKey={(option: {name: 'John doe', user_id: number}) => option.user_id }
 */

const CONTAINER_HEIGHT = 200;
const ITEM_HEIGHT = 38;


function getScrollDownOffset(itemIndex: number) {
  return (ITEM_HEIGHT * (itemIndex + 1)) - CONTAINER_HEIGHT;
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
  const scrollRef = useRef<HTMLUListElement>(null);
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
  
  const handleArrowScroll = () => {
    const newActiveIndex = activeIndex < filteredOptions!.length - 1 ? activeIndex + 1 : activeIndex;
    const scrollDownOffset = getScrollDownOffset(newActiveIndex);
  
    if (scrollDownOffset > 0) {
      scrollRef.current!.scrollTop = scrollDownOffset;
    }
  }
  const handleArrowUpScroll = () => {
    const itemY = (ITEM_HEIGHT * activeIndex)
    if (itemY < CONTAINER_HEIGHT) {
      scrollRef.current!.scrollTop -= ITEM_HEIGHT
    }
  }
  
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
    if (e.key === KEYBOARD_KEYS.ENTER) {
      setActiveIndex(activeIndex);
      setShow(false);
      onChange(options[activeIndex].value);
    } else if (e.key === KEYBOARD_KEYS.ARROW_UP) {
      handleArrowUpScroll()
      setActiveIndex((prevState) => prevState > 0 ? prevState - 1 : (filteredOptions!.length - 1));

    } else if (e.key === KEYBOARD_KEYS.ARROW_DOWN) {
      handleArrowScroll()
      setActiveIndex((prevState => prevState < filteredOptions!.length - 1 ? prevState + 1 : prevState));
    } else {
      return;
    }
  }, [ activeIndex, filteredOptions, onChange, options ]);
  
  const handleOptionClick = useCallback((option: Option<T>, index: number) => {
    setActiveIndex(index);
    onChange(option.value);
  }, [ onChange ]);
  
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
          <ul ref={scrollRef} className="suggestions">
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
