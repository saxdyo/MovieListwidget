import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface ArrowRightIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = (props) => {
  return (
    <BaseIcon
      name="arrow-right"
      path="M14 5l7 7m0 0l-7 7m7-7H3"
      {...props}
    />
  );
};