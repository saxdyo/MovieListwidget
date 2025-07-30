import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface HeartIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const HeartIcon: React.FC<HeartIconProps> = (props) => {
  return (
    <BaseIcon
      name="heart"
      path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      {...props}
    />
  );
};