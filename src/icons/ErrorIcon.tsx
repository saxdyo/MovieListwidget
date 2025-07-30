import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface ErrorIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const ErrorIcon: React.FC<ErrorIconProps> = (props) => {
  return (
    <BaseIcon
      name="erroricon"
      path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      {...props}
    />
  );
};
