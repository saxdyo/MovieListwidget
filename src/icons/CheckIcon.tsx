import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface CheckIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const CheckIcon: React.FC<CheckIconProps> = (props) => {
  return (
    <BaseIcon
      name="checkicon"
      path="M5 13l4 4L19 7"
      {...props}
    />
  );
};
