import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface EyeIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const EyeIcon: React.FC<EyeIconProps> = (props) => {
  return (
    <BaseIcon
      name="eyeicon"
      path="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      {...props}
    />
  );
};
