import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface ArrowUpIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const ArrowUpIcon: React.FC<ArrowUpIconProps> = (props) => {
  return (
    <BaseIcon
      name="arrow-up"
      path="M5 10l7-7m0 0l7 7m-7-7v18"
      {...props}
    />
  );
};