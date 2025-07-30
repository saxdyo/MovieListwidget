import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface MinusIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const MinusIcon: React.FC<MinusIconProps> = (props) => {
  return (
    <BaseIcon
      name="minusicon"
      path="M20 12H4"
      {...props}
    />
  );
};
