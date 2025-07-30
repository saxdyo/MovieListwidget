import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface ArrowDownIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const ArrowDownIcon: React.FC<ArrowDownIconProps> = (props) => {
  return (
    <BaseIcon
      name="arrow-down"
      path="M19 14l-7 7m0 0l-7-7m7 7V3"
      {...props}
    />
  );
};