import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface LocationIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const LocationIcon: React.FC<LocationIconProps> = (props) => {
  return (
    <BaseIcon
      name="locationicon"
      path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      {...props}
    />
  );
};
