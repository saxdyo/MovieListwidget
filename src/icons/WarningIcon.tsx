import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface WarningIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const WarningIcon: React.FC<WarningIconProps> = (props) => {
  return (
    <BaseIcon
      name="warningicon"
      path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
      {...props}
    />
  );
};
