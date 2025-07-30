import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface ArrowLeftIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = (props) => {
  return (
    <BaseIcon
      name="arrow-left"
      path="M10 19l-7-7m0 0l7-7m-7 7h18"
      {...props}
    />
  );
};