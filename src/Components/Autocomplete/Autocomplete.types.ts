export interface AutocompleteProps<T> {
  options: Array<Option<T>>;
  placeholder?: string;
  value: T | null;
  onChange: (value: T | null) => any,
  bindKey: (value: T) => string | number;
  onSearchChange?: (input: string) => void
}

export interface Option<T> {
  label: string;
  value: T;
}


export enum KEYBOARD_KEYS  {
  ENTER=  'Enter',
  ARROW_UP =  "ArrowUp",
  ARROW_DOWN = "ArrowDown"
}
