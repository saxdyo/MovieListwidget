import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface UserIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const UserIcon: React.FC<UserIconProps> = (props) => {
  return (
    <BaseIcon
      name="user"
      path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      {...props}
    />
  );
};