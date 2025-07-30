import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface UnlockIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const UnlockIcon: React.FC<UnlockIconProps> = (props) => {
  return (
    <BaseIcon
      name="unlockicon"
      path="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
      {...props}
    />
  );
};
