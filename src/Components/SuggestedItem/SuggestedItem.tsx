import React, { useCallback } from 'react';
import { SuggestedItemProps } from './SuggestedItem.types';

export const SuggestedItem = <T extends unknown>(
  {
    isActive,
    value,
    index,
    label,
    onClick,
  }: SuggestedItemProps<T>) => {
  const className = `${isActive ? 'suggestion-active' : ''} suggestion`;
  const handleClick = useCallback(() => onClick(value, index), [ value, index, onClick ]);
  
  return (
    <li onClick={handleClick} className={className}>
      {label}
    </li>
  );
};
