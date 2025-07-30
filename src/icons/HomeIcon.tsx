import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface HomeIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const HomeIcon: React.FC<HomeIconProps> = (props) => {
  return (
    <BaseIcon
      name="home"
      path="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      {...props}
    />
  );
};