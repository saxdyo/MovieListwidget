import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface EditIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const EditIcon: React.FC<EditIconProps> = (props) => {
  return (
    <BaseIcon
      name="editicon"
      path="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      {...props}
    />
  );
};
