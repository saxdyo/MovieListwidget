import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface LockIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const LockIcon: React.FC<LockIconProps> = (props) => {
  return (
    <BaseIcon
      name="lockicon"
      path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      {...props}
    />
  );
};
