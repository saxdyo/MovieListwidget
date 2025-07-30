import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface SuccessIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const SuccessIcon: React.FC<SuccessIconProps> = (props) => {
  return (
    <BaseIcon
      name="successicon"
      path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      {...props}
    />
  );
};
