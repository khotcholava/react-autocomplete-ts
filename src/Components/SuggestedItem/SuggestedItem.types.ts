import React from 'react';

export interface SuggestedItemProps<T> {
  isActive: boolean
  value: T
  index: number
  label: React.ReactNode
  onClick: (value: T, index: number) => void
}
