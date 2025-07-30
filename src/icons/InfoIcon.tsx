import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface InfoIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const InfoIcon: React.FC<InfoIconProps> = (props) => {
  return (
    <BaseIcon
      name="infoicon"
      path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      {...props}
    />
  );
};
