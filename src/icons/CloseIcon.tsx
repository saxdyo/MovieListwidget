import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface CloseIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const CloseIcon: React.FC<CloseIconProps> = (props) => {
  return (
    <BaseIcon
      name="close"
      path="M6 18L18 6M6 6l12 12"
      {...props}
    />
  );
};