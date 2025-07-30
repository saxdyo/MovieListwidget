import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface ClockIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const ClockIcon: React.FC<ClockIconProps> = (props) => {
  return (
    <BaseIcon
      name="clockicon"
      path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      {...props}
    />
  );
};
