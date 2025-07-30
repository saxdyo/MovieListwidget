import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface PlusIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const PlusIcon: React.FC<PlusIconProps> = (props) => {
  return (
    <BaseIcon
      name="plus"
      path="M12 4v16m8-8H4"
      {...props}
    />
  );
};