import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface SearchIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const SearchIcon: React.FC<SearchIconProps> = (props) => {
  return (
    <BaseIcon
      name="search"
      path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      {...props}
    />
  );
};